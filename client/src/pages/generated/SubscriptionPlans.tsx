import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

export const SubscriptionPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, subscription } = useAuth();
  const navigate = useNavigate();

  // If user is admin, redirect to admin dashboard
  if (user?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  // If user already has an active subscription, let them know or redirect
  if (subscription?.status === 'active') {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-surface-bright flex items-center justify-center p-xl">
        <div className="max-w-md w-full bg-white p-4xl rounded-2xl shadow-xl text-center border border-outline-variant/30">
          <div className="w-20 h-20 bg-impact-green-light rounded-full flex items-center justify-center mx-auto mb-xl">
            <span className="material-symbols-outlined text-impact-green-dark text-[40px]">check_circle</span>
          </div>
          <h2 className="font-display text-headline-sm text-on-surface mb-md">You're already active!</h2>
          <p className="text-body-md text-on-surface-variant mb-2xl">
            Your subscription is currently active. You have full access to premium features, score tracking, and charitable impact.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white font-title-md py-lg rounded-lg shadow-lg hover:bg-hero-blue-dark transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(planId);
    
    try {
      const res = await api.post('/subscriptions/checkout', { planId });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initialize checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background pt-4xl pb-5xl">
      <div className="container mx-auto px-xl">
        
        <div className="text-center max-w-2xl mx-auto mb-4xl">
          <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-win-gold/10 border border-win-gold/20 text-label-sm font-bold text-win-gold mb-xl">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            Premium Access
          </div>
          <h1 className="font-display text-display text-on-surface mb-lg">Unlock your full potential.</h1>
          <p className="text-body-lg text-on-surface-variant">
            Join thousands of others making a real-world impact through their performance. Choose the plan that works best for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-2xl relative">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Monthly Plan */}
          <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-4xl hover:shadow-xl hover:border-primary/30 transition-all duration-300">
            <h3 className="font-display text-headline-sm text-on-surface mb-xs">ImpactScore Subscription Pro</h3>
            <p className="text-subtle-gray text-body-sm mb-xl">Flexible, month-to-month commitment.</p>
            
            <div className="flex items-baseline gap-xs mb-2xl">
              <span className="font-display text-display text-on-surface">$10</span>
              <span className="text-body-md text-subtle-gray">/month</span>
            </div>

            <ul className="space-y-md mb-4xl">
              {[
                'Unlimited score entries',
                'Advanced performance analytics',
                'Entry into monthly prize draws',
                'Support verified global charities'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-impact-green-dark shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-body-md text-on-surface-variant">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe('monthly')}
              disabled={loading === 'monthly'}
              className="w-full py-lg px-4xl bg-surface-container-lowest border-2 border-primary text-primary font-title-md rounded-lg hover:bg-primary/5 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
            >
              {loading === 'monthly' ? <Loader size="sm" /> : 'Start Monthly Plan'}
            </button>
          </div>

          {/* Annual Plan (Highlighted) */}
          <div className="relative z-10 bg-dark-slate rounded-2xl shadow-2xl border border-win-gold/30 p-4xl transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-win-gold text-dark-slate font-bold text-label-sm px-lg py-xs rounded-full uppercase tracking-wider shadow-lg">
              Best Value
            </div>
            
            <h3 className="font-display text-headline-sm text-white mb-xs">ImpactScore Subscription Pro Plus</h3>
            <p className="text-white/60 text-body-sm mb-xl">Premium annual commitment for ultimate impact.</p>
            
            <div className="flex items-baseline gap-xs mb-2xl">
              <span className="font-display text-display text-white">$1,000</span>
              <span className="text-body-md text-white/60">/year</span>
            </div>

            <ul className="space-y-md mb-4xl">
              {[
                'Everything in Monthly, plus:',
                'Two bonus entries for prize draws',
                'Exclusive "Champion" profile badge',
                'Early access to new features'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-win-gold shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="text-body-md text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe('yearly')}
              disabled={loading === 'yearly'}
              className="w-full py-lg px-4xl bg-primary text-white font-title-md rounded-lg shadow-lg hover:bg-hero-blue-dark hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
            >
              {loading === 'yearly' ? <Loader size="sm" /> : 'Start Annual Plan'}
            </button>
          </div>
          
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-4xl pt-4xl border-t border-outline-variant/20 flex flex-wrap justify-center gap-4xl opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-xs font-bold text-on-surface-variant"><span className="material-symbols-outlined">lock</span> Secure Checkout</div>
            <div className="flex items-center gap-xs font-bold text-on-surface-variant"><span className="material-symbols-outlined">payments</span> Powered by Stripe</div>
            <div className="flex items-center gap-xs font-bold text-on-surface-variant"><span className="material-symbols-outlined">public</span> Global Impact</div>
        </div>
      </div>
    </div>
  );
};
