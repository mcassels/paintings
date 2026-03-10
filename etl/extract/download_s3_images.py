"""
Download all jg images from s3 archive.
"""
import os
import urllib.request
import urllib.error

BASE_URL = "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive"
OUTPUT_DIR = "downloaded_images"


def download_image(number: int, output_dir: str) -> bool:
    """Download jg{number}.jpeg if it exists. Returns True on success."""
    url = f"{BASE_URL}/jg{number}.jpeg"
    dest = os.path.join(output_dir, f"jg{number}.jpeg")
    try:
        urllib.request.urlretrieve(url, dest)
        return True
    except urllib.error.HTTPError:
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    missing = []
    for i in range(6, 1004):
        print(f"Downloading jg{i}...")
        if download_image(i, OUTPUT_DIR):
            print(f"  Saved jg{i}.jpeg")
        else:
            missing.append(i)
            print(f"  Not found: jg{i}.jpeg")

    print(f"\nMissing ({len(missing)}):")
    for i in missing:
        print(f"  jg{i}")


# python download_s3_images.py
if __name__ == "__main__":
    main()
