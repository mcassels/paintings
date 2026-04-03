import re
import os
import sys
from dotenv import load_dotenv
from pyairtable import Api


def parse_duplicate_pairs(filepath: str) -> dict:
    """Returns a dict mapping each ID to its duplicate partner ID."""
    pairs = {}
    with open(filepath) as f:
        for line in f:
            match = re.match(r'\d+\.\s+(JG\d+)\s*&\s*(JG\d+):', line.strip())
            if match:
                id_a, id_b = match.group(1), match.group(2)
                pairs[id_a] = id_b
                pairs[id_b] = id_a
    return pairs


def parse_bad_ids(filepath: str) -> set:
    """Returns a set of uppercase IDs extracted from URLs in bad_pairs.txt."""
    bad_ids = set()
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            match = re.search(r'/(jg\d+)\.jpeg', line)
            if match:
                bad_ids.add(match.group(1).upper())
    return bad_ids


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    bad_pairs_path = os.path.join(script_dir, "bad_pairs.txt")
    duplicate_pairs_path = os.path.join(script_dir, "duplicate_pairs.txt")

    load_dotenv()

    api_key = os.getenv("AIRTABLE_API_KEY")
    base_id = os.getenv("AIRTABLE_BASE_ID")
    table_name = os.getenv("AIRTABLE_TABLE_ID")

    if api_key is None or base_id is None or table_name is None:
        print("Missing Airtable configuration in environment variables")
        sys.exit(1)

    duplicate_map = parse_duplicate_pairs(duplicate_pairs_path)
    bad_ids = parse_bad_ids(bad_pairs_path)

    missing_from_pairs = bad_ids - set(duplicate_map.keys())
    if missing_from_pairs:
        print(f"Warning: these bad IDs have no entry in duplicate_pairs.txt: {missing_from_pairs}")

    api = Api(api_key)
    table = api.table(base_id, table_name)
    records = table.all()

    updated = 0
    for record in records:
        fields = record.get("fields", {})
        jgid = fields.get("id")
        if jgid is None:
            continue
        if jgid in bad_ids:
            duplicate_id = duplicate_map.get(jgid)
            if duplicate_id is None:
                print(f"Skipping {jgid}: no duplicate found in duplicate_pairs.txt")
                continue
            table.update(record["id"], {"is_bad_duplicate_of": duplicate_id})
            print(f"Updated {jgid}: is_bad_duplicate_of = {duplicate_id}")
            updated += 1

    print(f"\nTotal records updated: {updated}")


if __name__ == "__main__":
    main()
