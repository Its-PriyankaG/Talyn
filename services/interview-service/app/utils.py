import random
import string
from .db import db


def generate_reference_id():

    while True:

        ref = ''.join(random.choices(string.ascii_uppercase, k=5))

        exists = db.interview_results.find_one(
            {"reference_id": ref}
        )

        if not exists:
            return ref