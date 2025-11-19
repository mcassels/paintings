# ingestion notes

### 2021 batch ingestion

```bash
(etl-env) ➜  extract git:(process_2021_batch) ✗ python create_back_photo_mapping.py "../data/2021 batch - all" "../data/out/extracted_painting_info_20251111_182029_with_ids.csv"
Found 196 front photos with back photos out of 416 front photos.
Found 196 back photos with front photos out of 282 back photos.
Saving back photos mapping to ../data/out/extracted_back_photos.json
```

```bash
(etl-env) ➜  ingest git:(process_2021_batch) ✗ python rename_back_photos.py "../data/2021 batch - all" "../data/out/extracted_painting_info_20251111_182029_with_ids.csv" "../data/out/extracted_back_photos.json"
Total paintings processed: 416
Mappings not found: 220
Back images not found: 0
Back images renamed and copied: 196
```

```bash
(etl-env) ➜  ingest git:(process_2021_batch) ✗ python indicate_missing_back_images_in_airtable.py "../data/out/extracted_painting_info_20251111_182029_with_ids_renamed_verso_images" 115
Total missing back images: 220
```