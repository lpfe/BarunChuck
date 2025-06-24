# drawn_downloader.py (for crontab)
import boto3
import os
from dotenv import load_dotenv

# 환경변수 불러오기
load_dotenv()

BUCKET_NAME = os.environ.get('BUCKET_NAME')
REGION = os.environ.get('REGION')
ACCESS_KEY = os.environ.get('ID')
SECRET_KEY = os.environ.get('SECRET')

DRAWN_DIR = './drawn_videos'
PROCESSED_FILE = 'downloaded_drawn_files.txt'

# S3 클라이언트 생성 (자격증명 명시)
s3 = boto3.client('s3',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name=REGION
)

def get_processed():
    if not os.path.exists(PROCESSED_FILE):
        return set()
    with open(PROCESSED_FILE, 'r') as f:
        return set(line.strip() for line in f)

def save_processed(filename):
    with open(PROCESSED_FILE, 'a') as f:
        f.write(f"{filename}\n")

def download_if_new():
    processed = get_processed()

    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='videos_drawn/')
    except Exception as e:
        print(f"❌ Failed to list S3 objects: {str(e)}")
        return

    for obj in response.get('Contents', []):
        key = obj['Key']
        if not key.endswith('.mp4'):
            continue
        filename = key.split('/')[-1]
        if filename in processed:
            continue

        local_path = os.path.join(DRAWN_DIR, filename)
        print(f"📥 Downloading: {filename}")

        try:
            s3.download_file(BUCKET_NAME, key, local_path)
            print(f"✅ Downloaded: {filename}")
            save_processed(filename)
        except Exception as e:
            print(f"❌ Failed to download {filename}: {str(e)}")

if __name__ == "__main__":
    os.makedirs(DRAWN_DIR, exist_ok=True)
    download_if_new()
