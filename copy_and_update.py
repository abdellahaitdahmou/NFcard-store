import os
import shutil
import json

artifact_dir = r"C:\Users\espacegamers\.gemini\antigravity\brain\72675a3f-ba21-4c15-bff7-d20d8ea8c4a7"
target_dir = r"c:\Users\espacegamers\Desktop\nfc store\client\public\products"
os.makedirs(target_dir, exist_ok=True)

file_map = {
    'nfc_black_card_1788878652569.jpg': 'nfc-black-card.jpg',
    'nfc_white_card_1788878802797.jpg': 'nfc-white-card.jpg',
    'google_review_stand_1788878671021.jpg': 'google-stand.jpg',
    'table_tents_nfc_1788878689134.jpg': 'table-tents-5pcs.jpg',
    'social_media_plate_1788878706411.jpg': 'social-plate.jpg',
    'rfid_duplicator_device_1788878724945.jpg': 'rfid-duplicator.jpg',
    'rfid_blue_keyfobs_1788878744583.jpg': 'rfid-keyfobs-15pcs.jpg',
    'nfc_stickers_sheet_1788878762023.jpg': 'nfc-stickers-10pcs.jpg',
    'nfc_wristband_black_1788878783952.jpg': 'nfc-wristbands.jpg'
}

for src, dest in file_map.items():
    s_path = os.path.join(artifact_dir, src)
    d_path = os.path.join(target_dir, dest)
    if os.path.exists(s_path):
        shutil.copyfile(s_path, d_path)
        print(f"Copied {src} -> {dest}")
    else:
        print(f"Missing {src}")

# Update db.json
db_path = r"c:\Users\espacegamers\Desktop\nfc store\server\data\db.json"
if os.path.exists(db_path):
    with open(db_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    
    img_map = {
        "prod-black-card": "/products/nfc-black-card.jpg",
        "prod-white-card": "/products/nfc-white-card.jpg",
        "prod-google-stand": "/products/google-stand.jpg",
        "prod-table-tents-5": "/products/table-tents-5pcs.jpg",
        "prod-social-plate": "/products/social-plate.jpg",
        "prod-nfc-stickers-10": "/products/nfc-stickers-10pcs.jpg",
        "prod-wristbands-4": "/products/nfc-wristbands.jpg",
        "prod-rfid-duplicator": "/products/rfid-duplicator.jpg",
        "prod-keyfobs-15": "/products/rfid-keyfobs-15pcs.jpg"
    }

    for p in db.get("products", []):
        if p["id"] in img_map:
            p["image"] = img_map[p["id"]]

    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("db.json updated with high-res studio images!")

