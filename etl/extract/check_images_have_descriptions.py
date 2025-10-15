from extract.utils import get_image_description
import os
import sys

def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]
    has_description = 0
    all = 0
    for filename in filenames:
        if filename.lower().endswith(".heic"):
            continue

        if filename != "IMG_9520.jpeg":
            continue
        description = get_image_description(os.path.join(dir_name, filename))
        if description is not None:
            has_description += 1
        all += 1
        print(f"description for {filename}: {description}")
    print(f"{has_description}/{all} images have descriptions")

if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
