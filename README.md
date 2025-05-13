# CSCI3100 Project

ChatApp is a web-based chat application. It contains basic features that enable online messaging. 


## How to start a local server
We need to start the backend first. 

1. To do that, we need to first make sure the backend is connected to the right database. You should change replace the environment variable `MONGODB_URI` in the file `backend/.env` with your own database uri.

2. Now, you can go to the backend:
```
cd backend
```

3. Install the npm modules if you have not do so:
```
npm install
```

4. You are ready to start the server now:
```
npm run dev
```


## How to start the frontend
With server ready, we are ready to run the app in the development mode.

1. Go to frontend:
```
cd frontend
```

2. Install the npm modules if you have not do so:
```
npm install
```

3. Start the frontent:
```
npm start
```
