"""Optional dual persistence for the local pgAdmin configuration database.

The local SQLite database remains the primary runtime store. When Supabase
configuration is present, this module stores a compressed, base64-encoded
snapshot as a second durable copy and restores it only when the local file is
missing. Failures are deliberately non-fatal so an unavailable Supabase
endpoint never prevents the dashboard from starting or saving locally.
"""

from __future__ import annotations

import base64
import gzip
import hashlib
import json
import logging
import os
import threading
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

_LOG = logging.getLogger(__name__)
_LOCK = threading.Lock()
_STATE_KEY = "orca-pgadmin-config-db"


def _settings():
    url = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        or os.environ.get("SUPABASE_KEY", "").strip()
        or os.environ.get("SUPABASE_ANON_KEY", "").strip()
    )
    if not url or not key:
        return None
    return url, key


def enabled() -> bool:
    return _settings() is not None


def _endpoint():
    url, key = _settings()
    return (
        f"{url}/rest/v1/orca_pgadmin_state",
        {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )


def _request(method: str, url: str, headers: dict, payload=None):
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=8) as response:
        raw = response.read()
        return json.loads(raw.decode("utf-8")) if raw else None


def _encode_database(path: Path):
    raw = path.read_bytes()
    compressed = gzip.compress(raw, compresslevel=6)
    return {
        "state_key": _STATE_KEY,
        "db_snapshot_base64": base64.b64encode(compressed).decode("ascii"),
        "checksum": hashlib.sha256(raw).hexdigest(),
        "captured_at": datetime.now(timezone.utc).isoformat(),
    }


def restore_if_missing(sqlite_path: str | os.PathLike) -> bool:
    """Restore the latest remote copy only when the local file is absent."""
    path = Path(sqlite_path)
    if path.exists() or not enabled():
        return False
    try:
        endpoint, headers = _endpoint()
        query = urllib.parse.urlencode({"state_key": f"eq.{_STATE_KEY}", "select": "db_snapshot_base64,checksum"})
        rows = _request("GET", f"{endpoint}?{query}", headers) or []
        if not rows:
            return False
        row = rows[0]
        raw = gzip.decompress(base64.b64decode(row["db_snapshot_base64"]))
        checksum = hashlib.sha256(raw).hexdigest()
        if checksum != row.get("checksum"):
            raise ValueError("Supabase snapshot checksum mismatch")
        path.parent.mkdir(parents=True, exist_ok=True)
        temp = path.with_suffix(path.suffix + ".restore")
        temp.write_bytes(raw)
        os.replace(temp, path)
        _LOG.info("Restored the local pgAdmin configuration database from Supabase")
        return True
    except Exception as exc:  # startup must remain available if remote storage is down
        _LOG.warning("Supabase restore skipped: %s", exc)
        return False


def mirror(sqlite_path: str | os.PathLike) -> bool:
    """Upload a committed local snapshot using an idempotent upsert."""
    path = Path(sqlite_path)
    if not enabled() or not path.is_file():
        return False
    try:
        with _LOCK:
            payload = _encode_database(path)
            endpoint, headers = _endpoint()
            headers = {**headers, "Prefer": "resolution=merge-duplicates,return=minimal"}
            _request("POST", endpoint, headers, payload)
        return True
    except (OSError, urllib.error.URLError, ValueError, KeyError) as exc:
        _LOG.warning("Supabase mirror skipped: %s", exc)
        return False


def register(app, sqlite_path: str | os.PathLike):
    """Register a low-cost post-response mirror for the Flask application."""
    if not enabled():
        return

    state = {"mtime_ns": None}

    @app.after_request
    def _mirror_after_request(response):
        path = Path(sqlite_path)
        try:
            mtime_ns = path.stat().st_mtime_ns
            if state["mtime_ns"] != mtime_ns:
                if mirror(path):
                    state["mtime_ns"] = mtime_ns
        except OSError:
            pass
        return response

    app.logger.info("Supabase dual persistence enabled for the pgAdmin configuration database")
