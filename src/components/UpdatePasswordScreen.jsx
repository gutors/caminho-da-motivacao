import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const UpdatePasswordScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sua senha foi atualizada com sucesso! Você já pode fazer o login.');
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
            Atualizar Senha
          </CardTitle>
          <CardDescription className="text-center text-white/80 pt-2">
            Digite sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua nova senha segura"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
                {loading ? 'Atualizando...' : 'Atualizar Senha'}
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <Button variant="link" onClick={() => navigate('/auth')} className="text-sm text-violet-300 hover:text-violet-400">
                Ir para o Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordScreen;
