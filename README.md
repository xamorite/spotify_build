## 🎵 Musix - Modern Music Streaming Platform

Musix is a modern music streaming platform built with **Next.js**, **Firebase**, and the **Spotify Web API**. Stream millions of tracks, discover new music, and enjoy a premium listening experience.

---

## ✨ Features

* **Vast Music Library:** Access millions of tracks powered by the **Spotify Web API**
* **Secure Authentication:** User authentication and data storage via **Firebase**
* **Smart Search:** Find your favorite artists, albums, and tracks instantly
* **Personal Library:** Save and organize your favorite tracks
* **Live Lyrics:** Sing along with real-time lyrics integration
* **30-Second Previews:** Listen to track previews directly in-app
* **Sleek UI:** Modern, responsive interface inspired by Spotify and YouTube Music

---

## 💻 Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **Next.js 15** | React framework with pages router for server-side rendering |
| **Tailwind CSS 4** | Utility-first CSS framework for modern styling |
| **React Icons** | Beautiful icon library for UI elements |

### Backend & Services
| Technology | Description |
| :--- | :--- |
| **Firebase** | Authentication and Firestore database for user data |
| **Spotify Web API** | Access to millions of tracks, albums, and artists |
| **Next.js API Routes** | Server-side API endpoints for Spotify integration |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* **Node.js 18+** (LTS recommended)
* **npm** or **yarn** package manager
* **Spotify Developer Account** - [Create one here](https://developer.spotify.com/dashboard)
* **Firebase Project** - [Create one here](https://console.firebase.google.com/)

---

### 1. Clone and Install

```bash
# Clone the repository (or navigate to your project directory)
cd musicweb

# Install dependencies
npm install
# or
yarn install
```

---

### 2. Configure Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in the app details:
   - **App Name**: Musix (or your choice)
   - **App Description**: Music streaming platform
   - **Redirect URI**: `http://localhost:3000` (for development)
4. After creating, copy your **Client ID** and **Client Secret**

---

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password provider
4. Enable **Firestore Database**
5. Go to **Project Settings** > **General**
6. Scroll to "Your apps" and copy the Firebase config values

---

### 4. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your actual credentials:
   ```env
   # Spotify API
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

---

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📝 Important Notes

### Spotify Preview URLs
This app uses Spotify's 30-second preview URLs for playback. Full track playback requires:
- Spotify Premium account
- Implementation of Spotify Web Playback SDK
- User OAuth authentication (not currently implemented)

### Firebase Security
Make sure to configure Firestore security rules in production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🏗️ Project Structure

```
musicweb/
├── src/
│   ├── api/              # API client code
│   │   ├── spotifyClient.js   # Spotify API integration
│   │   └── musicApi.js        # Client-side API helpers
│   ├── auth/             # Authentication
│   │   └── useAuth.js         # Firebase auth context
│   ├── components/       # Reusable UI components
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Next.js pages & API routes
│   │   ├── api/spotify/  # Spotify API endpoints
│   │   ├── index.js      # Landing page
│   │   ├── home.js       # Main app page
│   │   └── ...
│   ├── player/           # Music player context
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env.local           # Environment variables (gitignored)
├── env.example          # Environment template
└── package.json
```

---

## 🔧 Troubleshooting

### Spotify "Redirect URI" Error
If the Spotify Dashboard gives you an error about `http`:
1.  **Check the Field**: Make sure you are adding the URL to **"Redirect URIs"**, *not* "Website".
2.  **Use Localhost**: Spotify allows `http` ONLY for `localhost`.
    *   ✅ `http://localhost:3000/api/auth/callback` (Allowed)
    *   ❌ `http://192.168.1.5:3000/api/auth/callback` (Blocked - requires HTTPS)
3.  **Save Carefully**: Sometimes the "Add" button must be clicked before "Save".

## 🚀 Deployment


### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

---

## 📄 License

This project is for educational purposes. Spotify API usage must comply with [Spotify Developer Terms](https://developer.spotify.com/terms).

---

## 🙏 Acknowledgments

- **Spotify** for their comprehensive Web API
- **Firebase** for authentication and database services
- **Next.js** team for the amazing framework
