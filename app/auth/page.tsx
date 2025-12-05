'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Créer un cookie pour le middleware
        document.cookie = `auth-session=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 jours
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        
        if (error) throw error;
        setMessage('Un email de réinitialisation a été envoyé !');
      } else if (mode === 'register') {
        const { data: codeData, error: codeError } = await supabase
          .from('invitation_codes')
          .select('*')
          .eq('code', invitationCode.toUpperCase().trim())
          .single();

        if (codeError || !codeData) {
          throw new Error('Code d\'invitation invalide');
        }

        if (codeData.is_used) {
          throw new Error('Ce code d\'invitation a déjà été utilisé');
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        await supabase
          .from('invitation_codes')
          .update({ 
            is_used: true, 
            email_used: email,
            used_at: new Date().toISOString()
          })
          .eq('code', invitationCode.toUpperCase().trim());

        setMessage('Compte créé ! Vérifiez votre email pour confirmer.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Créer un cookie pour le middleware
        if (data.session) {
          document.cookie = `auth-session=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 jours
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Composant Logo S5 Monogramme Luxe avec S calligraphique
  const LogoS5Luxe = () => (
    <div className="w-28 h-28 mx-auto mb-4 relative">
      <div 
        className="absolute -inset-2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)',
          filter: 'blur(8px)'
        }}
      ></div>
      
      <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]"
        style={{
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.5), inset 0 0 10px rgba(212, 175, 55, 0.2)'
        }}
      ></div>
      
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#722F37] via-[#8B3A42] to-[#5a252c] shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)'
          }}
        ></div>
      </div>
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6A3"/>
            <stop offset="50%" stopColor="#D4AF37"/>
            <stop offset="100%" stopColor="#AA8C2C"/>
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        <g stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M50 10 L50 5"/>
          <path d="M44 8 Q50 3 56 8"/>
          <circle cx="50" cy="3" r="1.5" fill="url(#goldGradient)"/>
        </g>
        
        <g stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M50 90 L50 95"/>
          <path d="M44 92 Q50 97 56 92"/>
          <circle cx="50" cy="97" r="1.5" fill="url(#goldGradient)"/>
        </g>
        
        <g stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M10 50 L5 50"/>
          <path d="M8 44 Q3 50 8 56"/>
          <circle cx="3" cy="50" r="1.5" fill="url(#goldGradient)"/>
        </g>
        
        <g stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M90 50 L95 50"/>
          <path d="M92 44 Q97 50 92 56"/>
          <circle cx="97" cy="50" r="1.5" fill="url(#goldGradient)"/>
        </g>
        
        <g filter="url(#glow)">
          <path d="M20 20 L24 16 L28 20 L24 24 Z" fill="url(#goldGradient)"/>
          <path d="M72 20 L76 16 L80 20 L76 24 Z" fill="url(#goldGradient)"/>
          <path d="M20 80 L24 76 L28 80 L24 84 Z" fill="url(#goldGradient)"/>
          <path d="M72 80 L76 76 L80 80 L76 84 Z" fill="url(#goldGradient)"/>
        </g>
        
        <circle cx="50" cy="50" r="38" stroke="url(#goldGradient)" strokeWidth="0.5" fill="none" opacity="0.5"/>
        
        <g filter="url(#glow)">
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="url(#goldGradient)"
            fontSize="36"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="bold"
            filter="url(#shadow)"
            style={{ letterSpacing: '-2px' }}
          >
            S<tspan fontSize="28" fontStyle="italic" dy="2">5</tspan>
          </text>
        </g>
      </svg>
      
      <div 
        className="absolute inset-1 rounded-full overflow-hidden pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.1) 40%, rgba(212, 175, 55, 0.3) 50%, rgba(255, 255, 255, 0.1) 60%, transparent 70%)',
        }}
      ></div>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' 
        : 'bg-gradient-to-br from-[#F8E8E0] to-[#E8D4C4]'
    }`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogoS5Luxe />
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#722F37]'}`}>
            The Budget Planner
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-[#722F37]/70'}`}>
            Gérez votre budget intelligemment
          </p>
        </div>

        <div className={`rounded-2xl p-6 shadow-xl border transition-colors ${
          isDark 
            ? 'bg-[#1e1e2f] border-[#D4AF37]/20' 
            : 'bg-white/80 backdrop-blur-sm border-[#722F37]/20'
        }`}>
          {mode !== 'forgot' && (
            <div className={`flex mb-6 rounded-xl p-1 ${
              isDark ? 'bg-[#2a2a3e]' : 'bg-[#F8E8E0]'
            }`}>
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-[#722F37] text-white'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-[#722F37]/60 hover:text-[#722F37]'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-[#722F37] text-white'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-[#722F37]/60 hover:text-[#722F37]'
                }`}
              >
                Inscription
              </button>
            </div>
          )}

          {mode !== 'forgot' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 font-medium rounded-xl transition-all disabled:opacity-50 mb-4 ${
                  isDark 
                    ? 'bg-white hover:bg-gray-100 text-gray-800' 
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-[#722F37]/20'}`}></div>
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-[#722F37]/50'}`}>ou</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-[#722F37]/20'}`}></div>
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-600 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'forgot' && (
              <div className="text-center mb-4">
                <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#722F37]'}`}>
                  Mot de passe oublié ?
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#722F37]/70'}`}>
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              </div>
            )}

            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-[#722F37]/80'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-[#2a2a3e] border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:border-[#D4AF37]' 
                    : 'bg-[#F8E8E0] border border-[#722F37]/20 text-[#722F37] placeholder-[#722F37]/40 focus:border-[#722F37]'
                }`}
                placeholder="votre@email.com"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-[#722F37]/80'}`}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#2a2a3e] border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:border-[#D4AF37]' 
                      : 'bg-[#F8E8E0] border border-[#722F37]/20 text-[#722F37] placeholder-[#722F37]/40 focus:border-[#722F37]'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-[#722F37]/80'}`}>
                  Code d&apos;invitation
                </label>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-colors uppercase ${
                    isDark 
                      ? 'bg-[#2a2a3e] border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:border-[#D4AF37]' 
                      : 'bg-[#F8E8E0] border border-[#722F37]/20 text-[#722F37] placeholder-[#722F37]/40 focus:border-[#722F37]'
                  }`}
                  placeholder="XXXX-XXXX-XXXX"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#722F37] to-[#8B3A42] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
            >
              {isLoading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : 'Envoyer le lien'}
            </button>
          </form>

          {mode === 'login' && (
            <button
              onClick={() => setMode('forgot')}
              className="w-full mt-4 text-center text-[#D4AF37] text-sm hover:underline"
            >
              Mot de passe oublié ?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="w-full mt-4 text-center text-[#D4AF37] text-sm hover:underline"
            >
              ← Retour à la connexion
            </button>
          )}
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-500' : 'text-[#722F37]/50'}`}>
          Créé avec ❤️ par Shina5
        </p>
      </div>
    </div>
  );
}
