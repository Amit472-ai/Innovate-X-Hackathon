# HealthSimple - BrajCoders (Innovate-X Hackathon)

**HealthSimple** is a multilingual health information platform designed to provide simplified, verified medical advice for common symptoms, bridging the gap for rural and elderly populations.

## 🚀 Features Live Now
- **Symptom Analysis**: Enter symptoms (e.g., "headache", "fever") to get potential conditions, risk levels, and advice.
- **Multilingual Support 🇮🇳**: Toggle between **English** and **Hindi** for full interface and medical advice translation.
- **AI-Powered Analysis 🤖**: Uses **Google Gemini AI** to understand vague symptoms and provide accurate insights.
- **Offline Mode (PWA) 📶**: Works without internet access using a local database of conditions.
- **Nearby Doctor Locator 🏥**: Finds hospitals and clinics within 5km using your current location (powered by OpenStreetMap).
- **Voice Support (Speech-to-Text) 🎤**: Speak your symptoms in English or Hindi instead of typing.
- **Risk Assessment**: Color-coded risk levels (Low, Medium, High, Critical) to guide urgency.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS v4.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, PWA
- **Maps**: Leaflet, OpenStreetMap Overpass API
- **Backend**: Node.js, Express, MongoDB
- **AI**: Google Gemini API

## 🔮 Future Roadmap (To-Do)
The following features are planned for the next phase of development:

- [ ] **User History & Profiles**
    - Allow users to save their health reports and track symptoms over time.

## 📦 Setup & Run

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
