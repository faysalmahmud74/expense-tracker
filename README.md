# Expense Tracker — Desktop App

![GitHub Repo stars](https://img.shields.io/github/stars/faysalmahmud74/expense-tracker?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/faysalmahmud74/expense-tracker?color=blue&style=flat-square)
![License](https://img.shields.io/github/license/faysalmahmud74/expense-tracker?style=flat-square)

> A simple yet powerful offline Expense Tracker built with **React** & **Electron**, using **secure local storage** to keep your personal finances private and available — always.

---

## Preview

![Image](https://github.com/user-attachments/assets/b9c1d132-e573-45c9-9bcd-d99e099b9f15)

---

## 🚀 Features

✅ Add daily **credit/debit** transactions  
✅ Secure, persistent **local storage** using `electron-store`  
✅ Automatic **monthly report** with totals  
✅ Works **offline** – fully local  
✅ Cross-platform: Windows, macOS, and Linux  
✅ Clean, responsive UI built with React  
✅ Export/Import data (coming soon)  
✅ Dark mode (planned)

---

## 📦 Tech Stack

- ⚛️ React
- 🖥️ Electron
- 📁 Electron Store (for persistent storage)
- 🎨 Tailwind CSS (optional UI)
- 🔨 Electron Builder (for packaging)

---

## 🛠️ Installation

Clone the repo:

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
````

Install dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run electron
```

---

## 📦 Build Installer

Generate desktop app (Windows, macOS, Linux):

```bash
npm run build
npm run dist
```

Install the `.exe` or `.dmg` from the `dist/` folder!

> **Note:** You must install `electron-builder` globally if it's not bundled.

---

## 🧩 Folder Structure

```
expense-tracker/
├── public/
│   └── electron.js        # Electron main process
├── src/
│   ├── App.js
│   ├── components/
│   │   └── Tracker.js
│   ├── store/
│   │   └── storage.js     # Electron Store logic
├── package.json
└── README.md
```

---

## 📚 License

This project is licensed under the MIT License.
Feel free to fork, star, or contribute!

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you’d like to change.

---

## ❤️ Author

**Faysal Mahmud**
[GitHub](https://github.com/faysalmahmud74) • [LinkedIn](https://linkedin.com/in/faysalmahmud74)

---
