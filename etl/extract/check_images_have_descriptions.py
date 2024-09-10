from extract.utils import get_image_description
import os
import sys

def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]
    has_description = 0
    for filename in filenames:
        description = get_image_description(os.path.join(dir_name, filename))
        if description is not None:
            has_description += 1
    print(f"{has_description}/{len(filenames)} images have descriptions")

if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
