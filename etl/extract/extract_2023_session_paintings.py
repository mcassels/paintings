import re
import os
from typing import NamedTuple, List
import sys
from utils import get_image_description

def get_year(desc: str) -> int|None:
  try:
    year = re.search(r"\d{4}", desc).group()
    if int(year) > 1950 and int(year) < 2017:
      return year
    return None
  except Exception:
    return None

def get_first_match_group_or_none(
  pattern: str, desc: str
) -> str|None:
  match = re.search(pattern, desc)
  if match is None:
    return None
  return match.group()

def get_medium(desc: str) -> str|None:
   return get_first_match_group_or_none(r"[A-Za-z]+ on [A-Za-z]+", desc)

class Dimensions(NamedTuple):
  height: int
  width: int

def get_dimensions(desc: str) -> str|None:
   dim_matches = get_first_match_group_or_none(r"\d+[\s]*x[\s]*\d+", desc)
   if dim_matches is None:
     return None
   height, width = dim_matches.split("x")
   if not height.isdigit() or not width.isdigit():
     return None
   return Dimensions(int(height), int(width))

def get_location(desc: str) -> str|None:
   return get_first_match_group_or_none(r"\s([A-Za-z]+\d)\s", desc)

def get_is_framed(desc: str) -> bool:
   return "framed" in [x.lower() for x in desc.split()]

def get_title(desc: str, year: int) -> str:
   # Description always starts with title followed by year
   return desc.split(str(year))[0]

def get_is_verso(desc: str) -> bool:
   return "verso" in desc.split()

class VersoPhoto(NamedTuple):
   filename: str
   description: str

class Painting(NamedTuple):
   filename: str
   title: str
   year: int
   medium: str
   dimensions: Dimensions
   location: str
   framed: bool
   description: str

def main(dir: str):
    filenames = [
      x for x in os.listdir(dir) if os.path.isfile(os.path.join(dir, x))
    ]

    files_no_description: List[str] =
    versos: List[VersoPhoto] = []
    paintings: List[Painting] = []

    for filename in filenames:
        image_path = os.path.join(dir, filename)
        description = get_image_description(image_path)
        if description is None:
            errors.append(ErroredPainting(
              filename,
              description,
              error="description missing"
            ))
            continue

        is_verso = get_is_verso(description)
        if is_verso:
            versos.append(VersoPhoto(filename, description))
            continue

        year = get_year(description)
        medium = get_medium(description)
        dimensions = get_dimensions(description)
        height = dimensions.height if dimensions is not None else None
        width = dimensions.width if dimensions is not None else None

        location = get_location(description)
        framed = get_is_framed(description)

        title = get_title(description, year)
        paintings.append(Painting(
          filename,
          title,
          year,
          medium,
          Dimensions(height, width),
          location,
          framed,
          description
        ))

    for error in errors:
        print(f"ERROR {error.filename}: {error.error}")

# python3 extract_2023_session_paintings.py "../data/photos_summer_2023"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)