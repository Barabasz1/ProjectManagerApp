import os
from backend.utils import get_master_dir
import sqlite3
from typing import List
from datetime import datetime
from backend.const import ReturnCode

class DbManager:

    DEFAULT_DB_PATH = os.path.join(get_master_dir(),'data','db.sql')

    TABLE_NAMES = [
        "account",
        "user",
        "project",
        "team",
        "team_composition",
        "task",
        "task_team_assignment",
        "task_user_assignment",
        "task_status_history"
    ]

    # skipped autoincrements etc
    TABLES_INSERT_FIELDS = {
        'account': ['login', 'password', 'creation_date'],
        'user': ['f_name', 'l_name', 'email', 'description'],
        'project': ['name', 'manager', 'description', 'creation_date', 'version', 'deadline'],
        'team': ['name','project'],
        'team_composition': ['team', 'user', 'role'],
        'task': ['project', 'name', 'description', 'creation_date', 'deadline', 'status', 'priority'],
        'task_team_assignment': ['task', 'team'],
        'task_user_assignment': ['task', 'user'],
        'task_status_history': ['task', 'old_status', 'new_status', 'changed_at']
    }

    # raw columns
    TABLES_FIELDS = {
        'account': ['id','login', 'password', 'creation_date'],
        'user': ['id','f_name', 'l_name', 'email', 'description'],
        'project': ['id','name', 'manager', 'description', 'creation_date', 'version', 'deadline'],
        'team': ['id','name','project'],
        'team_composition': ['team', 'user', 'role'],
        'task': ['id','project', 'name', 'description', 'creation_date', 'deadline', 'status', 'priority'],
        'task_team_assignment': ['task', 'team'],
        'task_user_assignment': ['task', 'user'],
        'task_status_history': ['id','task', 'old_status', 'new_status', 'changed_at']
    }

    KANBAN_STATUS_MIN = 0
    KANBAN_STATUS_MAX = 5

    TASK_PRIORITY_MIN = 0
    TASK_PRIORITY_MAX = 3

    # // kanban status
    # Enum kanban_status {
    #   unassigned// 0
    #   backlog//1
    #   in_progress// 2
    #   completed// 3
    #   testing// 4
    #   todo// 5
    # }

    # Enum task_priority {
    #   unassigned//0
    #   low//1
    #   medium//2
    #   high//3
    # }


    def __init__(self,trace_callback=None):
        self.connection = None
        self.cursor = None
        self.path = None
        self.trace_callback = trace_callback


        

    def create(self,path:str,overwrite:bool=True):
        if os.path.exists(path):
            if overwrite:
                os.remove(path)
            else:
                return

        connection = sqlite3.connect(path)
        connection.close()

    def open(self,path:str):
        if path is None:
            raise KeyError
        if not os.path.exists(path):
            raise FileNotFoundError(f"Database not found at {path}")
        
        self.connection = sqlite3.connect(path)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        self.path = path
        self.connection.set_trace_callback(self.trace_callback)

    def close(self):
        self.connection.close()

    def init_tables(self):
        if self.cursor is None:
            raise Exception("No connection to the database has been established")

        self.cursor.execute('PRAGMA foreign_keys = ON;')

        self.cursor.executescript("""
        CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            creation_date DATETIME
        );

        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            f_name TEXT,
            l_name TEXT,
            email TEXT,
            description TEXT,
            FOREIGN KEY(id) REFERENCES account(id)
        );

        CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            manager INTEGER NOT NULL,
            description TEXT,
            creation_date DATETIME,
            version TEXT,
            deadline DATETIME,
            FOREIGN KEY(manager) REFERENCES user(id)
        );

        CREATE TABLE IF NOT EXISTS team (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            project INTEGER NOT NULL,
            FOREIGN KEY(project) REFERENCES project(id)
        );

        CREATE TABLE IF NOT EXISTS team_composition (
            team INTEGER NOT NULL,
            user INTEGER NOT NULL,
            role TEXT,
            PRIMARY KEY (team, user),
            FOREIGN KEY(team) REFERENCES team(id),
            FOREIGN KEY(user) REFERENCES user(id)
        );

        CREATE TABLE IF NOT EXISTS task (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            creation_date DATETIME,
            deadline DATETIME,
            status INTEGER NOT NULL,
            priority INTEGER,
            FOREIGN KEY(project) REFERENCES project(id)
        );

        CREATE TABLE IF NOT EXISTS task_team_assignment (
            task INTEGER NOT NULL,
            team INTEGER NOT NULL,
            PRIMARY KEY (task, team),
            FOREIGN KEY(task) REFERENCES task(id),
            FOREIGN KEY(team) REFERENCES team(id)
        );

        CREATE TABLE IF NOT EXISTS task_user_assignment (
            task INTEGER NOT NULL,
            user INTEGER NOT NULL,
            PRIMARY KEY (task, user),
            FOREIGN KEY(task) REFERENCES task(id),
            FOREIGN KEY(user) REFERENCES user(id)
        );

        CREATE TABLE IF NOT EXISTS task_status_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task INTEGER,
            old_status INTEGER NOT NULL,
            new_status INTEGER NOT NULL,
            changed_at DATETIME,
            FOREIGN KEY(task) REFERENCES task(id)
        );
        """)

        self.connection.commit()

    # def select(self,sql_command:str):
    #     self.cursor.execute(sql_command)
    #     return self.cursor.fetchall()


    def save_to_csv(self, output_dir_path):
        import pandas as pd

        os.makedirs(output_dir_path,exist_ok=True)

        for table in DbManager.TABLE_NAMES:
            pd.read_sql_query(f"SELECT * FROM {table}", self.connection).to_csv(os.path.join(output_dir_path,table+'.csv'), index=False)

            
    def _get_insert_command(self,table_name:str,fields:List[str]):
        raw = fields[table_name]
        fields = ', '.join(raw)
        values = ', '.join([':'+x for x in raw])
        return f'INSERT INTO {table_name} ({fields}) VALUES ({values})'

    def _get_select_command(self,table_name:str,columns:list,where: str):
        command = f'SELECT {", ".join(columns)} FROM {table_name}'
        if where is not None:
            command += f' WHERE {where}'
        return command
    
    def _get_update_command(self,table_name:str,data:dict,where_keys:list[str]):
        set_keys = [key for key in data if key not in where_keys]
        return f"UPDATE {table_name} SET {','.join([f'{x} = :{x}'for x in set_keys])} WHERE {'AND'.join([f'{x} = :{x}' for x in where_keys])}"


    # inserts a single new row into any table, 
    # data dictionary must contain each field defined in TABLES_INSERT_FIELDS
    def _insert_single(self,table_name:str,data:dict): 
        try:
            self.cursor.execute(self._get_insert_command(table_name,DbManager.TABLES_INSERT_FIELDS),data)
        except sqlite3.IntegrityError as e:
            return ReturnCode.Sql.INTEGRITY_ERROR
 

    def _insert_single_raw(self,table_name,data:dict):
        self.cursor.execute(self._get_insert_command(table_name,DbManager.TABLES_FIELDS),data)

    def _insert_multiple_raw(self,table_name,data:list[dict]):
        self.cursor.executemany(self._get_insert_command(table_name,DbManager.TABLES_FIELDS),data)

    def select_single_table(self,table_name:str,columns:list,where: str | None = None,where_values = None):
        command = self._get_select_command(table_name,columns,where)
        self.cursor.execute(command,where_values)
    
    def update(self,table_name:str,data:dict,where_keys:list[str]):
        self.cursor.execute(self._get_update_command(table_name,data,where_keys),data)

    def get_lastrowid(self):
        return self.cursor.lastrowid

    def commit(self):
        self.connection.commit()

    def execute(self,command,params):
        try:
            self.cursor.execute(command,params)
            return ReturnCode.General.SUCCESS
        except sqlite3.IntegrityError as e:
            return ReturnCode.Sql.INTEGRITY_ERROR


    def fetchall(self) -> List[dict]:
        return [dict(row) for row in (self.cursor.fetchall())]
    def fetchone(self) -> dict | None:
        row = self.cursor.fetchone()
        return dict(row) if row else None

