import json
import sys
import os
from typing import NamedTuple, List, Any, Literal, Dict, Tuple
import pandas
import re
from datetime import datetime
from PIL import Image

def name_similar(title: str, filename: str) -> bool:
    return title in filename

def get_front_photo_name(filename: str, filenames: List[str], df: pandas.DataFrame) -> str:
    name_without_verso = filename.replace(" verso", "").replace(" vesro", "").replace("_verso", "").replace(",verso", "").replace(" (verso)", "").replace("verso", "")
    if name_without_verso in filenames:
        return name_without_verso
    row = df[df["title"].apply(lambda x: name_similar(x, name_without_verso))]
    if not row.empty:
        return row.iloc[0]["image_title"]
    return name_without_verso

def clean_filename(filename: str) -> str:
    filename = re.sub(r'\(\d\)', '', filename)         # remove literal '(1)', '(2)', etc.
    return filename

def get_dupes_to_skip(filenames: List[str]) -> List[str]:
    dupes = []
    all_cleaned_filenames = [{"cleaned": clean_filename(filename), "original": filename} for filename in filenames]
    for filename in filenames:
        for cleaned_entry in all_cleaned_filenames:
            if cleaned_entry["cleaned"] == clean_filename(filename) and len(cleaned_entry["original"]) < len(filename):
                dupes.append(filename)
                break
    return dupes

def main(dir_path: str, csv_path: str):
    filenames = [
        x for x in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, x))
    ]
    dupes = [f for f in filenames if re.match(r'.*\(\d\).*\.jpe?g$', f)]
    filenames = [f for f in filenames if f not in dupes]

    df = pandas.read_csv(csv_path)
    back_photos = {}
    front_photos = []
    front_photos = list(df["image_title"])
    for filename in filenames:
      if "verso" in filename or "vesro" in filename:
        front_photo_name = get_front_photo_name(filename, filenames, df)
        back_photos[front_photo_name] = filename
        continue

    num_with_back = 0
    for front_photo in front_photos:
        if front_photo in back_photos:
            num_with_back += 1
    num_with_front = 0

    for front_photo in back_photos.keys():
        if front_photo in front_photos:
            num_with_front += 1

    print(f"Found {num_with_back} front photos with back photos out of {len(front_photos)} front photos.")
    print(f"Found {num_with_front} back photos with front photos out of {len(back_photos)} back photos.")

    with open("../data/out/backs_without_fronts.txt", "w") as f:
        for front_photo, back_photo in back_photos.items():
            if front_photo not in front_photos:
                f.write(f"{back_photo}\n")

    with open("../data/out/fronts_without_backs.txt", "w") as f:
        for front_photo in front_photos:
            if front_photo not in back_photos:
                f.write(f"{front_photo}\n")

    with open("../data/out/all_filenames.txt", "w") as f:
        for filename in filenames:
            f.write(f"{filename}\n")

    # Save back photos mapping
    mapping_title = f"../data/out/extracted_back_photos.json"
    print(f"Saving back photos mapping to {mapping_title}")
    with open(mapping_title, "w") as f:
        json.dump(back_photos, f)

# python create_back_photo_mapping.py "../data/2021 batch - all" "../data/out/extracted_painting_info_20251111_182029_with_ids.csv"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    csv_path = sys.argv[2]
    main(dir_path, csv_path)
