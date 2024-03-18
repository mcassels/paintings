"""
For paintings that were not entered into the spreadsheet,
read relevant info from the painting captions and create a CSV file.
"""
from PIL import Image
import os
import sys
import re
from typing import NamedTuple, Dict, List, Any
import pandas


class FrontPhoto(NamedTuple):
    name: str
    year: int
    front_filename: str
    damage_level: float
    medium: str
    height: int
    width: int


# python paintings_to_csv <directory with images>


def main(dir_name: str):
    img_description_tag = 270  # This is the tag with tag name == "ImageDescription"

    front_photos: Dict[str, FrontPhoto] = {}  # id -> FrontPhoto
    back_photos: Dict[str, str] = {}  # id or name -> back_filename

    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    for filename in filenames:
        image_path = os.path.join(dir_name, filename)
        try:
            img = Image.open(image_path)
        except Exception:
            print(f"{filename}: Could not open image")
            continue

        exif = img.getexif()

        description = exif.get(img_description_tag, None)
        if description is None:
            print(f"ERROR {filename}: No exif data")
            continue

        splits = description.split()

        # Back photo
        if "verso" in splits:
            name_or_id = " ".join([x for x in splits if x != "verso"])
            back_photos[name_or_id.lower()] = filename
            continue

        year_i = next(
            (i for i in range(len(splits)) if re.match(r"\d{4}", splits[i])), None
        )
        if year_i is None:
            print(f"ERROR {filename}: No year found. Description: {description}")
            continue

        year = int(splits[year_i])
        name = " ".join(splits[:year_i])

        id = next((x for x in splits if re.match(r"[bB][pP]\d+", x)), None)
        if id is None:
            print(f"ERROR {filename}: No id found. Description: {description}")
            continue

        height = None
        width = None
        dim_i = None
        for i in range(len(splits)):
            match = re.search(r"(\d+)x(\d+)", splits[i])
            if match:
                height = int(match.group(1))
                width = int(match.group(2))
                dim_i = i
        if height is None or width is None or dim_i is None:
            print(f"ERROR {filename}: No dimensions found. Description: {description}")
            continue

        medium_splits = []
        for i in range(dim_i + 1, len(splits)):
            if splits[i].startswith("dam"):
                break
            medium_splits.append(splits[i])
        medium = " ".join(medium_splits)

        damage_level = next((x for x in splits if re.match(r"dam[\d.]+", x)), None)
        if damage_level is not None:
            damage_level = damage_level[3:]
        else:
            damage_level = next((x for x in splits if re.match(r"d[\d.]+", x)), None)
            if damage_level is not None:
                damage_level = damage_level[1:]

        if damage_level is None:
            print(
                f"ERROR {filename}: No damage level found. Description: {description}"
            )
            continue

        front_photo = FrontPhoto(
            name=name,
            year=year,
            front_filename=filename,
            damage_level=float(damage_level),
            medium=medium,
            height=height,
            width=width,
        )
        front_photos[id] = front_photo

    rows: List[Dict[str, Any]] = []
    for (id, front_photo) in front_photos.items():
        back_filename = back_photos.get(id.lower(), None)
        if back_filename is None:
            back_filename = back_photos.get(front_photo.name.lower(), None)
        if back_filename is None:
            print(f"ERROR {id}: No back photo found")
            continue

        row = front_photo._asdict()
        row["id"] = id
        row["back_filename"] = back_filename
        rows.append(row)

    df = pandas.DataFrame.from_records(rows)
    df.to_excel("paintings.xlsx", index=False)


if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
