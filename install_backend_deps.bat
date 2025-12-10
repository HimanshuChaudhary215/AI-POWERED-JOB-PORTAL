@echo off
REM Installs backend Python dependencies using the repository's backend\requirements.txt
REM Usage: double-click or run from cmd in the repo root.

pushd "%~dp0"
cd backend

REM Activate existing venv if present, otherwise create one
if exist venv\Scripts\activate.bat (
  call venv\Scripts\activate.bat
) else (
  echo No virtualenv found in backend\venv — creating one now...
  python -m venv venv
  call venv\Scripts\activate.bat
)

python -m pip install --upgrade pip
echo Installing requirements from %CD%\requirements.txt
pip install -r requirements.txt

popd
echo Backend dependencies installed.
