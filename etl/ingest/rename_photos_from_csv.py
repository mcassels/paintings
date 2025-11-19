from pyairtable import Api
import sys
import os
from dotenv import load_dotenv
from typing import NamedTuple, List, Any, Literal
import pandas
import shutil
import json


def main(csv_path: str, photo_dir: str, back_images_json: str):
    df = pandas.read_csv(csv_path)
    renamed_image_dir = csv_path.replace(".csv", "_renamed_images")
    verso_dir = csv_path.replace(".csv", "_renamed_verso_images")
    os.makedirs(renamed_image_dir, exist_ok=True)
    os.makedirs(verso_dir, exist_ok=True)

    verso_mappings = json.load(open(back_images_json, "r"))
    verso_mappings = {k.replace(" .jpeg", ".jpeg"): v for k, v in verso_mappings.items()}

    versos_missing = 0
    total = 0
    verso_images_used = []

    for _, row in df.iterrows():
        jgid = row["jgid"]
        img_name = jgid.lower() + ".jpeg"
        #shutil.copy(f"{photo_dir}/{row['image_title']}", os.path.join(renamed_image_dir, img_name))
        total += 1

        verso_image = verso_mappings.get(row["image_title"])
        if verso_image is not None:
            verso_img_name = jgid.lower() + "_verso.jpeg"
            #shutil.copy(f"{photo_dir}/{verso_image}", os.path.join(verso_dir, verso_img_name))
            verso_images_used.append(verso_image)
        else:
            versos_missing += 1

    if versos_missing > 0:
        print(f"Warning: {versos_missing} verso images were missing.")
    print(f"Total images processed: {total}")

    print(f"Renamed images copied to {renamed_image_dir}")
    print(f"Renamed verso images copied to {verso_dir}")
    print(f"UNUSED VERSO IMAGES:")
    for verso_image in verso_mappings.values():
        if verso_image not in verso_images_used:
            print(verso_image)

# python rename_photos_from_csv.py "../data/out/extracted_painting_info_20251111_182029_with_ids.csv" "../data/2021 batch - all" "../data/out/extracted_back_photos_20251111_182029.json"
if __name__ == "__main__":
    csv_path = sys.argv[1]
    photo_dir = sys.argv[2]
    back_images_json = sys.argv[3]
    main(csv_path, photo_dir, back_images_json)
