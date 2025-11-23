# 🚀 Deployment Guide: How to Deploy HealthSync for Free

This guide will take you through every single step to deploy your MERN stack application live on the internet for free.

**We will use:**
1.  **MongoDB Atlas** for the Database (Free)
2.  **Render** for the Backend (Free)
3.  **Vercel** for the Frontend (Free)

---

## 🟢 Step 1: Prepare Your Code (GitHub)

Before deploying, your code must be on GitHub.

1.  **Login to GitHub** and go to your profile.
2.  Click the **+** icon in the top right -> **New repository**.
3.  Name it `healthsync-project`.
4.  Select **Public**.
5.  Click **Create repository**.
6.  Open your project folder in VS Code.
7.  Open the terminal (Ctrl+`) and run these commands one by one:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/healthsync-project.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

---

## 🟢 Step 2: Setup Database (MongoDB Atlas)

If you are already using MongoDB Atlas, you just need to allow access from anywhere.

1.  **Log in** to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Go to your **Cluster** dashboard.
3.  Click **Network Access** in the left sidebar.
4.  Click **+ Add IP Address**.
5.  Click **Allow Access from Anywhere** (It will add `0.0.0.0/0`).
6.  Click **Confirm**.
7.  Go to **Database Access** in the left sidebar.
8.  Make sure you know your **username** and **password**. If you forgot, create a new user.
9.  Go to **Database** (left sidebar) -> Click **Connect**.
10. Click **Drivers**.
11. **Copy** the connection string. It looks like:
    `mongodb+srv://<username>:<password>@cluster0.xv89z.mongodb.net/?retryWrites=true&w=majority`
12. **Save this string** in a notepad. Replace `<password>` with your actual password.

---

## 🟢 Step 3: Deploy Backend (Render)

1.  Go to [Render.com](https://render.com/) and **Sign Up** with GitHub.
2.  Click **New +** button (top right) -> Select **Web Service**.
3.  Select **Build and deploy from a Git repository**.
4.  Find your `healthsync-project` and click **Connect**.
5.  **Configure the service:**
    *   **Name:** `healthsync-backend` (or any unique name)
    *   **Region:** Singapore (or nearest to you)
    *   **Branch:** `main`
    *   **Root Directory:** `backend` (IMPORTANT!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
    *   **Instance Type:** Free
6.  **Environment Variables:**
    *   Scroll down to "Environment Variables".
    *   Click **Add Environment Variable**.
    *   Add all variables from your `backend/.env` file:
        *   `MONGODB_URI`: (Paste the string from Step 2)
        *   `JWT_SECRET`: (Your secret key)
        *   `BIOMISTRAL_API_KEY`: (Your AI key)
        *   `HF_API_KEY`: (Your Hugging Face key)
        *   `TWILIO_SID`: (Your Twilio SID)
        *   `TWILIO_AUTH_TOKEN`: (Your Twilio Token)
        *   `TWILIO_PHONE`: (Your Twilio Number)
        *   `SMTP_USER`: (Your Email)
        *   `SMTP_PASS`: (Your App Password)
        *   `NODE_ENV`: `production`
        *   `PORT`: `10000` (Render uses port 10000 by default internally, but just set it to be safe)
7.  Click **Create Web Service**.
8.  **Wait** for the deployment to finish. It will take a few minutes.
9.  Once "Live", copy the **URL** at the top left (e.g., `https://healthsync-backend.onrender.com`).
    *   **Save this URL.** This is your **BACKEND_URL**.

---

## 🟢 Step 4: Deploy Frontend (Vercel)

1.  Go to [Vercel.com](https://vercel.com/) and **Sign Up** with GitHub.
2.  Click **Add New...** -> **Project**.
3.  Find `healthsync-project` and click **Import**.
4.  **Configure Project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** Click **Edit** and select `frontend`.
5.  **Environment Variables:**
    *   Click **Environment Variables**.
    *   **Key:** `VITE_API_URL`
    *   **Value:** (Paste your **BACKEND_URL** from Step 3, e.g., `https://healthsync-backend.onrender.com`)
    *   *Note: Do NOT add a trailing slash `/` at the end.*
6.  Click **Deploy**.
7.  Wait for the confetti! 🎉
8.  Click **Continue to Dashboard**.
9.  Click **Visit** to see your live website!

---

## 🟢 Step 5: Final Connection Check

1.  Go back to **Render** (Backend).
2.  Go to **Environment Variables**.
3.  Add/Update:
    *   `FRONTEND_URL`: (Paste your new **Vercel Frontend URL**, e.g., `https://healthsync-project.vercel.app`)
4.  **Save Changes**. Render will restart the server automatically.

---

## ✅ Done!

Your project is now live!
*   **Frontend:** `https://healthsync-project.vercel.app`
*   **Backend:** `https://healthsync-backend.onrender.com`

**Troubleshooting:**
*   **White screen on frontend?** Check the Console (F12) for errors. Usually, it's a wrong `VITE_API_URL`.
*   **Login failing?** Check Render logs. It might be a MongoDB connection issue (IP whitelist).
