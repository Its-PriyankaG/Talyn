import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "talyn_core")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
