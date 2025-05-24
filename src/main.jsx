import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './App';
import Reports from './pages/Report';
import Income from './pages/Income';
import Expense from './pages/Expense';
import { LanguageProvider } from './LanguageProvider';
import NotFound from './components/not-found';
import About from './pages/About';
import Charts from './pages/Chart';
import BackButtonHandler from './useAndroidBackHandler';


const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <LanguageProvider>
      <Router>

        <BackButtonHandler />

        <ToastContainer  //react-toastify config defalut
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/credit" element={<Income />} />
          <Route path="/debit" element={<Expense />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />

        </Routes>

      </Router>
    </LanguageProvider>
  </StrictMode>
);