import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Se o email estiver correto, você receberá um link para redefinir sua senha.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-center text-white/80 pt-2">
            Digite seu email para receber as instruções.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Seu email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 rounded-xl p-3"
                />
              </div>
              {error && (
                <p className="text-red-300 text-sm text-center">{error}</p>
              )}
              {message && (
                <p className="text-green-300 text-sm text-center">{message}</p>
              )}
              <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-base">
                {loading ? 'Enviando...' : 'Enviar Instruções'}
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <Button variant="link" onClick={() => navigate('/auth')} className="text-sm text-violet-300 hover:text-violet-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;
