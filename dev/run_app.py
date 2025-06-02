import subprocess
import time
import webbrowser
import os
import sys

def run_hidden(cmd, cwd=None):
    si = subprocess.STARTUPINFO()
    si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    si.wShowWindow = subprocess.SW_HIDE

    return subprocess.Popen(cmd, cwd=cwd, startupinfo=si, shell=True)

def main():
    backend_dir = os.path.abspath(os.path.join(os.getcwd(), "../backend"))
    frontend_dir = os.path.abspath(os.path.join(os.getcwd(), "../frontend"))

    fastapi_cmd = "fastapi dev fastapi_main.py"
    npm_cmd = "npm run dev"

    backend_proc = run_hidden(fastapi_cmd, cwd=backend_dir)

    frontend_proc = run_hidden(npm_cmd, cwd=frontend_dir)

    time.sleep(5)

    webbrowser.open("http://localhost:5173/")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("Stopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit()

if __name__ == "__main__":
    main()
