python3 -m venv env

source env/bin/activate

pip list

pip freeze > requirements.txt

pip install -r requirements.txt

deactivate


source env/bin/activate
pip install ipykernel
python -m ipykernel install --user --name=env --display-name "Python (env)"
