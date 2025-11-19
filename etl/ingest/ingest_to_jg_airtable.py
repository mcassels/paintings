from pyairtable import Api
import sys
import os
from dotenv import load_dotenv
from typing import NamedTuple, List, Any, Literal
import pandas
import shutil


def main(csv_path: str):
    load_dotenv()

    api_key = os.getenv("AIRTABLE_API_KEY")
    base_id = os.getenv("AIRTABLE_BASE_ID")
    table_name = os.getenv("AIRTABLE_TABLE_ID")

    if api_key is None or base_id is None or table_name is None:
        print("Missing Airtable configuration in environment variables")
        sys.exit(1)

    api = Api(api_key)
    table = api.table(base_id, table_name)

    df = pandas.read_csv(csv_path)
    renamed_image_dir = csv_path.replace(".csv", "_renamed_images")
    os.makedirs(renamed_image_dir, exist_ok=True)

    df["jgid"] = None

    for _, row in df.iterrows():
        record = {}
        for field in ["title", "year", "medium", "height", "width", "damaged", "condition_notes", "framed", "location"]:
            val = row.get(field)
            if not pandas.isna(val):
                field_key = f"{field}_inches" if field in ["height", "width"] else field
                field_key = "location_code" if field == "location" else field_key

                cleaned_val = True if val == "yes" else val
                record[field_key] = cleaned_val

        print(f"Creating record: {record}")
        new_record = table.create(record)
        print(f"Created record: {new_record}")
        jgid = new_record["fields"]["id"]
        # img_name = jgid.lower() + ".jpeg"
        # shutil.copy(f"{photo_dir}/{row['image_title']}", os.path.join(renamed_image_dir, img_name))
        df.loc[df['image_title'] == row['image_title'], "jgid"] = jgid

    outpath = csv_path.replace(".csv", "_with_ids.csv")
    print(f"Writing updated CSV to {outpath}")
    df.to_csv(outpath, index=False)

# python ingest_to_jg_airtable.py "../data/out/extracted_painting_info_20251111_182029.csv" "../data/2021 batch - all"
if __name__ == "__main__":
    csv_path = sys.argv[1]
    main(csv_path)
