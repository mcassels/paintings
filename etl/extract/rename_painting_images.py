"""
Rename paintings as follows:
Front image is just called "BP<id>".jpeg
Verso image is called "BP<id>_verso".jpeg
"""
import sys
import os
import re
import pandas
from typing import Set
from utils import get_image_description


def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    new_filenames = set()
    for filename in filenames:
        if filename == ".DS_Store":
            continue
        image_path = os.path.join(dir_name, filename)
        description = get_image_description(image_path)

        new_filename = None
        if description is None:
            if filename == "IMG_0502.jpeg":  # Alisa provided this
                new_filename = "bp5_verso.jpeg"
            else:
                print(f"{filename}: No description")
                continue
        else:
            splits = description.split()
            id = next((x for x in splits if re.match(r"[bB][pP]\d+", x)), None)
            if id is None:
                nbpid = next((x for x in splits if re.match(r"[nN][bB][pP]\d+", x)), None)
                if nbpid is not None:
                    id = nbpid
                else:
                    print(f"{filename}: No BP or NBP id found. Description: {description}")
                    continue

            # There were 2 paintings with id=bp13.
            if (
                id.lower() == "bp13"
                and description
                == "Untitled two female nudes 24x30 oil on panel dam4 bp13"
            ):
                id = "bp19"
            if filename == "IMG_0755.jpeg":
                id = "bp110" # bp110_verso was mislabeled

            new_filename = f"{id}.jpeg" if "verso" not in splits else f"{id}_verso.jpeg"

        if new_filename == "bp105.jpeg" and filename == "IMG_0745.jpeg":
            new_filename = "bp105_verso.jpeg" # This should have said "verso" in the description
        if new_filename is None:
            print(f"ERROR {filename}: No new filename")
            continue

        new_filename = new_filename.lower()
        if new_filename in new_filenames:
            print(f"ERROR: {filename} maps to duplicate filename {new_filename}. Description: {description}")
            continue

        os.rename(image_path, os.path.join(dir_name, new_filename))
        new_filenames.add(new_filename)

    front_photos = set([x.split(".")[0] for x in new_filenames if "_verso" not in x])
    back_photos = set([x.split("_")[0] for x in new_filenames if "_verso" in x])
    print(f"Front photos missing back photo: {front_photos - back_photos}")
    print(f"Back photos missing front photo: {back_photos - front_photos}")


# python3 rename_painting_images.py "../../data/images/1. broken paintings batch 1"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
