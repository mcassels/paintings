"""
Given a directory of images, create one gelato card pack per image.

Vertical or horizontal template will be used based on image orientation.

https://dashboard.gelato.com/docs/ecommerce/products/create-from-template/#request

To get info about the variants of a template:

curl -X GET 'https://ecommerce.gelatoapis.com/v1/templates/<templateId>' \
-H 'Content-Type: application/json' \
-H 'X-API-KEY: <apikeyhere>'
"""
import sys
import os
import re
import requests
import pyairtable
from PIL import Image
from dotenv import load_dotenv


PACK_OF_TEN_CARDS_VERTICAL_TEMPLATE_ID = "9b134eaa-1967-48b5-b4dd-b822ee68f926"
PACK_OF_TEN_CARDS_HORIZONTAL_TEMPLATE_ID = "1dd3fe4a-b072-4696-b8cd-7bdfa91f0140"
TEST_ETSY_STORE_ID = "8fe20578-5cc7-4138-b63d-abe1d262b259"

def get_template_id(filename: str) -> str:
    with open(filename, 'rb') as f:
        img = Image.open(f)
        return PACK_OF_TEN_CARDS_VERTICAL_TEMPLATE_ID if img.height > img.width else PACK_OF_TEN_CARDS_HORIZONTAL_TEMPLATE_ID

def get_s3_url(photo_name: str) -> str:
    return f"https://james-gordaneer-gelato-images.s3.us-east-1.amazonaws.com/{photo_name}.jpeg"


# TODO: automate aws upload
# def ensure_photo_in_aws_s3(filename):

def get_product_payload(template_id: str, photo_name: str) -> dict:
    painting_id = photo_name.split(".")[0].upper()
    # TODO: retrieve actual painting name from airtable
    painting_name = painting_id
    product_name = f"James Gordaneer - \"{painting_name}\" - Pack of 10 Cards"
    return {
            "templateId": template_id,
            "title": product_name,
            "description": f"<div><p>A pack of ten cards featuring the artwork of James Gordaneer.</p><p>Painting \"{painting_name}\"</p></div>",
            "isVisibleInTheOnlineStore": True,
            "salesChannels": [
                "web"
            ],
            "variants": [
                {
                    "templateVariantId": "c72a3f19-902f-4059-8a6e-bef39ff9ddb9",
                    "imagePlaceholders": [
                        {
                            "name": "ImageFront",
                            "fileUrl": f"https://james-gordaneer-gelato-images.s3.us-east-1.amazonaws.com/{photo_name}"
                        }
                    ]
                },
            ]
        }

def create_gelato_product(photo_name, template_id, api_key: str) -> requests.Response:
    payload = get_product_payload(template_id, photo_name)
    return requests.post(
        f"https://ecommerce.gelatoapis.com/v1/stores/{TEST_ETSY_STORE_ID}/products:create-from-template",
        headers={
            'Content-Type': 'application/json',
            'X-API-KEY': api_key
        },
        json=payload
    )

def main(in_dir_name: str):
    load_dotenv()
    api_key = os.getenv("GELATO_API_KEY")
    if api_key is None:
        print("GELATO_API_KEY environment variable not set")
        sys.exit(1)

    filenames = [
        x for x in os.listdir(in_dir_name) if os.path.isfile(os.path.join(in_dir_name, x))
    ]

    for filename in filenames:
      if not re.match(r"jg\d+[.]", filename):
          continue
      # ensure_photo_in_aws_s3(filename) --- TODO ---
      template_id = get_template_id(os.path.join(in_dir_name, filename))
      print(f"Creating gelato card pack for {filename} using template {template_id}")
      res = create_gelato_product(filename, template_id, api_key)
      print(res)
      break



# python create_gelato_cards.py "../data/august_26_sept_5_front_photos_only"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
