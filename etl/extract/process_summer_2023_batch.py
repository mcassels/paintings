"""
Given a directory of images that are NAMED with the description,
extract information and produce a csv file.
"""

import sys
import os
from typing import NamedTuple, List, Any, Literal
import pandas
import re

class PaintingRow(NamedTuple):
    image_title: str
    title: str|None
    year: int|None
    medium: str|None
    height: int|None # first dimension
    width: int|None # second dimension
    damaged: Literal["yes"]|None
    condition_notes: str|None
    framed: Literal["yes"]|None
    location: str|None = None

def get_year(year: Any) -> int|None:
    if year is None or year == "" or pandas.isna(year) or year == "ND":
        return None
    try:
        as_int = int(year)
        if as_int < 1940 or as_int > 2016:
            print(f"Year {as_int} is out of range")
            return None
        return as_int
    except ValueError:
        return None


def get_painting_rows(dir_path: str) -> List[PaintingRow]:
    filenames = [
        x for x in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, x))
    ]
    painting_rows: List[PaintingRow] = []
    for filename in filenames:
        if filename == ".DS_Store":
            continue

        filename = filename.replace("_", " ").replace("-", " ").replace(",", " ").replace("  ", " ").replace("\"", " ").strip()
        splits = filename.strip(".jpeg").split()

        if "verso" in splits:
            continue

        image_title = filename
        title = None
        year = None
        medium = None
        height = None
        width = None
        damaged = None
        condition_notes = None
        framed = None
        location = None

        if not re.match(r"IMG \d{4}\.jpeg", filename):
            year_i = next(
              (i for i in range(len(splits)) if re.match(r"\d{4}", splits[i])), None
            )
            if year_i is not None:
                year = get_year(splits[year_i])
                title = " ".join(splits[:year_i])

            dim_i = None
            for i in range(len(splits)):
                match = re.search(r"(\d+)x(\d+)", splits[i])
                if match:
                    height = int(match.group(1))
                    width = int(match.group(2))
                    dim_i = i
            if year_i is None and dim_i is not None:
                title = " ".join(splits[:dim_i])

            if year_i is not None and dim_i is not None and dim_i > year_i:
                medium = " ".join(splits[year_i + 1:dim_i])

            damage_i = None
            for i in range(len(splits)):
                token = splits[i]
                if token in ["damaged", "(BP)", "(bp)"]:
                    damaged = "yes"
                    damage_i = i
                    break

            if "framed" in splits or "frame" in splits:
                framed = "yes"

            for split in splits:
                match = re.search(r"[abAB][123456]", split)
                if match:
                    location = split.lower()
                    break

            if damage_i is not None and damage_i + 1 < len(splits):
                condition_notes = " ".join([x for x in splits[damage_i + 1:] if x not in ["framed", "frame", "(bp)", "(BP)", location]])

            if title is None:
                title_tokens = []
                for i in range(len(splits)):
                    if i not in [year_i, dim_i, damage_i] and splits[i] not in ["damaged", "(BP)", "(bp)", "framed", "frame", location]:
                        title_tokens.append(splits[i])
                title = " ".join(title_tokens)


        painting_row = PaintingRow(
            image_title=image_title,
            title=title,
            year=year,
            medium=medium,
            height=height,
            width=width,
            framed=framed,
            location=location,
            damaged=damaged,
            condition_notes=condition_notes
        )
        painting_rows.append(painting_row)

    return painting_rows

def main(dir_path: str):
    painting_rows = get_painting_rows(dir_path)
    print(f"Extracted {len(painting_rows)} paintings")
    df = pandas.DataFrame(painting_rows)
    df.to_csv("extracted_painting_info.csv", index=False)

# python3 process_summer_2023_batch.py "../data/2023-08-01 Batch jim paintings summer 2023 info in title"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    main(dir_path)
