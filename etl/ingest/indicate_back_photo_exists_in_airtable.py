from dotenv import load_dotenv
from pyairtable import Api
import sys
import os

def get_back_image_ids_from_directory(back_photo_dir: str) -> set:
    filenames = [
        x for x in os.listdir(back_photo_dir) if os.path.isfile(os.path.join(back_photo_dir, x))
    ]
    back_image_ids = set()
    for filename in filenames:
        if filename.endswith("_verso.jpeg"):
            back_image_ids.add(filename.split("_")[0].lower())
    return back_image_ids

def main(back_photo_dir: str):
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

    back_image_ids = get_back_image_ids_from_directory(back_photo_dir)
    marked_exists = 0
    for record in records:
        fields = record.get("fields", {})
        jgid = fields.get("id")
        if jgid is None:
            continue
        if jgid.lower() in back_image_ids:
           table.update(record['id'], {"back_photo_exists": True})
           marked_exists += 1
           print(f"Marked back photo exists for record with id {jgid}")
    print(f"Total back images marked as existing: {marked_exists}")

# python indicate_back_photo_exists_in_airtable.py "../data/out/extracted_painting_info_20251111_182029_with_ids_renamed_verso_images"
if __name__ == "__main__":
    back_photo_dir = sys.argv[1]
    main(back_photo_dir)
