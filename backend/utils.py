import os
from hashlib import sha256 as perform_sha256
from datetime import datetime,timezone,date

def get_now():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')



def get_now_str():
    return get_now().strptime('%Y-%m-%d %H:%M:%S')


def get_datetime_utc(dt:datetime):
    return dt.astimezone(timezone.utc) if dt is not None else None

def get_datetime_from_iso_string(datetime_str:str):
    if datetime_str.endswith('Z'):
        datetime_str = datetime_str.replace('Z', '+00:00')
    return datetime.fromisoformat(datetime_str)

def drop_timezone_info(dt:datetime):
    return dt.replace(tzinfo=None)

def datetime_to_native(dt:datetime):
    return drop_timezone_info(get_datetime_utc(dt)) if dt is not None else None

def datetime_date_only(dt:datetime):
    return datetime(dt.year,dt.month,dt.day) if dt is not None else None

def get_master_dir():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


def sha256(input:str):
    return perform_sha256(input.encode('utf-8'))


def clean_dict(dictionary:dict):
    return {key: value for key, value in dictionary.items() if value is not None}

def filter_out_not_set(dictionary:dict,provided:set[str]) -> dict:
    return {k: v for k, v in dictionary.items() if k in provided}