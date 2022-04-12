# start back and frontend in one go
# start with bash -i ./start_all.sh
conda activate XAI
cd backend-project
gnome-terminal -- uvicorn app:app --reload
cd ../react-frontend
npm start