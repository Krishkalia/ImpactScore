import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSubscription } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/subscriptions/verify-session?session_id=${sessionId}`);
        if (res.data?.status === 'active') {
          setSubscription(res.data);
        }
      } catch (err) {
        console.error('Failed to verify session', err);
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [searchParams, setSubscription]);

  if (verifying) {
    return <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">Verifying subscription...</div>;
  }

  return (
    <>
      <main className="flex-grow flex items-center justify-center px-margin py-5xl relative z-10">
<div className="max-w-4xl w-full flex flex-col items-center text-center">
<section className="mb-4xl flex flex-col items-center">
<div className="relative w-32 h-32 mb-xl">
<div className="absolute inset-0 bg-hero-blue-light rounded-full celebration-ping opacity-75"></div>
<div className="relative w-full h-full bg-primary-container rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
<svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
<path className="check-draw" d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
</div>
</div>
<h1 className="font-headline-lg text-headline-lg mb-lg text-on-background tracking-tight">
                    You're in! Welcome to the ImpactScore Community.
                </h1>
<p className="font-body-lg text-body-lg text-charcoal max-w-2xl mx-auto">
                    Your subscription is now active. You're officially part of a movement that turns golf performance into real-world change.
                </p>
</section>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full mb-3xl">
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-md border-l-4 border-impact-green-dark flex flex-col justify-between items-start text-left transition-all hover:translate-y-[-4px] hover:shadow-lg">
<div>
<div className="flex items-center gap-sm mb-md">
<span className="material-symbols-outlined text-impact-green-dark" style={{"fontVariationSettings":"'FILL' 1"}}>volunteer_activism</span>
<h3 className="font-title-md text-title-md text-on-surface">Choose Your Impact</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            Direct your momentum. Select the verified charity your performance will support this quarter.
                        </p>
</div>
<button onClick={() => navigate('/charities')} className="bg-primary hover:bg-hero-blue-dark text-on-primary px-xl py-md rounded-lg font-label-sm text-label-sm transition-all transform hover:scale-102 flex items-center gap-sm">
                        Select Charity
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-md border-l-4 border-primary-container flex flex-col justify-between items-start text-left transition-all hover:translate-y-[-4px] hover:shadow-lg">
<div>
<div className="flex items-center gap-sm mb-md">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>sports_score</span>
<h3 className="font-title-md text-title-md text-on-surface">Record Your First Score</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            Enter your latest handicap or round data to establish your baseline and qualify for the upcoming draw.
                        </p>
</div>
<button onClick={() => navigate('/dashboard')} className="bg-transparent border-2 border-primary text-primary hover:bg-hero-blue-light px-xl py-md rounded-lg font-label-sm text-label-sm transition-all transform hover:scale-102 flex items-center gap-sm">
                        Enter Score
                        <span className="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
</div>
<footer className="flex flex-col items-center space-y-md">
<div className="flex items-center gap-xs text-subtle-gray">
<span className="material-symbols-outlined text-body-sm">mail</span>
<p className="font-body-sm text-body-sm italic">A confirmation email has been sent to your inbox.</p>
</div>
<button onClick={() => navigate('/dashboard')} className="text-primary font-title-md text-title-md hover:underline transition-all flex items-center gap-xs group">
                    Go to Dashboard
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
</button>
</footer>
</div>
</main>
    </>
  );
};
