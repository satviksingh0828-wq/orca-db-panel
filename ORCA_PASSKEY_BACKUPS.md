# ORCA DB PANEL passkey backups

ORCA DB PANEL includes a **Passkey Backup** action in the **Register Server** dialog. It is intended for deployments where the application data volume may be replaced during a redeploy.

## What the backup does

The action creates a new discoverable passkey using WebAuthn and requests the WebAuthn **PRF** extension. The PRF output is combined with a random salt through HKDF and used as a non-exportable 256-bit AES-GCM key in the browser. The resulting JSON backup contains only the encrypted ciphertext and the information required to locate the passkey. The passkey private key and the cleartext database credentials are never written to the backup file.

> A passkey is an authentication credential; it is not a general-purpose storage container. ORCA uses the passkey to unlock an encrypted backup file rather than pretending that a phone wallet can directly hold arbitrary PostgreSQL credentials.

## Included connection data

The encrypted payload includes the current Register Server form values for the server name, server group, host, port, maintenance database, username, database password, save-password preference, role, service, connection parameters, SSH tunnel settings and tunnel password, password-exec settings, database restrictions, comments, colors, Kerberos setting, tags, and post-connection SQL. Values are captured from the form only when the operator explicitly selects **Make passkey backup**.

The backup does not embed the contents of an SSH identity file. If the server uses SSH key authentication, keep the identity file in a separate protected backup and restore it before connecting.

## Recovery after a redeploy

Open **Register Server**, select **Import from passkey**, choose the `.json` backup file, and approve the matching passkey on the phone, hardware key, or password manager that created it. The fields are populated locally in the form. Review the host, port, user, database, password, SSH settings, and server group, then save the server.

The same passkey must be available to the browser. A synced passkey may work on another device when the credential provider supports syncing and PRF. Browser support, authenticator support, and provider policies vary. ORCA refuses to create or import a backup when WebAuthn PRF is unavailable instead of falling back to an insecure export.

## Operational guidance

Store the backup file like a password vault export: keep it private, do not commit it to Git, and do not place it in a public download directory. The file is encrypted, but anyone who has both the file and access to the matching passkey can unlock the connection details. If a credential is compromised, rotate the PostgreSQL and SSH passwords and create a new backup.
