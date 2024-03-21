import sys
import os
from typing import Set

def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]
    fronts: Set[str] = set()
    backs: Set[str] = set()
    for filename in filenames:
        split = filename.split(".")[0].split("_")
        id = split[0].lower()
        if len(split) == 2 and split[1] == "verso":
            backs.add(id)
        else:
            fronts.add(id)
    
    print(f"Fronts missing backs: {', '.join(list(fronts - backs))}")
    print(f"Backs missing fronts: {', '.join(list(backs - fronts))}")

# python3 validate_images.py "../../data/images/first_three_batches"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
