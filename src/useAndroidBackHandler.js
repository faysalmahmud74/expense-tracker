import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useLocation, useNavigate } from 'react-router-dom';

const BackButtonHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let removeListener = null;

    CapacitorApp.addListener('backButton', () => {
      if (location.pathname !== '/') {
        navigate(-1);
      } else {
        if (window.confirm('Do you want to exit the app?')) {
          CapacitorApp.exitApp();
        }
      }
    }).then(listener => {
      removeListener = listener.remove;
    });

    return () => {
      if (typeof removeListener === 'function') {
        removeListener();
      }
    };
  }, [location.pathname, navigate]);

  return null;
};

export default BackButtonHandler;