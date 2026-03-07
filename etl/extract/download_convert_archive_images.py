"""
Download archive images from S3 and save as .jpeg locally.
Tries .jpeg first, falls back to .jpg.
Requires Pillow: pip install Pillow
"""
import urllib.request
import urllib.error
from pathlib import Path
from PIL import Image
import io

BASE_URL = "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive"
OUTPUT_DIR = Path("downloaded_images")

IDS = [
    866, 867, 868, 869, 870, 871, 872, 873, 874, 875,
    876, 877, 878, 879, 880, 881, 882, 883, 884, 885,
    886, 887,
]


def fetch_image(number: int) -> bytes | None:
    """Try .jpeg then .jpg; return raw bytes or None if neither found."""
    for ext in ("jpeg", "jpg"):
        url = f"{BASE_URL}/jg{number}.{ext}"
        try:
            with urllib.request.urlopen(url) as response:
                print(f"  Found jg{number}.{ext}")
                return response.read()
        except urllib.error.HTTPError:
            pass
    return None


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    failed = []

    for number in IDS:
        print(f"Processing jg{number}...")
        data = fetch_image(number)
        if data is None:
            print(f"  NOT FOUND")
            failed.append(number)
            continue

        out_path = OUTPUT_DIR / f"jg{number}.jpeg"
        image = Image.open(io.BytesIO(data)).convert("RGB")
        image.save(out_path, "JPEG")
        print(f"  Saved to {out_path}")

    if failed:
        print(f"\nFailed to download ({len(failed)}): {', '.join(f'jg{i}' for i in failed)}")
    else:
        print("\nAll images downloaded successfully.")


# python download_convert_archive_images.py
if __name__ == "__main__":
    main()
