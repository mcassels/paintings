from PIL import Image


def get_image_description(image_path: str) -> str | None:
    img_description_tag = 270  # This is the tag with tag name == "ImageDescription"

    try:
        img = Image.open(image_path)
    except Exception:
        print(f"{image_path}: Could not open image")
        return None

    exif = img.getexif()
    return exif.get(img_description_tag, None)
