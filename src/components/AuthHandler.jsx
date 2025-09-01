import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader } from 'lucide-react';

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
  const { selectedVoice, isProfileLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isProfileLoading) {
        if (selectedVoice) {
            navigate('/');
        } else {
            navigate('/welcome');
        }
    }
  }, [selectedVoice, navigate, isProfileLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col justify-center items-center p-6 text-white">
        <Loader className="w-12 h-12 animate-spin" />
        <p className="mt-4 text-lg">Carregando seu perfil...</p>
    </div>
  );
};

export default AuthHandler;