"""
Copy all front photos to a separate directory.
"""
import sys
import os
import re
import shutil


def main(in_dir_name: str):
    filenames = [
        x for x in os.listdir(in_dir_name) if os.path.isfile(os.path.join(in_dir_name, x))
    ]
    out_dir_name = f"{in_dir_name}_front_photos_only"
    if not os.path.exists(out_dir_name):
      os.mkdir(out_dir_name)

    num_copied = 0

    for filename in filenames:
        if not re.match(r"jg\d+[.]", filename):
            continue
        shutil.copy(os.path.join(in_dir_name, filename), os.path.join(out_dir_name, filename))
        num_copied += 1

    print(f"Copied {num_copied} front photos to {out_dir_name}")


# python extract_front_photos_only.py "../data/august_26_sept_5"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
