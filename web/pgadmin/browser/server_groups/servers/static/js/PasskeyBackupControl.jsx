import { useContext, useRef, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { SCHEMA_STATE_ACTIONS, SchemaStateContext } from 'sources/SchemaView/SchemaState';
import gettext from 'sources/gettext';

const BACKUP_VERSION = 1;
const BACKUP_APP = 'orca-db-panel';
const BACKUP_INFO = new TextEncoder().encode('ORCA DB PANEL server backup v1');
const EDITABLE_SERVER_FIELDS = new Set([
  'name', 'gid', 'host', 'port', 'db', 'username', 'role', 'password',
  'save_password', 'passexec', 'passexec_cmd', 'passexec_expiration',
  'service', 'shared_username', 'use_ssh_tunnel', 'tunnel_host',
  'tunnel_port', 'tunnel_username', 'tunnel_identity_file',
  'tunnel_prompt_password', 'tunnel_authentication', 'tunnel_password',
  'tunnel_keep_alive', 'save_tunnel_password', 'connection_string',
  'connection_params', 'db_res', 'db_res_type', 'prepare_threshold',
  'post_connection_sql', 'tags', 'comment', 'bgcolor', 'fgcolor',
  'kerberos_conn',
]);

function bytesToBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function randomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

function assertPasskeySupport() {
  if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
    throw new Error(gettext('Passkey backup requires HTTPS (or localhost) and a browser with WebAuthn support.'));
  }
}

function extractPrfOutput(credential) {
  const first = credential?.getClientExtensionResults?.()?.prf?.results?.first;
  if (!first) {
    throw new Error(gettext('This passkey provider does not support the secure PRF extension. Use a current phone or password manager that supports passkey encryption.'));
  }
  return new Uint8Array(first);
}

async function deriveBackupKey(prfOutput, salt) {
  const baseKey = await crypto.subtle.importKey('raw', prfOutput, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info: BACKUP_INFO },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function portableServerData(data) {
  return Object.fromEntries(
    Object.entries(data || {})
      .filter(([key]) => EDITABLE_SERVER_FIELDS.has(key))
      .map(([key, value]) => [key, value]),
  );
}

async function createPasskey(salt) {
  const challenge = randomBytes(32);
  const userId = randomBytes(16);
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'ORCA DB PANEL', id: window.location.hostname },
      user: {
        id: userId,
        name: 'orca-db-panel-backup',
        displayName: 'ORCA DB PANEL server backup',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        residentKey: 'required',
        requireResidentKey: true,
        userVerification: 'required',
      },
      timeout: 120000,
      extensions: { prf: { eval: { first: salt } } },
    },
  });
  if (!credential) throw new Error(gettext('No passkey was created.'));
  return credential;
}

async function unlockPasskey(credentialId, salt) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32),
      rpId: window.location.hostname,
      allowCredentials: [{ type: 'public-key', id: base64UrlToBytes(credentialId) }],
      userVerification: 'required',
      timeout: 120000,
      extensions: { prf: { eval: { first: salt } } },
    },
  });
  if (!assertion) throw new Error(gettext('The passkey could not unlock this backup.'));
  return assertion;
}

function downloadBackup(backup, name) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${(name || 'orca-server').replace(/[^a-z0-9_-]+/gi, '-')}-orca-passkey-backup.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function readBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);
        if (backup?.app !== BACKUP_APP || backup?.version !== BACKUP_VERSION ||
            !backup.credentialId || !backup.salt || !backup.iv || !backup.ciphertext) {
          throw new Error(gettext('This is not a valid ORCA DB PANEL passkey backup.'));
        }
        resolve(backup);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error(gettext('The backup file could not be read.')));
    reader.readAsText(file);
  });
}

export default function PasskeyBackupControl({ dataDispatch, viewHelperProps }) {
  const schemaState = useContext(SchemaStateContext);
  const fileInput = useRef(null);
  const [status, setStatus] = useState(null);
  const [working, setWorking] = useState(false);

  if (viewHelperProps?.mode !== 'create') return null;

  const makeBackup = async () => {
    setWorking(true);
    setStatus(null);
    try {
      assertPasskeySupport();
      const salt = randomBytes(32);
      const credential = await createPasskey(salt);
      const prfOutput = extractPrfOutput(credential);
      const key = await deriveBackupKey(prfOutput, salt);
      const iv = randomBytes(12);
      const payload = {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        createdAt: new Date().toISOString(),
        server: portableServerData(schemaState?.value([])),
      };
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(payload)),
      );
      downloadBackup({
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        credentialId: bytesToBase64Url(new Uint8Array(credential.rawId)),
        salt: bytesToBase64Url(salt),
        iv: bytesToBase64Url(iv),
        ciphertext: bytesToBase64Url(new Uint8Array(encrypted)),
      }, schemaState?.value(['name']));
      setStatus({ severity: 'success', message: gettext('Encrypted passkey backup downloaded. Keep the file and the same synced passkey together.') });
    } catch (error) {
      setStatus({ severity: 'error', message: error?.message || gettext('Passkey backup failed.') });
    } finally {
      setWorking(false);
    }
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setWorking(true);
    setStatus(null);
    try {
      assertPasskeySupport();
      const backup = await readBackup(file);
      const salt = base64UrlToBytes(backup.salt);
      const assertion = await unlockPasskey(backup.credentialId, salt);
      const key = await deriveBackupKey(extractPrfOutput(assertion), salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64UrlToBytes(backup.iv) },
        key,
        base64UrlToBytes(backup.ciphertext),
      );
      const payload = JSON.parse(new TextDecoder().decode(decrypted));
      if (payload?.app !== BACKUP_APP || payload?.version !== BACKUP_VERSION || !payload.server) {
        throw new Error(gettext('The decrypted backup payload is invalid.'));
      }
      Object.entries(portableServerData(payload.server)).forEach(([keyName, value]) => {
        dataDispatch?.({ type: SCHEMA_STATE_ACTIONS.SET_VALUE, path: [keyName], value });
      });
      setStatus({ severity: 'success', message: gettext('Server details imported. Review the fields, choose a server group, and then save.') });
    } catch (error) {
      setStatus({ severity: 'error', message: error?.message || gettext('Passkey import failed. The passkey or backup file may not match.') });
    } finally {
      setWorking(false);
    }
  };

  return (
    <Box className="orca-passkey-backup" sx={{ border: '1px solid #000', padding: '12px', margin: '8px 0 16px' }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.04em' }}>
          {gettext('ORCA PASSKEY BACKUP')}
        </Typography>
        <Typography variant="body2">
          {gettext('Create an encrypted backup of this server connection, including saved database and SSH passwords. A passkey unlocks the backup; the passkey itself never stores the credentials.')}
        </Typography>
        <Typography variant="caption">
          {gettext('The backup includes the current form values. Local SSH identity-file contents are not embedded, so keep those files separately.')}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button type="button" variant="contained" onClick={makeBackup} disabled={working}>
            {gettext('Make passkey backup')}
          </Button>
          <Button type="button" variant="outlined" onClick={() => fileInput.current?.click()} disabled={working}>
            {gettext('Import from passkey')}
          </Button>
        </Stack>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={importBackup} />
        {status && <Alert severity={status.severity} variant="outlined">{status.message}</Alert>}
      </Stack>
    </Box>
  );
}

PasskeyBackupControl.propTypes = {
  dataDispatch: Function,
  viewHelperProps: Object,
};
