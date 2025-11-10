"""
Given a directory of images that are NAMED with the description,
extract information and produce a csv file.
"""

import json
import sys
import os
from typing import NamedTuple, List, Any, Literal, Dict, Tuple
import pandas
import re
from datetime import datetime

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
    bp_number: str|None = None
    jg_number: str|None = None
    original_prior_to_damage: Literal["yes"]|None = None

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


def clean_filename(filename: str) -> str:
    filename = re.sub(r'\(\d\)', '', filename)         # remove literal '(1)', '(2)', etc.
    filename = re.sub(r'.jpeg$', '', filename, flags=re.IGNORECASE)  # remove .jpeg extension
    filename = re.sub(r'\s+', ' ', filename).strip()  # collapse multiple spaces
    filename = re.sub(r'[_,.]', ' ', filename)      # replace commas, periods and underscores with spaces
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


def get_painting_rows(dir_path: str) -> Tuple[List[PaintingRow], Dict[str, str]]:
    filenames = [
        x for x in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, x))
    ]
    painting_rows: List[PaintingRow] = []

    back_photos: Dict[str, str] = {}  # image_title -> back_filename

    dupes = get_dupes_to_skip(filenames)

    for filename in filenames:
        if filename == ".DS_Store" or filename in dupes:
            continue

        splits = clean_filename(filename).split()

        if "verso" in splits:
            back_photos[filename.replace(" verso", "")] = filename
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
        bp_number = None
        jg_number = None
        bp_or_jb_i = None
        original = None

        for i in range(len(splits)):
            split = splits[i]
            # TODO: need to account for space between "BP" and number
            match = re.search(r"[bB][pP]\d+", split)
            if match:
                bp_number = split
                bp_or_jb_i = i
                damaged = "yes"
                break
            match = re.search(r"[jJ][gG]\d+", split)
            if match:
                jg_number = split
                bp_or_jb_i = i
                break
            if split.lower() == "bp":
                damaged = "yes"
                bp_or_jb_i = i
                break

        original_i = next(
          (i for i in range(len(splits)) if splits[i].lower() == "original"), None
        )
        if original_i is not None:
            original = "yes"

        year_i = next(
          (i for i in range(len(splits)) if (re.match(r"\d{4}", splits[i]) and splits[i] != "1897") or splits[i].lower() == "nd"), None
        )
        if year_i is not None:
            if splits[year_i].lower() == "nd":
                year = None
            else:
                year = get_year(splits[year_i])
            # TODO: need to account for getting BP, JG and "original" out of titles.
            title = " ".join(splits[:year_i])

        dim_i = None
        for i in range(len(splits)):
            match = re.search(r"[Ww]*(\d+)\s*[Xx]\s*[Hh]*(\d+)", splits[i])
            if match:
                width = int(match.group(1))
                height = int(match.group(2))
                dim_i = i
                break

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
                if i not in [year_i, dim_i, damage_i, bp_or_jb_i, original_i] and splits[i] not in ["damaged", "(BP)", "(bp)", "framed", "frame", location]:
                    title_tokens.append(splits[i])


        painting_row = PaintingRow(
            image_title=image_title,
            title=title,
            year=year,
            medium=medium,
            width=width,
            height=height,
            framed=framed,
            location=location,
            damaged=damaged,
            condition_notes=condition_notes,
            bp_number=bp_number,
            jg_number=jg_number,
            original_prior_to_damage=original
        )
        painting_rows.append(painting_row)

    return painting_rows, back_photos

def main(dir_path: str):
    painting_rows, back_photos = get_painting_rows(dir_path)
    print(f"Extracted {len(painting_rows)} paintings")
    df = pandas.DataFrame(painting_rows)
    csv_title = f"../data/out/extracted_painting_info_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    print(f"Saving painting info to {csv_title}")
    df.to_csv(csv_title, index=False)

    # Save back photos mapping
    mapping_title = f"../data/out/extracted_back_photos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    print(f"Saving back photos mapping to {mapping_title}")
    with open(mapping_title, "w") as f:
        json.dump(back_photos, f)

# python3 process_legacy_batch.py "../data/2023-08-01 Batch jim paintings summer 2023 info in title"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    main(dir_path)


"""
TODO:
1. handle w43xh43 style dimensions
2. handle presence of BP to indicate damage
if BP but no BP number, then mark as damaged but put into regular JG airtable. Mark them as "originals" i.e. prior to damage.
"""