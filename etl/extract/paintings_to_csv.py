"""
For paintings that were not entered into the spreadsheet,
read relevant info from the painting captions and create a CSV file.
"""
import os
import sys
import re
from typing import NamedTuple, Dict, List, Any
import pandas
from utils import get_image_description


class FrontPhoto(NamedTuple):
    name: str | None
    year: int | None
    front_filename: str
    damage_level: float | None
    medium: str
    height: int
    width: int
    description: str | None = None


# python paintings_to_csv <directory with images>
def main(dir_name: str):
    front_photos: Dict[str, FrontPhoto] = {}  # id -> FrontPhoto
    back_photos: Dict[str, str] = {}  # id or name -> back_filename

    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    for filename in filenames:
        image_path = os.path.join(dir_name, filename)
        description = get_image_description(image_path)
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

        name = None
        year = None
        if year_i is not None:
            year = int(splits[year_i])
            name = " ".join(splits[:year_i])

        id = next((x for x in splits if re.match(r"[bB][pP]\d+", x)), None)
        if id is None:
            print(f"ERROR {filename}: No id found. Description: {description}")
            continue

        # There were 2 paintings with id=bp13.
        if (
            id.lower() == "bp13"
            and description == "Untitled two female nudes 24x30 oil on panel dam4 bp13"
        ):
            id = "bp19"

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

        front_photo = FrontPhoto(
            name=name,
            year=year,
            front_filename=filename,
            damage_level=float(damage_level) if damage_level is not None else None,
            medium=medium,
            height=height,
            width=width,
            description=description,
        )
        if id in front_photos.keys():
            raise Exception(
                f"ERROR: Duplicate id {id}. {filename} ({description}) and {front_photos[id].front_filename} ({front_photos[id].description})"
            )
        front_photos[id] = front_photo

    rows: List[Dict[str, Any]] = []
    for (id, front_photo) in front_photos.items():
        back_filename = back_photos.get(id.lower(), None)
        if back_filename is None and front_photo.name is not None:
            back_filename = back_photos.get(front_photo.name.lower(), None)
        if back_filename is None:
            print(f"ERROR {id}: No back photo found")

        row = front_photo._asdict()
        row["id"] = id.upper()
        row["back_filename"] = back_filename
        rows.append(row)

    df = pandas.DataFrame.from_records(rows)
    # Make the schema match the "Jim paintings inventory" google sheet
    for col in [
        "date_guess",
        "location",
        "owner",
        "condition notes",
        "framed",
        "signed",
        "image_front",
        "additional_images",
        "price",
        "predominant color",
        "subject matter",
        "red dot",
    ]:
        df[col] = None

    df["bp_number"] = df["id"].apply(lambda x: int(x[2:]))
    df.sort_values("bp_number", inplace=True)
    for description in list(df["description"]):
        print(description)

    df.to_excel(
        "paintings.xlsx",
        columns=[
            "id",
            "name",
            "year",
            "date_guess",
            "medium",
            "height",
            "width",
            "location",
            "owner",
            "damage_level",
            "condition notes",
            "framed",
            "signed",
            "image_front",
            "additional_images",
            "price",
            "predominant color",
            "subject matter",
            "red dot",
        ],
        index=False,
    )


# python3 paintings_to_csv.py "../../data/images/1. broken paintings batch 1"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
