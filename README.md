# 🌟 ArticleAura – Your Personal Blogging Platform
![Banner](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/naxpa0453a6bhd69ci1c.png)
**ArticleAura** is a clean, responsive, and fully functional blogging platform built using **HTML**, **CSS**, **JavaScript**, **Node.js**, and **Firebase**. Designed for students and creators, it allows users to seamlessly create, manage, and read blogs.

---

## 🚀 Project Overview

> “A sleek, dynamic blogging experience—built for creators, by creators.”

ArticleAura empowers users to:
- ✍️ Write and publish their own blog posts
- 🖼️ Upload blog cover images
- 📚 Read and explore existing blogs
- 🔐 Store data securely with Firebase
- 📁 Manage content via an interactive dashboard

---

## 🎯 Features

### 🔧 Core Functionalities
- 📝 **Dynamic Blog Editor** – Create custom blog content with headings, text, and images
- 🗃️ **Auto-Routing** – Each blog has a unique URL based on title or ID
- 🖼️ **Image Upload** – Upload and store cover images using backend file handling
- 🔐 **Firebase Integration** – For authentication and blog metadata
- 🖥️ **Responsive UI** – Mobile-friendly and clean layout
- 🧰 **Node.js Backend** – Handles server logic and Express routes

---

## 🛠️ Tech Stack

| Frontend       | Styling            | Backend     | Services     |
|----------------|---------------------|-------------|--------------|
| HTML5          | CSS3 (custom)       | Node.js     | Firebase     |
| JavaScript     | Responsive Design   | Express.js  | File Upload  |

---

## 🖥️ Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/article-aura.git
cd article-aura
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

- Go to Project Settings → General → "Your apps" → Web App
- Copy your config object and paste it in a new file:

```js
// firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
firebase.initializeApp(firebaseConfig);
```

- Save this file as `firebase.js` inside `public/js/`
- ⚠️ **Important:** Never upload `firebase.js` to GitHub! It's ignored using `.gitignore`

### 4. Run the Server
```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
article-aura/
├── public/
│   ├── home.html
│   ├── editor.html
│   ├── blog.html
│   ├── dashboard.html
│   ├── css/
│   ├── js/
│   └── uploads/               # Ignored in Git
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── firebase.example.js        # Placeholder config
└── README.md
```

---

## 🔐 firebase.example.js

This file is included in the repo to show how to configure Firebase:

```js
// firebase.example.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
```

---



---

## 📝 License

This project is licensed under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software...
```

---

## 🤝 Acknowledgments

Thank you to:
- Firebase for hosting and database tools
- Node.js and Express for server-side handling
- Open source contributors who make learning and building fun
- Every creator and student who shares their voice ✨

> "Blog your thoughts. Share your mind. Inspire the world." – ArticleAura
