import json
import sys
import os
from typing import NamedTuple, List, Any, Literal, Dict, Tuple
import pandas
import re
from datetime import datetime
from PIL import Image
from dotenv import load_dotenv
from pyairtable import Api
import shutil


def main(dir_path: str, csv_path: str, mapping_path: str):
    mappings = json.load(open(mapping_path, "r"))
    df = pandas.read_csv(csv_path)
    verso_dir = csv_path.replace(".csv", "_renamed_verso_images")
    os.makedirs(verso_dir, exist_ok=True)

    mapping_not_found = 0
    back_image_not_found = 0
    total_paintings = 0
    num_renamed = 0
    image_titles_processed = []
    for _, row in df.iterrows():
        total_paintings += 1
        image_titles_processed.append(row["image_title"])
        jgid = row["jgid"]
        back_image_filename = mappings.get(row["image_title"])
        if back_image_filename is None:
            mapping_not_found += 1
            continue

        back_image_path = os.path.join(dir_path, back_image_filename)
        if not os.path.exists(back_image_path):
            back_image_not_found += 1
            continue
        shutil.copy(back_image_path, os.path.join(verso_dir, f"{jgid.lower()}_verso.jpeg"))
        num_renamed += 1



    print(f"Total paintings processed: {total_paintings}")
    print(f"Mappings not found: {mapping_not_found}")
    print(f"Back images not found: {back_image_not_found}")
    print(f"Back images renamed and copied: {num_renamed}")

    unprocessed_images = [x for x in mappings.keys() if x not in image_titles_processed]
    with open("../data/out/unprocessed_images.txt", "w") as f:
        for img in unprocessed_images:
            f.write(f"{img}\n")

# python rename_back_photos.py "../data/2021 batch - all" "../data/out/extracted_painting_info_20251111_182029_with_ids.csv" "../data/out/extracted_back_photos.json"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    csv_path = sys.argv[2]
    mapping_path = sys.argv[3]
    main(dir_path, csv_path, mapping_path)
