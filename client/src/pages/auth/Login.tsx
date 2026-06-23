import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      toast.success('Welcome back!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex bg-background">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-xl sm:p-4xl relative z-10">
        <div className="max-w-md w-full space-y-2xl bg-surface-container-lowest p-2xl sm:p-4xl rounded-2xl shadow-xl border border-outline-variant/30 relative">
          {/* Decorative element */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h2 className="font-display text-headline-md text-on-surface mb-xs">Welcome Back</h2>
            <p className="text-body-md text-subtle-gray">Sign in to track your scores and see your impact.</p>
          </div>
          
          <form className="space-y-xl relative z-10" onSubmit={handleSubmit}>
            
            <div className="space-y-lg">
              <div className="space-y-xs">
                <label className="text-label-sm font-bold text-hero-blue-dark uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-subtle-gray">mail</span>
                  <input
                    type="email"
                    required
                    className="w-full pl-3xl pr-md py-md bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-xs">
                <label className="text-label-sm font-bold text-hero-blue-dark uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-subtle-gray">lock</span>
                  <input
                    type="password"
                    required
                    className="w-full pl-3xl pr-md py-md bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-sm py-lg px-4xl bg-primary text-white font-title-md rounded-lg shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Sign In <span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>arrow_forward</span>
              </button>
            </div>
          </form>

          <p className="text-center text-body-sm text-subtle-gray pt-md">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-hero-blue-dark transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-slate relative overflow-hidden items-center justify-center p-4xl">
        <div className="absolute inset-0 bg-hero-blue-dark/20 mix-blend-multiply z-10"></div>
        
        {/* Abstract animated background shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-win-gold/10 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-20 max-w-lg text-white">
          <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-label-sm font-bold mb-xl">
            <span className="material-symbols-outlined text-win-gold text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>stars</span>
            Premium Membership
          </div>
          <h2 className="font-display text-display leading-tight mb-lg">
            Turn your rounds into <span className="text-win-gold">real impact.</span>
          </h2>
          <p className="font-body-lg text-white/80 mb-2xl">
            Sign in to log your latest Stableford scores, track your performance analytics, and see the tangible difference your membership is making for global charities.
          </p>
          
          {/* Small testimonial/stat */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-lg rounded-xl mt-2xl">
            <div className="flex items-center gap-md mb-sm">
              <div className="w-10 h-10 rounded-full bg-impact-green-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{"fontVariationSettings":"'FILL' 1"}}>water_drop</span>
              </div>
              <div>
                <p className="font-bold text-body-md text-white">The Clean Water Initiative</p>
                <p className="text-label-sm text-white/60">Featured Charity</p>
              </div>
            </div>
            <p className="text-body-sm text-white/80 italic">"Our community has raised over $450k for global causes this year alone."</p>
          </div>
        </div>
      </div>
    </div>
  );
};
