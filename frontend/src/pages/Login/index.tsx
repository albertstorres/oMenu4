import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import './styles.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema CardápioDigital.",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Credenciais inválidas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <UtensilsCrossed className="login-logo-icon" />
          </div>
          <h1 className="login-title">oMenu</h1>
          <p className="login-subtitle">Faça login para acessar o sistema</p>
        </div>

        <Card className="login-card">
          <CardHeader>
            <CardTitle className="login-card-title">Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password">Senha</Label>
                <div className="password-input">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="password-icon" />
                    ) : (
                      <Eye className="password-icon" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="login-button"
                disabled={isLoading || loading}
                size="lg"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="login-demo">
              
              <div className="demo-accounts">
               
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
