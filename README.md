# 💬 WhatsApp Chat Viewer

Relive your WhatsApp conversations in an authentic mobile UI — complete with phone mockup, green bubbles, date dividers, clickable links, edited message labels, and smooth scroll navigation.

> **100% private.** Everything runs in the browser. No chat data is ever uploaded anywhere.

---

## ✨ Features

- 📱 Realistic iPhone mockup with WhatsApp UI
- 🟢 Your messages on the right (green), others on the left (white)
- 👥 Full group chat support with colour-coded sender names
- 🔗 Clickable links in messages
- ✏️ Edited message label (shown inline beside the timestamp)
- 📅 Smart date labels — "Today", "Yesterday", full date otherwise
- 🔼🔽 Scroll-to-top & scroll-to-bottom navigation buttons
- 🎥 Media omitted placeholders (photo, video, audio, sticker, GIF, document)
- 🚫 Deleted message display
- 🌐 Supports Android & iOS export formats, 12h & 24h clocks

---

## 🚀 Deploy in 5 minutes

### Option 1 — Netlify (recommended, free)

1. Push this folder to a GitHub / GitLab repo
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
3. Connect your repo
4. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **Deploy** — you'll get a live URL in ~1 minute

### Option 2 — Render (free)

1. Push to GitHub
2. Go to [render.com](https://render.com) → **New** → **Static Site**
3. Connect repo, then set:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Click **Create Static Site**

### Option 3 — Run locally

```bash
npm install
npm start
# Opens at http://localhost:3000
```

### Option 4 — Build for any static host

```bash
npm install
npm run build
# Upload the /build folder to any static host (Vercel, GitHub Pages, S3, etc.)
```

---

## 📂 Project structure

```
whatsapp-chat-viewer/
├── public/
│   └── index.html            # HTML shell
├── src/
│   ├── index.js              # React entry point
│   ├── index.css             # Global styles & CSS variables
│   ├── App.jsx               # Root component & step router
│   ├── components/
│   │   ├── UploadScreen.jsx  # Step 1 — file upload UI
│   │   ├── SelectScreen.jsx  # Step 2 — pick your name
│   │   ├── ChatView.jsx      # Step 3 — phone mockup + chat
│   │   ├── ChatMessage.jsx   # Individual message bubble
│   │   └── Avatar.jsx        # Coloured avatar circle
│   └── utils/
│       ├── parser.js         # WhatsApp .txt parser
│       └── dateUtils.js      # Date parsing & label formatting
├── netlify.toml              # Netlify build + redirect config
├── .gitignore
└── package.json
```

---

## 📤 How to export your WhatsApp chat

1. Open any chat or group in WhatsApp
2. Tap **⋮** (Android) or the contact/group name (iOS) → **Export Chat**
3. Choose **Without Media**
4. Save or share the `.txt` file
5. Upload it to the app

---

## 🛡️ Privacy

No servers, no databases, no analytics. The `.txt` file is read entirely by your browser using the [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). Nothing ever leaves your device.
