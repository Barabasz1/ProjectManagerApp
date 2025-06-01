import os
from backend.utils import get_master_dir
import sqlite3



class DbManager:

    DEFAULT_DB_PATH = os.path.join(get_master_dir(),'data','db.sql')

    TABLE_NAMES = [
        "account",
        "user",
        "project",
        "team",
        "participation",
        "team_composition",
        "task",
        "task_team_assignment",
        "task_user_assignment",
        "task_status_history"
    ]

    TABLES_INSERT_FIELDS = {
        'account': ['login', 'password', 'creation_date'],
        'user': ['f_name', 'l_name', 'email', 'description'],
        'project': ['name', 'manager', 'description', 'creation_date', 'version', 'deadline'],
        'team': ['name'],
        'participation': ['project', 'team'],
        'team_composition': ['team', 'user', 'role'],
        'task': ['project', 'name', 'description', 'creation_date', 'deadline', 'status', 'priority'],
        'task_team_assignment': ['task', 'team'],
        'task_user_assignment': ['task', 'user'],
        'task_status_history': ['task', 'old_status', 'new_status', 'changed_at']
    }


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
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS participation (
            project INTEGER NOT NULL,
            team INTEGER NOT NULL,
            PRIMARY KEY (project, team),
            FOREIGN KEY(project) REFERENCES project(id),
            FOREIGN KEY(team) REFERENCES team(id)
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

    def execute(self,sql_command:str):
        self.cursor.execute(sql_command)
        self.connection.commit()

    def select(self,sql_command:str):
        self.cursor.execute(sql_command)
        return self.cursor.fetchall()


    def save_to_csv(self, output_dir_path):
        import pandas as pd

        os.makedirs(output_dir_path,exist_ok=True)

        for table in DbManager.TABLE_NAMES:
            pd.read_sql_query(f"SELECT * FROM {table}", self.connection).to_csv(os.path.join(output_dir_path,table+'.csv'), index=False)

            
    def _get_insert_command(self,table_name:str):
        raw = DbManager.TABLES_INSERT_FIELDS[table_name]
        fields = ', '.join(raw)
        values = ', '.join([':'+x for x in raw])
        return f'INSERT INTO {table_name} ({fields}) VALUES ({values})'
    


    # inserts a single new row into any table, 
    # data dictionary must contain each field defined in TABLES_INSERT_FIELDS
    def _insert_single(self,table_name:str,data:dict):
        self.cursor.execute(self._get_insert_command(table_name),data)







    # def _add_account(self, account_data:dict):
    #     self.cursor.execute("""INSERT INTO account (login, password, creation_date) VALUES (:login, :password, :creation_date)""", account_data)
    #     self.connection.commit()

    # def _add_user(self, user_data:dict):
    #     self.cursor.execute("""INSERT INTO user (id, f_name, l_name, email, description)VALUES (:id, :f_name, :l_name, :email, :description)""", user_data)
    #     self.connection.commit()