import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { UtensilsCrossed, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao CardápioDigital.",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro ao fazer login",
          description: result.error || "Credenciais inválidas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    const demoCredentials = {
      manager: { email: 'joao@restaurant.com', password: 'demo123' },
      waiter: { email: 'maria@restaurant.com', password: 'demo123' }
    };

    const credentials = demoCredentials[role];
    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      toast({
        title: `Login como ${role === 'manager' ? 'Gerente' : 'Garçom'}`,
        description: "Bem-vindo ao sistema!",
      });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-20 h-20 mx-auto mb-4">
              <UtensilsCrossed className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              CardápioDigital
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Faça login para acessar o sistema
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ou use uma conta demo
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('manager')}
                  disabled={loading}
                  className="w-full"
                >
                  Demo Gerente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('waiter')}
                  disabled={loading}
                  className="w-full"
                >
                  Demo Garçom
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/produtos')}
                className="text-orange-600 hover:text-orange-700"
              >
                Ver cardápio sem login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;