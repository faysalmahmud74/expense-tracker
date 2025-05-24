# Expense Tracker 365

**Expense Tracker 365** is a mobile-first expense tracking application built with React and Capacitor, packaged as an Android APK. It enables users to efficiently manage daily income and expenses through a clean and intuitive interface. Designed for performance and usability, it operates smoothly as a native Android app while leveraging modern web technologies.

## Features

- Add, edit, and delete income and expense transactions
- Visualize income vs. expenses using an interactive pie chart
- Filter and sort transactions by:
  - Date (ascending/descending)
  - Debit amount (ascending/descending)
  - Credit amount (ascending/descending)
  - Reset filters to default view
- Responsive layout optimized for mobile and tablet devices
- Offline functionality with secure, persistent local storage
- Built with React and styled using Tailwind CSS
- Packaged as an Android APK using Capacitor

## Tech Stack

- **Frontend**: React (with Hooks)
- **Mobile Platform**: Capacitor
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Charting Library**: Recharts

## Getting Started (Web Version)

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/faysalmahmud74/expense-tracker.git
cd expense-tracker
npm install
npm run dev
````

### Build for Web Production

```bash
npm run build
```

## Building Android APK with Capacitor

Ensure you have Android Studio installed and properly configured.

### 1. Initialize Capacitor

```bash
npx cap init
```

### 2. Add Android Platform

```bash
npx cap add android
```

### 3. Copy Web Build to Native

```bash
npm run build
npx cap copy
```

### 4. Open Android Project

```bash
npx cap open android
```

Then, build and run the APK using Android Studio.

## Folder Structure

```
expense-tracker/
├── android/               # Android native project
├── public/                # Static assets
├── src/                   # React source code
│   ├── assets/            # Images and icons
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── data/              # Static or mock data
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main application component
├── capacitor.config.json  # Capacitor configuration
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

## License

MIT License
© 2025 Faysal Mahmud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Contribution

Contributions are welcome! If you have suggestions or feature requests, feel free to open an issue or submit a pull request.

## Contact

**Author**: Faysal Mahmud

**Email**: \[[mahmudfaysal64@gmail.com](mailto:mahmudfaysal64@gmail.com)]

**LinkedIn**: [https://linkedin.com/in/faysalmahmud74](https://linkedin.com/in/faysalmahmud74)
