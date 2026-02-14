# How to Fix "404 Not Found" for Gemini API Key

The error "404 Not Found" for the model usually means your Google Cloud Project hasn't enabled the specific API needed for Gemini.

Follow these steps to fix it:

## Step 1: Go to Google Cloud Console
Open this link: [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)

## Step 2: Select Your Project
- In the top bar, click the project dropdown (it might say "My First Project" or similar).
- Select the project where you created your API Key.

## Step 3: Enable the API
1.  In the "Search for APIs & Services" bar, type: **Generative Language API**
2.  Click on the result named **"Generative Language API"** (by Google Enterprise API).
3.  Click the blue **ENABLE** button.

## Step 4: Wait & Retry
- Wait about 1-2 minutes for changes to propagate.
- Restart your server (`Ctrl+C` then `node index.js`).
- Try the search again on your website.

---
**Alternative:**
If the above doesn't work, ensure your API Key has no restrictions:
1.  Go to [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2.  Click the pencil icon next to your API Key.
3.  Under "API restrictions", select **"Don't restrict key"** or ensure "Generative Language API" is checked.
4.  Save changes.
