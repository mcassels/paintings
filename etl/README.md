# ingestion notes

## 2021 batch ingestion

### To-do list
[done] ingest NEW paintings into JG airtable
[to-do] add JG "original" photos as additional photo url on existing JG records
[to-do] add BP "original" photos as additional photo url on existing BP records

### Outputs
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


## 2023 batch ingestion

### To-do list
[done] turn directory of photos into a spreadsheet (https://docs.google.com/spreadsheets/d/1rrKSpqswyvLxT4R5bgCsbapBAZ5R5ofgzVuVUujemwI/edit?gid=1368773126#gid=1368773126)
[done] Alisa updates spreadsheet with corrections
[to-do] download spreadsheet, use "BP" presence to mark painting as damaged, creating a new csv for ingestion
[to-do] ingest 2023 records