import sys
import os
from pyairtable import Api
from dotenv import load_dotenv
from typing import NamedTuple, List
import pandas

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

def get_painting_rows(csv_path: str) -> List[PaintingRow]:
    df = pandas.read_csv(csv_path)
    painting_rows: List[PaintingRow] = []

    for _, row in df.iterrows():
        id = row["id"].lower() # id being null would be an error
        painting_rows.append(PaintingRow(
            id=row["Id (required)"],
            title=row["Title"],
            year=row["Year "],
            year_guess=row["year_guess"],
            damage_level=row["damage_level"],
            medium=row["medium"],
            height=row["height"],
            width=row["width"],
            predominant_color=row["predominant_color"].split(","),
            subject_matter=row["subject_matter"].split(","),
            condition_notes=row["condition_notes"]
        ))
    return painting_rows

def main(photo_dir: str, csv_path: str):
    load_dotenv()
    api = Api(os.environ['AIRTABLE_TOKEN'])
    table = api.table('app2HxNPQejnLR2g0', 'tblAePvviV6Sd00Ez')
    print(table.all())
    painting_rows = get_painting_rows(csv_path)

# python3 airtable_ingest.py "../../data/images/all_paintings" "../../data/csv/Jim paintings inventory - broken paintings.csv"
if __name__ == "__main__":
    photo_dir = sys.argv[1]
    csv_path = sys.argv[2]
    main(photo_dir, csv_path)
