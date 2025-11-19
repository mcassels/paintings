import sys
import os
from typing import NamedTuple, List, Any, Literal
import pandas
import re
from datetime import datetime

def main(dir_path: str):
    filenames = [
        x for x in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, x))
    ]

    cleaned = [x.replace('(1)', '').strip() for x in filenames]
    unique_cleaned = set(cleaned)
    print(f"Total unique cleaned filenames: {len(unique_cleaned)}")
    print(f"Total original filenames: {len(filenames)}")

    # with_1 = [name for name in filenames if '(1)' in name]

    # total = len(filenames)
    # print(f"Total files: {total}")
    # print(f"Files with '(1)': {len(with_1)}")

    # for name in with_1:
    #     possible_pair = [x for x in filenames if x.replace('(1)', '') == name.replace('(1)', '') and x != name]
    #     if possible_pair:
    #         print(f"Found pair for '{name}': {possible_pair}")

# python3 process_legacy_batch.py "../data/2023-08-01 Batch jim paintings summer 2023 info in title"
if __name__ == "__main__":
    dir_path = sys.argv[1]
    main(dir_path)
