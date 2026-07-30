import * as React from 'react';
import { useState } from 'react';
import { 
  Mail, Lock, ArrowRight, Utensils, Eye, EyeOff, Shield, Zap 
} from 'lucide-react';
import { api } from '../../services/api';

interface LoginPageProps {
  onNavigate?: (page: 'login' | 'register' | 'support' | 'forgot-password') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email, password);
      console.log('Login successful:', response);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('register');
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('forgot-password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background flex items-center justify-center h-16 px-4 md:px-8 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary w-6 h-6" />
          <h1 className="text-2xl font-bold text-primary">SaaS Restaurante</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-container opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-tertiary-container opacity-5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md space-y-6 z-10">
          {/* Login Card */}
          <div className="bg-white login-card border border-outline-variant rounded-xl p-8 transition-all duration-300 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-on-surface mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-base text-on-surface-variant">
                Acesse sua plataforma de gestão gastronômica
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant ml-1" htmlFor="email">
                  E-mail Corporativo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                    id="email"
                    name="email"
                    placeholder="nome@restaurante.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">
                    Senha
                  </label>
                  <button
                    onClick={handleForgotPasswordClick}
                    className="text-xs font-semibold text-primary hover:underline transition-all bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-primary-container text-on-primary-container text-sm font-medium py-4 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase">
                <span className="bg-white px-4 text-on-surface-variant">Ou continue com</span>
              </div>
            </div>

            {/* Social Login */}
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant rounded-lg bg-white hover:bg-surface-container-low transition-colors duration-200">
              <img
                className="w-5 h-5"
                alt="Google logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIhxXPbNMSJ-y60j8kg6TEccO6sg2xah38VKyTMXsZ_5fudVr3-yeswU21mvwbZCV4_YrBpFLKrEFrNhRn6CX0jJVIQuBrS33FSxJusCTI6wN4vRHfqbOkwI7_6k-negMWKTqqULXMh6gMLbBq8YJrg0YQuk3dt7q3tniMo7MMZ_i4sqdC0MQMsUEhNgp4B2aoCfAT4iPqYk3yxgLTu9lnRyL2FFngbg59OK_MekQK4fA3y-gznONr"
              />
              <span className="text-sm font-medium text-on-surface">
                Google Workspace
              </span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-base text-on-surface-variant">
                Novo por aqui?
                <button
                  onClick={handleRegisterClick}
                  className="text-primary font-semibold hover:underline ml-1 bg-transparent border-none cursor-pointer"
                  type="button"
                >
                  Criar uma conta
                </button>
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold">Dados protegidos</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold">Acesso rápido</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t border-outline-variant px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Utensils className="text-primary w-6 h-6" />
            <span className="text-2xl font-semibold text-primary">SaaS Restaurante</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a className="text-xs font-semibold text-on-surface-variant hover:text-primary hover:underline transition-colors duration-200" href="#">
              Terms of Service
            </a>
            <a className="text-xs font-semibold text-on-surface-variant hover:text-primary hover:underline transition-colors duration-200" href="#">
              Privacy Policy
            </a>
            <a className="text-xs font-semibold text-on-surface-variant hover:text-primary hover:underline transition-colors duration-200" href="#">
              Contact Support
            </a>
          </div>
          <p className="text-xs font-semibold text-secondary opacity-70">
            © 2026 SaaS Restaurante. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;