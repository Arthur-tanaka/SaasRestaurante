import * as React from 'react';
import { useState } from 'react';
import { 
  Utensils, 
  CheckCircle, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  Store,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Menu,
  X
} from 'lucide-react';
import { api } from '../../services/api';

interface RegisterPageProps {
  onNavigate?: (page: 'login' | 'register' | 'support' | 'forgot-password') => void;
}

interface RegisterFormData {
  fullName: string;
  restaurantName: string;
  email: string;
  phone: string;
  restaurantType: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    restaurantName: '',
    email: '',
    phone: '',
    restaurantType: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4,5})/, "($1) $2");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})/, "($1) ");
    }
    
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Por favor, informe seu nome completo');
      return false;
    }

    if (!formData.restaurantName.trim()) {
      setError('Por favor, informe o nome do restaurante');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, informe um email válido');
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Por favor, informe um telefone válido (com DDD)');
      return false;
    }

    if (!formData.restaurantType) {
      setError('Por favor, selecione o tipo de estabelecimento');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return false;
    }

    if (!formData.terms) {
      setError('Você precisa aceitar os termos de serviço!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        full_name: formData.fullName,
        restaurant_name: formData.restaurantName,
        email: formData.email,
        phone: formData.phone,
        restaurant_type: formData.restaurantType,
        password: formData.password,
      });
      
      console.log('Register successful:', response);
      setSuccess(true);
      setLoading(false);
      
      setFormData({
        fullName: '',
        restaurantName: '',
        email: '',
        phone: '',
        restaurantType: '',
        password: '',
        confirmPassword: '',
        terms: false,
      });

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('login');
        } else {
          window.location.href = '/login';
        }
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.');
      console.error('Register failed:', err);
      setLoading(false);
    }
  };

  const handleGoToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('login');
    } else {
      window.location.href = '/login';
    }
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('support');
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('forgot-password');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header com Menu Hamburguer */}
      <header className="sticky top-0 bg-background flex items-center justify-between h-16 px-4 md:px-8 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary w-6 h-6" />
          <h1 className="text-2xl font-bold text-primary">SaaS Restaurante</h1>
        </div>
        
        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={handleGoToLogin}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={handleSupportClick}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
          >
            Suporte
          </button>
        </nav>

        {/* Botão Hamburguer - Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4 border-b border-outline-variant">
          <nav className="flex flex-col gap-4">
            <button
              onClick={handleGoToLogin}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Login
            </button>
            <button
              onClick={handleSupportClick}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Suporte
            </button>
            <button
              onClick={handleForgotPasswordClick}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Esqueceu a Senha?
            </button>
            <hr className="border-outline-variant" />
            <div className="px-4 py-2 text-sm text-on-surface-variant">
              <p>© 2026 SaaS Restaurante</p>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-4xl grid md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow border border-outline-variant">
          <div className="hidden md:flex flex-col justify-between p-8 bg-primary-container text-on-primary-container relative overflow-hidden min-h-[500px]">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Simplifique sua gestão culinária.
              </h2>
              <p className="text-lg opacity-90">
                Junte-se a milhares de restaurantes que otimizaram seus processos com nossa plataforma intuitiva e eficiente.
              </p>
            </div>
            
            <div className="mt-12 relative z-10">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Controle de Estoque Real</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Gestão de Mesas e Reservas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Dashboards Financeiros</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-20">
              <img 
                className="w-64 h-64 object-contain" 
                alt="Kitchen utensils and digital tablet"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvHTxE9hSF2-BYc6BpgdZ8NE3OmTjC4DGo6E8BMFo2cmOn2piByITk85Jid1Oipu0pUp56wGf3JqRpXNnHS6qQ0RbEuiJaxXbje8GT3ZbnZl-rk1YNbfG0fotpsi73oJfLN-1lzvWYRxqXwkXHdDHlkl3gg37zHnaoOE1j8-9Fo3VhKDy5JNpOonq0Nx80hUqrmf2sze4w809ubCgWO4_EgIAcTXAR3410hpDoVA9piZYoMt-U7rg_"
              />
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-1">
                Criar sua conta
              </h2>
              <p className="text-base text-on-surface-variant">
                Comece sua jornada digital hoje mesmo.
              </p>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Cadastro realizado com sucesso! Redirecionando para o login...</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="fullName">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="fullName"
                      name="fullName"
                      placeholder="Ex: João Silva"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="restaurantName">
                    Nome do Restaurante *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="restaurantName"
                      name="restaurantName"
                      placeholder="Ex: Cantina do Chef"
                      type="text"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">
                    Email Profissional *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="email"
                      name="email"
                      placeholder="contato@restaurante.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="phone">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="phone"
                      name="phone"
                      placeholder="(11) 99999-9999"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="restaurantType">
                  Tipo de Estabelecimento *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base appearance-none cursor-pointer"
                    id="restaurantType"
                    name="restaurantType"
                    value={formData.restaurantType}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  >
                    <option disabled value="">Selecione uma categoria</option>
                    <option value="pizzaria">Pizzaria</option>
                    <option value="burger">Burger / Fast Food</option>
                    <option value="cafe">Café / Padaria</option>
                    <option value="japanese">Comida Japonesa</option>
                    <option value="italian">Italiano / Massas</option>
                    <option value="bar">Bar / Pub</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || success}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && formData.password.length < 6 && (
                    <p className="text-xs text-error">Mínimo 6 caracteres</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="confirmPassword">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-transparent rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all text-base"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading || success}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading || success}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-error">As senhas não coincidem</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 py-1">
                <input
                  className="w-5 h-5 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  disabled={loading || success}
                />
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="terms">
                  Aceito os <a className="text-primary hover:underline" href="#">termos de serviço</a> e política de privacidade.
                </label>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  className="w-full bg-primary-container text-on-primary-container text-sm font-medium py-3.5 rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading || success}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cadastrando...
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Cadastro realizado!
                    </div>
                  ) : (
                    'Cadastrar Restaurante'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm font-medium text-on-surface-variant">
                    Já tenho uma conta?
                    <button
                      onClick={handleGoToLogin}
                      className="text-primary font-bold hover:underline ml-1 bg-transparent border-none cursor-pointer"
                      type="button"
                    >
                      Fazer Login
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant px-4 md:px-8 mt-6">
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
            <button
              onClick={handleSupportClick}
              className="text-xs font-semibold text-primary hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Contact Support
            </button>
          </div>
          <p className="text-xs font-semibold text-secondary opacity-70">
            © 2026 SaaS Restaurante. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;