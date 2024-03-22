import sys
import os
from pyairtable import Api
from dotenv import load_dotenv
from typing import NamedTuple, List, Any, Literal
import pandas
import re

class PaintingRow(NamedTuple):
    id: str
    title: str
    year: int|None
    year_guess: int|None
    damage_level: float
    medium: str
    height: int
    width: int
    predominant_color: List[str]
    subject_matter: List[str]
    condition_notes: str|None
    signed: Literal["yes"]|Literal["no"]|None
    framed: Literal["yes"]|Literal["no"]|None

def get_colors(predominant_color: Any) -> List[str]:
    if predominant_color is None or pandas.isna(predominant_color):
        return []
    splits = re.split(r"\W+", predominant_color)
    cleaned: List[str] = []
    for split in splits:
        if split == "" or split == "and":
            continue
        clean = split.lower().removesuffix("s")
        cleaned.append(clean)
    return cleaned

def get_subject_matter(subject: Any) -> List[str]:
    if subject is None or pandas.isna(subject):
        return []
    splits = re.split(r"\W+", subject)
    cleaned: List[str] = []
    for split in splits:
        if split == "" or split == "and":
            continue
        clean = split.lower()
        cleaned.append(clean)
    return cleaned

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

def get_val_or_none(val: Any) -> Any:
    if val is None or pandas.isna(val):
        return None
    return val

def get_bool_val(val: Any) -> Literal["no"]|Literal["yes"]|None:
    if val is None or pandas.isna(val):
        return None
    lower_val = val.lower()
    if lower_val in ["yes", "y"]:
        return "yes"
    if lower_val in ["no", "n"]:
        return "no"
    print(f"Unrecognized boolean value: {val}")
    return None

def get_painting_rows(csv_path: str) -> List[PaintingRow]:
    df = pandas.read_csv(csv_path)
    painting_rows: List[PaintingRow] = []
    seen = set()

    for _, row in df.iterrows():
        id = row["id"].lower() # id being null would be an error
        if not id.startswith("bp"):
            print(f"ignoring non-broken painting with id: {id}")
            continue

        if id in seen:
            print(f"duplicate id: {id}")
        seen.add(id)

        painting_rows.append(PaintingRow(
            id=id,
            title=row["title"],
            year=get_year(row["year"]),
            year_guess=get_year(row["year_guess"]),
            medium=get_val_or_none(row["medium"]),
            height=int(row["height"]),
            width=int(row["width"]),
            damage_level=float(row["damage_level"]),
            predominant_color=get_colors(row["predominant_color"]),
            subject_matter=get_subject_matter(row["subject_matter"]),
            condition_notes=get_val_or_none(row["condition_notes"]),
            signed=get_bool_val(row["signed"]),
            framed=get_bool_val(row["framed"])
        ))
    return painting_rows

def get_s3_url(photo_name: str) -> str:
    return f"https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/broken_paintings/{photo_name}.jpeg"

def upload_paintings(painting_rows: List[PaintingRow]):
    load_dotenv()
    api = Api(os.environ['AIRTABLE_TOKEN'])
    table = api.table("app2HxNPQejnLR2g0", "tblY6WWDZPflob9MC")

    rows: List[dict] = [row._asdict() for row in painting_rows]
    for row in rows:
        row["front_photo_url"] = get_s3_url(row["id"])
        row["back_photo_url"] = get_s3_url(row["id"] + "_verso")
    table.batch_create(rows)

def main(csv_path: str):
    painting_rows = get_painting_rows(csv_path)
    upload_paintings(painting_rows)

# python3 airtable_ingest.py "../../data/csv/Jim paintings inventory - broken paintings.csv"
if __name__ == "__main__":
    csv_path = sys.argv[1]
    main(csv_path)
