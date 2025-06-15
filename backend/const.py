from enum import Enum

class ReturnCode:
    # authorization
    class General(Enum):
        SUCCESS = 0
    
    class Auth(Enum):
        LOGIN_NOT_FOUND = 0
        WRONG_PASSWORD = 1

    # session
    class Sess(Enum):
        NOT_LOGGED_IN = 0

    class Sql(Enum):
        INTEGRITY_ERROR = 0
