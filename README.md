# HealthSimple - BrajCoders (Innovate-X Hackathon)

**HealthSimple** is a multilingual health information platform designed to provide simplified, verified medical advice for common symptoms, bridging the gap for rural and elderly populations.

## 🚀 Features Live Now
- **Symptom Analysis**: Enter symptoms (e.g., "headache", "fever") to get potential conditions, risk levels, and advice.
- **Multilingual Support 🇮🇳**: Toggle between **English** and **Hindi** for full interface and medical advice translation.
- **Risk Assessment**: Color-coded risk levels (Low, Medium, High, Critical) to guide urgency.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS v4.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)

## 🔮 Future Roadmap (To-Do)
The following features are planned for the next phase of development:

- [ ] **Voice Support (Speech-to-Text) 🎤**
    - Allow users to speak their symptoms instead of typing, making it accessible for users with low literacy.
- [ ] **Real AI Integration (Gemini/OpenAI) 🤖**
    - Replace keyword matching with LLMs to understand vague descriptions like "head feels heavy" or local dialects.
- [ ] **Doctor & Hospital Locator 🏥**
    - Integrate Google Maps API to show the nearest clinics/hospitals based on the user's location, especially for "High" risk results.
- [ ] **Offline Mode (PWA)**
    - Make the app work offline for areas with poor internet connectivity.
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
