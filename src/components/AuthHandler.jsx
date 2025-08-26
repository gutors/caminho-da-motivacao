import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * @returns {null}
 * @description This component is responsible for handling the logic after a user logs in.
 * It checks if a voice is selected and redirects the user to the appropriate screen.
 * If a voice is selected, the user is redirected to the Home screen.
 * Otherwise, the user is redirected to the Voice Selection screen.
 * This component is not rendered, it only handles the redirection logic.
 * It is used in the App.jsx file as a route.
 * @example
 * <Route path="/auth-handler" element={<AuthHandler />} />
 */
const AuthHandler = () => {
  const { selectedVoice } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedVoice) {
      navigate('/');
    } else {
      navigate('/voice-selection');
    }
  }, [selectedVoice, navigate]);

  return null;
};

export default AuthHandler;