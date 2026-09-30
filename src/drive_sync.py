"""Google Drive I/O helpers extracted from both notebooks.

Every function requires an already-authenticated Drive ``service`` client
passed in by the caller (for example, built in Colab after
``google.colab.auth.authenticate_user()``, or elsewhere via a service
account). Nothing in this module authenticates on its own, downloads data,
or uploads data merely by being imported. Data downloads and Drive uploads
must be explicitly invoked by the caller, and require access already
authorized under the NHATS Conditions of Use and the project's controlled
Drive folder permissions (see restricted_data/README.md and model/README.md).
"""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Dict, List, Optional


def list_drive_children(service, folder_id: str) -> List[dict]:
    """Page through a folder's non-trashed children. Mirrors both notebooks' loops."""
    results: List[dict] = []
    token: Optional[str] = None
    while True:
        response = (
            service.files()
            .list(
                q=f"'{folder_id}' in parents and trashed = false",
                fields="nextPageToken,files(id,name,size,md5Checksum,mimeType)",
                pageSize=1000,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
                pageToken=token,
            )
            .execute(num_retries=3)
        )
        results.extend(response.get("files", []))
        token = response.get("nextPageToken")
        if not token:
            return results


def download_drive_file_bytes(service, file_id: str) -> bytes:
    """Download one file's raw bytes by Drive file ID."""
    return service.files().get_media(fileId=file_id).execute(num_retries=3)


def require_private_access(service, file_id: str, name: str) -> None:
    """Raise if a Drive file/folder is shared with 'anyone' or the whole domain.

    Mirrors ``require_private`` in notebooks/Data_Preprocessing.ipynb: this
    is a safety check, not a permission changer. It never modifies sharing;
    the caller must fix access in Drive and re-run.
    """
    token: Optional[str] = None
    permissions: List[dict] = []
    while True:
        response = (
            service.permissions()
            .list(
                fileId=file_id,
                supportsAllDrives=True,
                fields="nextPageToken,permissions(type,role)",
                pageToken=token,
            )
            .execute(num_retries=3)
        )
        permissions.extend(response.get("permissions", []))
        token = response.get("nextPageToken")
        if not token:
            break
    if not permissions or any(p["type"] in {"anyone", "domain"} for p in permissions):
        raise RuntimeError(
            f"{name} must be restricted to the authorized team before this action. "
            "Change General access in Drive, then retry."
        )


def create_drive_folder(service, name: str, parent_folder_id: str) -> dict:
    """Create a subfolder under an existing Drive folder. Returns the new file resource."""
    from googleapiclient.http import MediaFileUpload  # noqa: F401  (kept local; optional dep)

    body = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_folder_id],
    }
    return service.files().create(body=body, fields="id,webViewLink").execute(num_retries=3)


def upload_file_to_drive(
    service,
    local_path: Path,
    parent_folder_id: str,
    existing_file_id: Optional[str] = None,
    mime_type: Optional[str] = None,
) -> dict:
    """Upload (create or update) one local file to Drive, verifying the MD5 checksum.

    Mirrors the upload loops in both notebooks. Raises if the checksum
    returned by Drive does not match the local file's MD5.
    """
    from googleapiclient.http import MediaFileUpload

    local_path = Path(local_path)
    digest = hashlib.md5(local_path.read_bytes()).hexdigest()
    media = MediaFileUpload(str(local_path), mimetype=mime_type, resumable=True)
    if existing_file_id:
        request = service.files().update(
            fileId=existing_file_id,
            media_body=media,
            fields="id,name,md5Checksum",
            supportsAllDrives=True,
        )
    else:
        request = service.files().create(
            body={"name": local_path.name, "parents": [parent_folder_id]},
            media_body=media,
            fields="id,name,md5Checksum",
            supportsAllDrives=True,
        )
    response = None
    while response is None:
        _, response = request.next_chunk(num_retries=3)
    if response.get("md5Checksum") != digest:
        raise RuntimeError(f"Upload checksum mismatch: {local_path.name}")
    return response


def index_children_by_name(children: List[dict]) -> Dict[str, dict]:
    """Convenience helper: map Drive child file resources by their name."""
    return {child["name"]: child for child in children}
