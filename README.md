# 🌀 [HiddenNexus](https://hiddennexus.vercel.app/)

A modern, anonymous confession platform with a beautiful glassmorphism UI, animated backgrounds, and real-time social features. Built with React, Tailwind CSS, and Google Sheets (via SheetDB.io) as the backend.

---

## ✨ Features
- Anonymous confessions (no login required)
- Like, comment, and "read more" on confessions
- Animated, infinite scroll feed with glassy cards
- Category filter bar for easy navigation
- Beautiful glassmorphism design with animated particles
- Responsive and mobile-friendly
- Sticky navbar and footer
- Built with ❤️ by [LavSarkari](https://github.com/lavsarkari)

---

## 🚀 Live Demo
> [Demo Link Coming Soon!]

---

## 🖼️ Screenshots
> ![Homepage Screenshot](https://github.com/user-attachments/assets/1aaffa6d-398e-4804-827a-d96b3a6349eb)
> ![Confessions Subbmission](https://github.com/user-attachments/assets/6e81d1b4-d7c4-47e4-8be1-14b7e19cb05f)

---

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, GSAP
- **Backend:** Google Sheets (via [SheetDB.io](https://sheetdb.io)) (REST API)
- **Hosting:** Vercel / Netlify (recommended)

---

## 🧑‍💻 Getting Started

### 1. **Clone the repo**
```bash
git clone https://github.com/lavsarkari/hiddennexus.git
cd hiddennexus
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Configure SheetDB.io** (i've left my key in the code.. dw its useless moreover it'll expire soon as 500 req per month)
- Create a Google Sheet with columns: `id`, `title`, `content`, `category`, `timestamp`, `likes`, `comments`.
- Connect it to [SheetDB.io](https://sheetdb.io) and get your API endpoint.
- Update the endpoint in your code (see `src/pages/Confess.js` and `src/pages/Confessions.js`).

### 4. **Run locally**
```bash
npm start
```

---

## 🌍 Deployment

### **Vercel**
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com), sign in, and import your repo.
3. Click "Deploy".

### **Netlify**
1. Push your code to GitHub.
2. Go to [netlify.com](https://netlify.com), sign in, and import your repo.
3. Click "Deploy".

---

## 🙏 Credits
- UI/UX: [LavSarkari](https://github.com/lavsarkari)
- Particles & Animations: OGL, GSAP, Framer Motion
- Backend: Google Sheets + SheetDB.io
- Ai ofc, was vibecoding it :>

---

## 📄 License
[MIT](./LICENSE)

## Support

For support, please open an issue in the GitHub repository or contact the development team.
