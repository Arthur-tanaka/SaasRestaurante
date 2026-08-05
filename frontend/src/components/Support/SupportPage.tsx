import * as React from 'react';
import { useState } from 'react';
import { 
  Utensils, 
  Search, 
  MessageCircle, 
  Smartphone, 
  Mail, 
  Bell,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { api } from '../../services/api';

interface SupportPageProps {
  onNavigate?: (page: 'login' | 'register' | 'support' | 'forgot-password') => void;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  open: boolean;
}

interface SupportFormData {
  subject: string;
  category: string;
  description: string;
}

const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 1,
      question: 'Como alterar meu cardápio?',
      answer: 'Para alterar seu cardápio, acesse a aba "Cardápio" no menu superior, selecione a categoria desejada e clique no ícone de edição (lápis) ao lado do item. Não esqueça de salvar as alterações para sincronizar com o PDV.',
      open: false
    },
    {
      id: 2,
      question: 'Problemas com impressora?',
      answer: 'Primeiro, verifique se os cabos estão conectados e se há papel. No SaaS Restaurante, vá em Configurações > Dispositivos e certifique-se de que a impressora está listada como "Online". Tente realizar uma impressão de teste pelo próprio painel.',
      open: false
    },
    {
      id: 3,
      question: 'Como cadastrar novos usuários?',
      answer: 'Acesse Configurações > Gestão de Equipe. Clique em "Novo Membro", preencha o e-mail e defina o nível de permissão (Admin, Garçom ou Cozinha). O colaborador receberá um convite por e-mail para ativar a conta.',
      open: false
    },
    {
      id: 4,
      question: 'Como gerar relatórios financeiros?',
      answer: 'Vá até o menu "Financeiro" e selecione "Relatórios". Escolha o período desejado e o tipo de relatório (Vendas, Produtos, Comissões). Clique em "Gerar" e você poderá exportar em PDF ou Excel.',
      open: false
    },
    {
      id: 5,
      question: 'Como configurar o delivery?',
      answer: 'Acesse "Configurações" > "Delivery" e ative a opção "Delivery Integrado". Configure as taxas de entrega, áreas de cobertura e integração com aplicativos parceiros. Teste com um pedido fictício antes de ativar.',
      open: false
    }
  ]);

  const [formData, setFormData] = useState<SupportFormData>({
    subject: '',
    category: '',
    description: ''
  });

  const toggleFaq = (id: number) => {
    setFaqs(prev => prev.map(faq => ({
      ...faq,
      open: faq.id === id ? !faq.open : false
    })));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.subject.trim()) {
      setError('Por favor, informe o assunto');
      return;
    }
    if (!formData.category) {
      setError('Por favor, selecione uma categoria');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Por favor, descreva o problema com pelo menos 10 caracteres');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/support/tickets', {
        subject: formData.subject,
        category: formData.category,
        description: formData.description,
      }, token || undefined);
      
      console.log('Ticket created:', response);
      setSuccess(true);
      setLoading(false);
      
      setFormData({
        subject: '',
        category: '',
        description: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err: any) {
      if (import.meta.env) {
        console.log('Modo desenvolvimento: Simulando envio de chamado');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);
        setFormData({
          subject: '',
          category: '',
          description: ''
        });
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(err.message || 'Erro ao enviar chamado. Tente novamente.');
        console.error('Support ticket failed:', err);
        setLoading(false);
      }
    }
  };

  const handleGoToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('login');
    }
  };

  const handleGoToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('register');
    }
  };

  const handleGoToForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate('forgot-password');
    }
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    // Se já está no suporte, não faz nada
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header com Menu Hamburguer */}
      <header className="sticky top-0 bg-background flex items-center justify-between h-16 px-4 md:px-8 z-50 border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary w-6 h-6" />
          <h1 className="text-2xl font-bold text-primary">Suporte</h1>
        </div>
        
        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={handleGoToLogin}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
          >
            Sair
          </button>
          <button
            onClick={handleGoToLogin}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
          >
            {/* Cardápio */}
          </button>
          <span className="text-primary font-bold text-sm">Suporte</span>
        </nav>

        <div className="flex items-center gap-4">
          <button className="transition-transform active:scale-95 hover:opacity-80">
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button
            onClick={handleGoToLogin}
            className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-xs hover:opacity-80 transition-opacity"
          >
            JD
          </button>
          
          {/* Botão Hamburguer - Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4 border-b border-outline-variant">
          <nav className="flex flex-col gap-4">
            <button
              onClick={handleGoToLogin}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleGoToLogin}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Cardápio
            </button>
            <button
              onClick={handleGoToRegister}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors text-base font-medium"
            >
              Criar Conta
            </button>
            <button
              onClick={handleGoToForgotPassword}
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

      <main className="flex-grow pb-20">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 md:px-8 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-fixed/30 to-transparent"></div>
          <div className="max-w-3xl w-full text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-on-background">
              Central de Ajuda
            </h2>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
              Como podemos ajudar o seu restaurante hoje? Pesquise por artigos ou entre em contato.
            </p>
            <div className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-surface-container-lowest raised-card focus:ring-2 focus:ring-primary transition-all text-base"
                placeholder="Pesquisar artigos, erros ou guias..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group p-6 bg-surface-container-lowest rounded-xl raised-card border border-outline-variant/30 hover:border-primary transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-primary-fixed/50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <MessageCircle className="w-6 h-6 text-primary group-hover:text-on-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Chat ao Vivo</h3>
              <p className="text-base text-on-surface-variant">Fale com nossos especialistas em tempo real agora mesmo.</p>
              <button className="inline-flex items-center mt-4 text-primary font-bold group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer">
                Iniciar chat <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="group p-6 bg-surface-container-lowest rounded-xl raised-card border border-outline-variant/30 hover:border-primary transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-4 group-hover:bg-tertiary transition-colors">
                <Smartphone className="w-6 h-6 text-tertiary group-hover:text-on-tertiary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-base text-on-surface-variant">Suporte rápido na palma da sua mão pelo aplicativo de mensagens.</p>
              <button className="inline-flex items-center mt-4 text-tertiary font-bold group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer">
                Enviar mensagem <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="group p-6 bg-surface-container-lowest rounded-xl raised-card border border-outline-variant/30 hover:border-primary transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-secondary-fixed rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                <Mail className="w-6 h-6 text-secondary group-hover:text-on-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">E-mail</h3>
              <p className="text-base text-on-surface-variant">Envie seus detalhes e documentos para nossa fila prioritária.</p>
              <button className="inline-flex items-center mt-4 text-secondary font-bold group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer">
                Enviar e-mail <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* FAQ Accordion */}
            <section className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-on-background mb-2">Perguntas Frequentes</h2>
                <p className="text-base text-on-surface-variant">Respostas rápidas para os problemas mais comuns.</p>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <Search className="w-12 h-12 mx-auto text-outline mb-4" />
                  <p className="text-lg">Nenhum resultado encontrado para "{searchTerm}"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
                      <button
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <span className="text-sm font-medium text-on-surface">{faq.question}</span>
                        {faq.open ? (
                          <ChevronUp className="w-5 h-5 text-on-surface-variant transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-on-surface-variant transition-transform duration-300" />
                        )}
                      </button>
                      {faq.open && (
                        <div className="p-4 pt-0 text-on-surface-variant text-base border-t border-outline-variant/10">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Support Form */}
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl raised-card border border-outline-variant/20">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-on-background mb-2">Abrir um Chamado</h2>
                <p className="text-base text-on-surface-variant">Nossa equipe responderá em até 4 horas úteis.</p>
              </div>

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Chamado enviado com sucesso! Nossa equipe entrará em contato em breve.</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-error-container border border-error text-error rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant block">
                    Assunto *
                  </label>
                  <input
                    className="w-full bg-[#F1F3F5] border-transparent rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-base"
                    placeholder="Ex: Erro ao fechar caixa"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant block">
                    Categoria *
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#F1F3F5] border-transparent rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-base appearance-none"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      disabled={loading}
                      required
                    >
                      <option disabled value="">Selecione uma categoria</option>
                      <option value="financeiro">Financeiro / Pagamentos</option>
                      <option value="tecnico">Problema Técnico / Bug</option>
                      <option value="cardapio">Cardápio Digital</option>
                      <option value="sugestao">Sugestão de Melhoria</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant block">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    className="w-full bg-[#F1F3F5] border-transparent rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-base resize-none"
                    placeholder="Descreva o que está acontecendo. Se possível, cite os passos para reproduzir o problema."
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-on-surface-variant">
                    {formData.description.length}/500 caracteres
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    type="submit"
                    disabled={loading}
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
                        Enviar Chamado
                      </>
                    )}
                  </button>
                  <button
                    className="text-on-surface-variant text-sm font-medium hover:underline decoration-2 underline-offset-4 px-4 bg-transparent border-none cursor-pointer"
                    type="button"
                    onClick={() => {
                      setFormData({ subject: '', category: '', description: '' });
                      setError('');
                      setSuccess(false);
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>

        {/* Banner Section */}
        <section className="mt-12 px-4 md:px-8">
          <div className="relative w-full h-[300px] rounded-3xl overflow-hidden group">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASGFj4zqMhTG1DRYsY90AFg5JCffBG7KA8kLem8OUghUPCycYcNb1ZgB14YiGugry1WtIUdBvMBKT8cQbCqqCOYwoEH2tEz94FRB7ePTdB1ojqXYRFeFyVvvIw9Vxzfk5JQTtSL___SQvksNOZ5Y5LIqMpKwENQ1ESUeurSVFx_Vu2Ubvw1qxSE70X79zw09d9bexmPbt8hNjMDf9bRcFwxgXCsiM4ebRtjB3hCMCtRShWSiFsOgom')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center p-6 md:p-12">
              <h3 className="text-white text-4xl md:text-5xl font-bold max-w-lg mb-4">
                Seu restaurante em boas mãos.
              </h3>
              <p className="text-white/90 text-lg max-w-md">
                Treinamentos semanais gratuitos para sua equipe de salão e cozinha.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Utensils className="text-primary w-6 h-6" />
            <span className="text-2xl font-semibold text-primary">SaaS Restaurante</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-on-surface-variant hover:text-primary hover:underline text-xs font-semibold transition-colors duration-200" href="#">
              Terms of Service
            </a>
            <a className="text-on-surface-variant hover:text-primary hover:underline text-xs font-semibold transition-colors duration-200" href="#">
              Privacy Policy
            </a>
            <span className="text-primary font-semibold text-xs">Contact Support</span>
          </div>
          <p className="text-secondary text-xs font-semibold text-center">
            © 2026 SaaS Restaurante. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SupportPage;