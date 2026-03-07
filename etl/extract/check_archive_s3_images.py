"""
Check which archive images are missing from the s3 bucket.
"""
import urllib.request
import urllib.error

BASE_URL = "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive"


def head_url(url: str) -> bool:
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status == 200
    except urllib.error.HTTPError:
        return False


def check_image(number: int) -> str | None:
    """Returns 'jpeg', 'jpg', or None if neither exists."""
    if head_url(f"{BASE_URL}/jg{number}.jpeg"):
        return "jpeg"
    if head_url(f"{BASE_URL}/jg{number}.jpg"):
        return "jpg"
    return None


def main():
    missing = []
    jpg_only = []
    for i in range(6, 1004):
        print(f"Checking jg{i}...")
        result = check_image(i)
        if result is None:
            missing.append(i)
        elif result == "jpg":
            jpg_only.append(i)

    print(f"\nMissing ({len(missing)}):")
    for i in missing:
        print(f"  jg{i}")

    print(f"\nJPG only (no .jpeg) ({len(jpg_only)}):")
    for i in jpg_only:
        print(f"  jg{i}")


# python check_archive_s3_images.py
if __name__ == "__main__":
    main()
