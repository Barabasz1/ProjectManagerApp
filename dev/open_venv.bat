@echo off
setlocal

set PROJECT_DIR=%cd%
start cmd /k "cd ../venv/Scripts && activate && cd %PROJECT_DIR%"

endlocal