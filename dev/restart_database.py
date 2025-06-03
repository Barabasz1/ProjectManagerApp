import sys
import os
import pandas as pd
import numpy as np

sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.db_manager import *
from backend.utils import get_master_dir

def trace_callback(statement):
    print("Executing SQL:", statement)

def from_np_to_py(value):
    if isinstance(value, (np.generic, np.ndarray)):
        return value.item()
    return value

def get_data(dir_path):
    data = {}
    files = [f for f in os.listdir(dir_path) if f.endswith('.csv')]
    tables = [file.split('.')[0] for file in files]
    data = {table: [] for table in tables}

    for file,table in zip(files,tables):
        filepath =  os.path.join(dir_path, file)
        df = pd.read_csv(filepath)

        df = df.convert_dtypes()  

        records = df.to_dict(orient='records')

        data[table].extend(records)

    return data

if __name__ == "__main__":
    dbm = DbManager(trace_callback)
    dbm.create(DbManager.DEFAULT_DB_PATH,overwrite=True)
    dbm.open(DbManager.DEFAULT_DB_PATH)

    dbm.init_tables()

    data = get_data(os.path.join(get_master_dir(),'dev','example_data'))

    insertion_order = ['account','user','project','team','participation','team_composition','task','task_team_assignment','task_user_assignment','task_status_history']

    for table in insertion_order:
        for x in data[table]:
            dbm._insert_single(table,x)

    dbm.commit()
    
    print(dbm.select_single_table('account',['COUNT(*)']))
    print(dbm.select_single_table('account',['*']))
    # dbm.save_to_csv(os.path.join(get_master_dir(),'dev','db_review'))

    dbm.close()
