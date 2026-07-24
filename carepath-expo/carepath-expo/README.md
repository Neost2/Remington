# CarePath Mobile (Expo)

Expo (React Native) client for the CarePath backend API.

## What this app does
- Shows an **Intro/Loader** screen that explains what CarePath is.
- Requires the user to **Log in** or **Create an account**.
- After login, allows a **Patient** to submit a **Ride Request** to the API.

This project is designed to point at your existing backend running on **http://localhost:3001**.

---

## 0) Prereqs
- Node.js 18+
- A phone with Expo Go installed **or** an Android emulator / iOS simulator
- Your backend running locally (from the zip you provided)

---

## 1) Start the backend (from your existing repo)
From your backend root (the folder that contains `src/app.ts` and `package.json`):

```bash
npm install
cp .env.example .env
# edit .env if needed (DB, JWT_SECRET)

npm run dev
```

You should see the API on:
- http://localhost:3001/health

---

## 2) Create this Expo app folder
Create a new folder **next to** your backend folder (recommended):

```
CarePath/
  (backend files...)
carepath-expo/
  (this mobile app)
```

Then copy/paste the files from this project exactly.

---

## 3) Install dependencies
From the `carepath-expo` folder:

```bash
npm install
```

---

## 4) Configure the API base URL
This app reads the API URL from `app.config.ts`.

### Important note about `localhost`
On a phone, `localhost` means the phone itself, not your laptop.

Pick the right value:
- **Android emulator:** use `http://10.0.2.2:3001`
- **iOS simulator:** use `http://localhost:3001`
- **Real phone on same Wi‑Fi:** use `http://<YOUR_COMPUTER_LAN_IP>:3001` (example `http://192.168.1.50:3001`)

Set it in `app.config.ts`:

```ts
const API_URL = 'http://10.0.2.2:3001';
```

---

## 5) Run the app

```bash
npm run start
```

Then:
- Press `a` for Android
- Press `i` for iOS (Mac)
- Or scan the QR code with Expo Go

---

## 6) Test the flow
1. Intro screen explains the app.
2. Tap **Get started**.
3. Create account (email/phone/password/first+last name, role = PATIENT).
4. After login, go to **Request a ride**.
5. Submit a ride request.

---

## Troubleshooting
### "Network request failed"
- Your phone cannot reach `localhost` on your computer.
- Fix `API_URL` as described above.
- Make sure your backend allows requests without an Origin header (it does).

### 401 Unauthorized
- You are not logged in or the token expired.
- Use the Logout button and log back in.

---

## API endpoints used
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/rides` (requires role PATIENT)

The backend also requires that the logged-in user has a **Patient profile** row.
If you register as PATIENT but don’t have a Patient profile seeded/created yet, `/api/rides` will respond:
"Patient profile required before requesting a ride".

If that happens, we can add a Patient Profile creation screen (or you can seed one in the DB).
