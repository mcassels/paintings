"""
Rename paintings as follows:
Front image is just called "BP<id>".jpeg
Verso image is called "BP<id>_verso".jpeg
"""
import sys
import os
import re
import pandas
from typing import Dict, List
from utils import get_image_description


def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    records: List[Dict[str, str]] = []
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

            new_filename = f"{id}.jpeg" if "verso" not in splits else f"{id}_verso.jpeg"

        if new_filename is None:
            print(f"ERROR {filename}: No new filename")
            continue

        new_filename = new_filename.lower()
        os.rename(image_path, os.path.join(dir_name, new_filename))
        records.append({"old_filename": filename, "new_filename": new_filename})
    df = pandas.DataFrame.from_records(records)
    df.to_csv("renamed_images.csv", index=False)


# python3 rename_painting_images.py "../../data/images/1. broken paintings batch 1"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
