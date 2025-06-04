import os
from hashlib import sha256 as perform_sha256




def get_master_dir():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


def sha256(input:str):
    return perform_sha256(input.encode('utf-8'))