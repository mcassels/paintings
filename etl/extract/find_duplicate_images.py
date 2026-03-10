"""
Find possible duplicate images in a directory.
Images are considered potential duplicates if they are visually similar
(e.g. same painting photographed under different lighting conditions).
Uses perceptual hashing (phash) to compare images.

Requires: pip install Pillow imagehash
"""
import sys
import os
from typing import List, Tuple
import imagehash
from PIL import Image


BASE_URL = "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive"

# Maximum hamming distance between hashes to consider images as duplicates.
# 0 = identical hash, 64 = completely different. 10 is a good default for
# "same subject, different lighting/angle" matches.
DEFAULT_THRESHOLD = 10


def get_image_files(dir_name: str) -> List[str]:
    extensions = {".jpg", ".jpeg", ".png", ".heic", ".tiff", ".bmp", ".webp"}
    return [
        x for x in os.listdir(dir_name)
        if os.path.isfile(os.path.join(dir_name, x))
        and os.path.splitext(x.lower())[1] in extensions
    ]


def compute_hashes(dir_name: str, filenames: List[str]) -> List[Tuple[str, imagehash.ImageHash]]:
    hashes = []
    for filename in filenames:
        path = os.path.join(dir_name, filename)
        try:
            with Image.open(path) as img:
                h = imagehash.phash(img)
            hashes.append((filename, h))
        except Exception as e:
            print(f"  WARNING: could not hash {filename}: {e}")
    return hashes


def main(dir_name: str, threshold: int = DEFAULT_THRESHOLD):
    filenames = get_image_files(dir_name)
    print(f"Found {len(filenames)} image(s) in {dir_name}")
    print(f"Computing perceptual hashes (threshold={threshold})...")

    hashes = compute_hashes(dir_name, filenames)

    duplicate_groups: List[List[str]] = []
    seen = set()

    for i in range(len(hashes)):
        name_i, hash_i = hashes[i]
        if name_i in seen:
            continue
        group = [name_i]
        for j in range(i + 1, len(hashes)):
            name_j, hash_j = hashes[j]
            if name_j in seen:
                continue
            distance = hash_i - hash_j
            if distance <= threshold:
                group.append(name_j)
                seen.add(name_j)
        if len(group) > 1:
            seen.add(name_i)
            duplicate_groups.append(group)

    if not duplicate_groups:
        print("No potential duplicates found.")
        return

    print(f"\nFound {len(duplicate_groups)} group(s) of potential duplicates:\n")
    for i, group in enumerate(duplicate_groups, 1):
        titles = " & ".join(os.path.splitext(name)[0].upper() for name in group)
        urls = "  ".join(f"{BASE_URL}/{name}" for name in group)
        print(f"{i}. {titles}:  {urls}")


# python3 find_duplicate_images.py "/path/to/images"
# python3 find_duplicate_images.py "/path/to/images" 15
if __name__ == "__main__":
    dir_name = sys.argv[1]
    threshold = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_THRESHOLD
    main(dir_name, threshold)
