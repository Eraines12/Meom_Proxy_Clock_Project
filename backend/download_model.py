"""Explicit authenticated download of the pinned model, never the dataset."""
import argparse
from pathlib import Path

from .inference import load_manifest, sha256_file


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("model/Clock_Drawing_ResNet50_Model.keras"))
    args = parser.parse_args()
    manifest = load_manifest()
    if args.output.exists():
        if sha256_file(args.output) == manifest["sha256"]:
            print("Verified model already present.")
            return
        parser.error("Output already exists with a different checksum; choose a new path.")
    import google.auth
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload
    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/drive.readonly"])
    service = build("drive", "v3", credentials=credentials, cache_discovery=False)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(".keras.part")
    try:
        with temporary.open("wb") as handle:
            downloader = MediaIoBaseDownload(handle, service.files().get_media(
                fileId=manifest["driveFileId"], supportsAllDrives=True), chunksize=1024 * 1024)
            done = False
            while not done:
                _, done = downloader.next_chunk(num_retries=3)
        if sha256_file(temporary) != manifest["sha256"]:
            raise ValueError("Downloaded checkpoint checksum mismatch")
        temporary.replace(args.output)
    finally:
        temporary.unlink(missing_ok=True)
    print("Trained model downloaded and checksum verified.")


if __name__ == "__main__":
    main()
