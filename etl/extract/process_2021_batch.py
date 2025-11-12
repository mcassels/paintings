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
from PIL import Image

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


def get_width(image_path: str, dim0: int, dim1: int) -> int:
    with Image.open(image_path) as img:
        img_width, img_height = img.size
        if img_width >= img_height:
            return dim0 if dim0 > dim1 else dim1
        return dim0 if dim0 < dim1 else dim1



def get_painting_rows(dir_path: str) -> Tuple[List[PaintingRow], Dict[str, str]]:
    filenames = [
        x for x in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, x))
    ]
    painting_rows: List[PaintingRow] = []

    back_photos: Dict[str, str] = {}  # image_title -> back_filename

    dupes = get_dupes_to_skip(filenames)

    num_unknown_orientation = 0

    for filename in filenames:
        if filename == ".DS_Store" or filename in dupes:
            continue


        if "verso" in filename or "vesro" in filename:
            back_photos[filename.replace("verso", "").replace("vesro", "")] = filename
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


        bp_match = re.search(r"[bB][pP]\s*\d+", filename)
        if bp_match:
            bp_number = bp_match.group(0).replace(" ", "").upper()
        else:
            jg_match = re.search(r"[jJ][gG]\s*\d+", filename)
            if jg_match:
                jg_number = jg_match.group(0).replace(" ", "").upper()

        if not bp_number and not jg_number:
            splits = clean_filename(filename).split()
            if "BP" in splits or "bp" in splits or "(bp)" in splits or "(BP)" in splits:
                damaged = "yes"
            splits = [s for s in splits if s != "original" and s != "BP" and s != "bp" and s != "(bp)" and s != "(BP)"]

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
                labelled_w_first_match = re.search(r"[Ww][\s]*(\d+)[\s]*[Xx][\s]*[Hh][\s]*(\d+)", splits[i])
                if labelled_w_first_match:
                    width = int(labelled_w_first_match.group(1))
                    height = int(labelled_w_first_match.group(2))
                    dim_i = i
                    break
                labelled_h_first_match = re.search(r"[Hh][\s]*(\d+)[\s]*[Xx][\s]*[Ww][\s]*(\d+)", splits[i])
                if labelled_h_first_match:
                    height = int(labelled_h_first_match.group(1))
                    width = int(labelled_h_first_match.group(2))
                    dim_i = i
                    break
                unlabeled_match = re.search(r"(\d+)\s*[Xx]\s*(\d+)", splits[i])
                if unlabeled_match:
                    num_unknown_orientation += 1
                    dim0 = int(unlabeled_match.group(1))
                    dim1 = int(unlabeled_match.group(2))
                    width = get_width(os.path.join(dir_path, filename), dim0, dim1)
                    height = dim0 if width == dim1 else dim1
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
                condition_notes = " ".join([x for x in splits[damage_i + 1:] if x not in ["framed", "frame", location]])

            if title is None:
                title_tokens = []
                for i in range(len(splits)):
                    if i not in [year_i, dim_i, damage_i] and splits[i] not in ["framed", "frame", location]:
                        title_tokens.append(splits[i])

                title = " ".join(title_tokens)
                if medium is not None:
                    title = title.replace(medium, "")
            if title == "":
                title = "Untitled"


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
        )
        painting_rows.append(painting_row)
    print(f"Number of paintings with unknown orientation (w x h): {num_unknown_orientation}")

    return painting_rows, back_photos

# TODO: split out paintings; report on missing backs.
def write_paintings(painting_rows: List[PaintingRow], back_photos: Dict[str, str]):
    jgs = []
    bps = []
    new_paintings = []
    new_backs = {}
    for row in painting_rows:
        if row.jg_number is not None:
            jgs.append(row.jg_number)
        elif row.bp_number is not None:
            bps.append(row.bp_number)
        else:
          new_paintings.append(row)
          new_backs[row.image_title] = back_photos.get(row.image_title, None)

def main(dir_path: str):
    painting_rows, back_photos = get_painting_rows(dir_path)
    print(f"Extracted {len(painting_rows)} paintings")
    df = pandas.DataFrame(painting_rows).sort_values(by=["image_title"])
    csv_title = f"../data/out/extracted_painting_info_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    print(f"Saving painting info to {csv_title}")
    df[(df["bp_number"].isnull() & df["jg_number"].isnull())].to_csv(csv_title, index=False)

    # Save back photos mapping
    mapping_title = f"../data/out/extracted_back_photos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    print(f"Saving back photos mapping to {mapping_title}")
    with open(mapping_title, "w") as f:
        json.dump(back_photos, f)

# python3 process_2021_batch.py "../data/2023-08-01 Batch jim paintings summer 2023 info in title"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    main(dir_path)


"""
TODO:
1. handle w43xh43 style dimensions
2. handle presence of BP to indicate damage
if BP but no BP number, then mark as damaged but put into regular JG airtable. Mark them as "originals" i.e. prior to damage.

Questions for Alisa:
- is the weight accurate for any of the painting_catalog entries?
"""