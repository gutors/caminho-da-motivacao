import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Customização da aparência para combinar com o app
const customTheme = {
  default: {
    colors: {
      brand: '#22c55e', // green-500
      brandAccent: '#16a34a', // green-600
      brandButtonText: 'white',
      defaultButtonBackground: 'white',
      defaultButtonBackgroundHover: '#f4f4f5', // gray-100
      defaultButtonBorder: '#e4e4e7', // gray-200
      defaultButtonText: '#18181b', // gray-900
      dividerBackground: 'rgba(255, 255, 255, 0.2)',
      inputBackground: 'rgba(255, 255, 255, 0.1)',
      inputBorder: 'rgba(255, 255, 255, 0.3)',
      inputBorderHover: 'rgba(255, 255, 255, 0.5)',
      inputBorderFocus: 'rgba(255, 255, 255, 0.7)',
      inputText: 'white',
      inputLabelText: 'white',
      inputPlaceholder: '#a1a1aa', // gray-400
      messageText: '#d4d4d8', // gray-300
      messageTextDanger: '#f87171', // red-400
      anchorTextColor: '#a78bfa', // violet-400
      anchorTextHoverColor: '#8b5cf6', // violet-500
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '16px',
    },
    fontSizes: {
      baseLabelSize: '14px',
      baseInputSize: '14px',
      baseButtonSize: '14px',
    },
    fonts: {
      bodyFont: 'inherit',
      buttonFont: 'inherit',
      labelFont: 'inherit',
    },
    radii: {
      borderRadiusButton: '9999px',
      buttonBorderRadius: '9999px',
      inputBorderRadius: '12px',
    },
  },
};

const AuthScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/auth-handler');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Caminho da Motivação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            providers={[]}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Seu email',
                  password_label: 'Sua senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha segura',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Seu email',
                  password_label: 'Crie uma senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Crie uma senha segura',
                  button_label: 'Cadastrar',
                  social_provider_text: 'Cadastrar com',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                forgotten_password: {
                  email_label: 'Seu email',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções',
                  link_text: 'Esqueceu a senha?',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
