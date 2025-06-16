import pytest
from datetime import datetime, timezone, timedelta
import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..','..')))
from backend.utils import *

def test_get_datetime_from_iso_string():

    dt_str = "2023-06-15T12:34:56Z"
    dt = get_datetime_from_iso_string(dt_str)
    assert dt.tzinfo == timezone.utc
    assert dt.isoformat() == "2023-06-15T12:34:56+00:00"

    dt_str = "2023-06-15T12:34:56+02:00"
    dt = get_datetime_from_iso_string(dt_str)
    assert dt.utcoffset() == timedelta(hours=2)
    assert dt.isoformat() == "2023-06-15T12:34:56+02:00"

    dt_str = "2023-06-15T12:34:56"
    dt = get_datetime_from_iso_string(dt_str)
    assert dt.tzinfo is None
    assert dt.isoformat() == "2023-06-15T12:34:56"

def test_drop_timezone_info():
    dt = datetime(2023, 6, 15, 12, 34, 56, tzinfo=timezone.utc)
    dt_naive = drop_timezone_info(dt)
    assert dt_naive.tzinfo is None
    assert dt_naive.year == 2023
    assert dt_naive.month == 6
    assert dt_naive.day == 15
    assert dt_naive.hour == 12
    assert dt_naive.minute == 34
    assert dt_naive.second == 56

def test_clean_dict():
    d = {'a': 1, 'b': None, 'c': 0, 'd': False}
    cleaned = clean_dict(d)
    assert 'b' not in cleaned
    assert cleaned == {'a': 1, 'c': 0, 'd': False}

def test_filter_out_not_set():
    d = {'a': 1, 'b': 2, 'c': 3}
    provided = {'a', 'c'}
    filtered = filter_out_not_set(d, provided)
    assert filtered == {'a': 1, 'c': 3}

    filtered_empty = filter_out_not_set(d, set())
    assert filtered_empty == {}
    
    filtered_all = filter_out_not_set(d, {'a', 'b', 'c'})
    assert filtered_all == d