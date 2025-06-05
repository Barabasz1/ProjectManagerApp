import sys
import os
import pandas as pd
import numpy as np

sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.db_manager import *
from backend.utils import get_master_dir


def trace_callback(statement):
    print("Executing SQL:", statement)

if __name__ == "__main__":
    dbm = DbManager(trace_callback)

    dbm.open(DbManager.DEFAULT_DB_PATH)

    dbm.save_to_csv(os.path.join(get_master_dir(),'dev','db_review'))

    dbm.close()
