# HealthSimple - BrajCoders (Innovate-X Hackathon)

**HealthSimple** is a multilingual health information platform designed to provide simplified, verified medical advice for common symptoms, bridging the gap for rural and elderly populations.

## 🚀 Features Live Now
- **Symptom Analysis**: Enter symptoms (e.g., "headache", "fever") to get potential conditions, risk levels, and advice.
- **Multilingual Support 🇮🇳**: Toggle between **English** and **Hindi** for full interface and medical advice translation.
- **AI-Powered Analysis 🤖**: Uses **Google Gemini AI** to understand vague symptoms and provide accurate insights.
- **Offline Mode (PWA) 📶**: Works without internet access using a local database of conditions.
- **Nearby Doctor Locator 🏥**: Finds hospitals and clinics within 5km using your current location (powered by OpenStreetMap).
- **Voice Support (Speech-to-Text) 🎤**: Speak your symptoms in English or Hindi instead of typing.
- **User Profiles & History 👤**: Create an account to save your health reports and track symptoms over time.
- **Risk Assessment**: Color-coded risk levels (Low, Medium, High, Critical) to guide urgency.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS v4.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, PWA
- **Maps**: Leaflet, OpenStreetMap Overpass API
- **Backend**: Node.js, Express, MongoDB
- **AI**: Google Gemini API

## 🔮 Future Roadmap (To-Do)
The following features are planned for the next phase of development:

- [ ] **Appointment Booking**
    - Directly book appointments with nearby doctors.

## 🤝 Setup Guide for Teammates

If you are cloning this repo, follow these steps to run it locally:

### 1. Prerequisite
-   Install [Node.js](https://nodejs.org/) (v16+).
-   Get the `.env` file from me (Tanmay) and place it inside the `server/` folder.

### 2. Installation
Open your terminal and run the following commands:

```bash
# 1. Install Client Dependencies
cd client
npm install

# 2. Install Server Dependencies (Open a new terminal)
cd ../server
npm install
```

### 3. Running the Project
You need TWO terminals running at the same time:

**Terminal 1 (Frontend):**
```bash
cd client
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
# If you have nodemon installed globally:
nodemon index.js

# OR uses node directly:
node index.js
```

### 4. Verify
-   Frontend: Open [http://localhost:5173](http://localhost:5173) used to run the app.
-   Backend: Ensure terminal says `MongoDB Connected`.

## 📦 Previous Setup Config

1.  **Clone the repository**
2.  **Backend Setup**
    ```bash
    cd server
    npm install
    # Create .env with MONGO_URI
    npm run seed # To populate database
    npm start
    ```
### 3. Generate Offline Data
To enable offline capabilities, you must generate the local data file:
```bash
cd server
node scripts/exportOfflineData.js
```

### 4. Run the Client
```bash
cd client
npm install
npm run dev
```
