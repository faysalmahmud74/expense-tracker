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


const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <LanguageProvider>
      <Router>

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

        </Routes>

      </Router>
    </LanguageProvider>
  </StrictMode>
);