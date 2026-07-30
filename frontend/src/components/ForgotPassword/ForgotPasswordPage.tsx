import * as React from 'react';
import { useState } from 'react';
import { 
  Utensils, 
  Mail, 
  ArrowLeft, 
  Send, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { api } from '../../services/api';

interface ForgotPasswordPageProps {
  onNavigate?: (page: 'login' | 'register' | 'support' | 'forgot-password') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um email válido');
      return;
    }

    setLoading(true);

    try {
      // ✅ Agora o método está disponível no api.ts
      const response = await api.forgotPassword(email);
      console.log('Password reset email sent:', response);
      setSuccess(true);
      setLoading(false);
      setEmail('');

    } catch (err: any) {
      setError(err.message || 'Erro ao enviar link de recuperação. Tente novamente.');
      console.error('Forgot password failed:', err);
      setLoading(false);
    }
  };

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 bg-background flex items-center justify-center h-16 px-4 md:px-8 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary w-6 h-6" />
          <h1 className="text-2xl font-bold text-primary">SaaS Restaurante</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary-container rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-tertiary-container rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,0,0,0.05)] p-6 md:p-8 border border-outline-variant/30">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors mb-6 group bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar para o login</span>
            </button>

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-on-surface mb-1 tracking-tight">
                Recuperar Senha
              </h1>
              <p className="text-base text-on-surface-variant">
                Insira o seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha em instantes.
              </p>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Link de recuperação enviado! Verifique seu e-mail.</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block" htmlFor="email">
                  E-mail cadastrado
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-[#F1F3F5] border-2 border-transparent rounded-lg focus:border-primary-container focus:ring-0 transition-all outline-none text-base"
                    id="email"
                    name="email"
                    placeholder="exemplo@restaurante.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              <button
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-lg text-sm font-medium uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar link de recuperação
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-on-surface-variant">
                Não recebeu o e-mail? 
                <button
                  onClick={() => {
                    setSuccess(false);
                    setError('');
                    setEmail('');
                  }}
                  className="text-primary font-bold hover:underline ml-1 bg-transparent border-none cursor-pointer"
                  disabled={loading}
                >
                  Tentar novamente
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center opacity-60">
            <div className="w-full h-32 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20">
              <div 
                className="bg-cover bg-center w-full h-full grayscale-[0.2]"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCQTz1q1aLo4KUFvTM-Cfp1-HYWFcKQJXa62PkNZe6bj0SBUbJCQoAv20WKbpmqKNYn-hStFvLuLletnnL8APP7Z_u4k3BcTCv0bWjRVMqP6ze1pLzsYfd4KD_0XrArTvl7nOHeHEbhmrr7RzXOXqWzqerBN8CO67A6SCfq0E8mx6nrWaIi7GI0-zGYOsU-E-C3GpWNeGuztyyOrte2TFcQG4_lg3mY2LTXH0wSFheB7LDje9ITaSQ')"
                }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Utensils className="text-primary w-6 h-6" />
            <span className="text-xs font-semibold text-primary">SaaS Restaurante</span>
          </div>
          <p className="text-xs font-semibold text-secondary">© 2024 SaaS Restaurante. All rights reserved.</p>
          <div className="flex gap-4">
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
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;