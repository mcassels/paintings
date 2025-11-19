from dotenv import load_dotenv
from pyairtable import Api
import sys
import os

def main(back_photo_dir: str, first_jg_id: int):
    load_dotenv()

    api_key = os.getenv("AIRTABLE_API_KEY")
    base_id = os.getenv("AIRTABLE_BASE_ID")
    table_name = os.getenv("AIRTABLE_TABLE_ID")

    if api_key is None or base_id is None or table_name is None:
        print("Missing Airtable configuration in environment variables")
        sys.exit(1)


    api = Api(api_key)
    table = api.table(base_id, table_name)
    records = table.all()

    filenames = [
        x for x in os.listdir(back_photo_dir) if os.path.isfile(os.path.join(back_photo_dir, x))
    ]
    missing = 0
    for record in records:
        fields = record.get("fields", {})
        jgid = fields.get("id")
        if jgid is None or int(jgid[2:]) < first_jg_id:
            continue
        expected_back_image_name = f"{jgid.lower()}_verso.jpeg"
        if expected_back_image_name not in filenames:
           missing += 1
           table.update(record['id'], {"back_photo_missing": True})
    print(f"Total missing back images: {missing}")

# python indicate_missing_back_images_in_airtable.py "../data/out/extracted_painting_info_20251111_182029_with_ids_renamed_verso_images" 115
if __name__ == "__main__":
    back_photo_dir = sys.argv[1]
    first_jg_id = int(sys.argv[2])
    main(back_photo_dir, first_jg_id)
