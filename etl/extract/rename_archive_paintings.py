"""
Rename paintings as follows:

description for IMG_9667.jpeg: Jg103 verso
description for IMG_9519.jpeg: Jg66

IMG_9667.jpeg -> jg103_verso.jpeg
IMG_9519.jpeg -> jg66.jpeg
"""
import sys
import os
import re
import json
from utils import get_image_description


def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    new_filename_mapping = {}
    for filename in filenames:
        if filename == ".DS_Store":
            continue
        image_path = os.path.join(dir_name, filename)
        description = get_image_description(image_path)

        new_filename = None
        if description is None:
            print(f"{filename}: No description")
            continue

        splits = [x.lower() for x in description.split()]
        if len(splits) == 0:
            print(f"{filename}: Empty description")
            continue

        id = splits[0]
        if not re.match(r"jg\d+", id):
            print(f"{filename}: Description does not start with JG id. Description: {description}")
            continue

        if len(splits) == 1:
            new_filename = f"{id}.jpeg"
        elif len(splits) == 2 and splits[1] == "verso":
            new_filename = f"{id}_verso.jpeg"
        else:
            print(f"{filename}: Unexpected description format. Description: {description}")
            continue

        if new_filename in dict.values(new_filename_mapping):
            print(f"ERROR: {filename} maps to duplicate filename {new_filename}. Description: {description}")
            continue

        os.rename(image_path, os.path.join(dir_name, new_filename))
        new_filename_mapping[filename] = new_filename

    new_filenames = dict.values(new_filename_mapping)
    front_photos = set([x.split(".")[0] for x in new_filenames if "_verso" not in x])
    back_photos = set([x.split("_")[0] for x in new_filenames if "_verso" in x])
    print(f"Front photos missing back photo: {front_photos - back_photos}")
    print(f"Back photos missing front photo: {back_photos - front_photos}")

    with open(f"{dir_name}/filename_mapping.json", 'w') as f:
        json.dump(new_filename_mapping, f, indent=4)
    print(f"Wrote filename mapping to {dir_name}/filename_mapping.json")


# python rename_archive_paintings.py "../data/august_26_sept_5"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
