# Firebase Authentication Setup Guide

## Step 1: Set Up Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project (or use your existing project)
3. Once your project is created, click on it to enter the project dashboard

## Step 2: Enable Authentication Methods

1. In the Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable the following authentication methods:
   - Email/Password
   - Google
4. For Google authentication, follow the prompts to configure it

## Step 3: Get Firebase Configuration

1. In the Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to the "Your apps" section
3. If you haven't added a web app yet, click on the web icon (</>) to add a new web app
4. Register your app with a nickname (e.g., "Cricket Scoring System")
5. Copy the Firebase configuration object (it should look similar to the one in `frontend/src/firebase.js`)

## Step 4: Set Up Firebase Admin SDK for Backend

1. In the Firebase project dashboard, go to "Project settings"
2. Click on the "Service accounts" tab
3. Click on "Generate new private key" to download a JSON file containing your Firebase Admin SDK credentials
4. Create a `.env` file in the `backend` directory based on the `.env.example` template
5. Fill in the Firebase Admin SDK credentials from the downloaded JSON file:
   - `FIREBASE_PROJECT_ID`: The `project_id` from the JSON file
   - `FIREBASE_CLIENT_EMAIL`: The `client_email` from the JSON file
   - `FIREBASE_PRIVATE_KEY`: The `private_key` from the JSON file (make sure to keep the quotes and newline characters)

## Step 5: Update Frontend Configuration

1. Ensure the Firebase configuration in `frontend/src/firebase.js` matches your Firebase project settings

## Step 6: Set Up MongoDB

1. Create a MongoDB database (locally or using MongoDB Atlas)
2. Update the `MONGODB_URI` in the `.env` file with your MongoDB connection string

## Step 7: Start the Application

1. Start the backend server:
   ```
   cd backend
   npm install
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm install
   npm run dev
   ```

3. Access the application in your browser at the URL provided by the frontend development server

## Troubleshooting

- If you encounter CORS issues, ensure your backend server is properly configured to allow requests from your frontend origin
- If authentication fails, check that your Firebase configuration is correct and that the authentication methods are enabled
- If the backend cannot verify Firebase tokens, ensure your Firebase Admin SDK credentials are correctly set in the `.env` file