import React from 'react';
import { Link } from 'react-router-dom';

export const ImpactscoreHomepage = () => {
  return (
    <>
      <div className="homepage-wrapper">
{/*  Hero Section  */}
<section className="relative bg-light-mist py-5xl overflow-hidden min-h-[819px] flex items-center">
<div className="absolute inset-0 z-0">
<div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
<div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{"animationDelay":"2s"}}></div>
<div className="absolute top-1/2 left-1/3 w-48 h-48 bg-win-gold/5 rounded-full blur-2xl animate-float" style={{"animationDelay":"4s"}}></div>
{/*  Abstract Geometric Shapes  */}
<svg className="absolute top-0 right-0 opacity-[0.03] w-1/2 h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
<polygon className="text-primary" fill="currentColor" points="100,0 100,100 0,100"></polygon>
</svg>
</div>
<div className="container mx-auto px-xl relative z-10 grid lg:grid-cols-2 gap-3xl items-center">
<div>
<h1 className="font-display text-display text-on-surface mb-lg leading-tight md:text-headline-lg">
  Drive Change. Track Progress. <span className="text-primary">Win Big.</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-2xl max-w-xl">
  A modern membership blending performance tracking with global charitable impact. Record your Stableford scores, fund the causes you love, and compete in monthly draws for premium rewards.
</p>
<div className="flex flex-wrap gap-lg">
<Link to="/register" className="bg-primary text-white font-title-md text-body-md px-4xl py-lg rounded-lg hover:bg-hero-blue-dark hover:scale-[1.02] transition-all duration-200 shadow-md inline-block">
    Get Started Free
</Link>
<Link to="/charities" className="border-2 border-primary text-primary font-title-md text-body-md px-4xl py-lg rounded-lg hover:bg-hero-blue-light transition-all duration-200 inline-block bg-white/50 backdrop-blur-sm">
    View Charities
</Link>
</div>
</div>
<div className="hidden lg:block relative">
  <div className="relative z-10 grid grid-cols-2 gap-md h-[500px]">
    <div className="flex flex-col gap-md h-full">
      <div className="flex-grow bg-white p-xs rounded-xl shadow-lg border border-outline-variant/30 transform -rotate-2 hover:rotate-0 transition-transform duration-300 hover:z-20">
        <img className="w-full h-full object-cover rounded-lg" src="/charity_impact_1.png" alt="Volunteers planting trees" />
      </div>
      <div className="h-[40%] bg-white p-xs rounded-xl shadow-lg border border-outline-variant/30 transform rotate-1 hover:rotate-0 transition-transform duration-300 hover:z-20">
        <img className="w-full h-full object-cover rounded-lg" src="/charity_impact_3.png" alt="Medical volunteers helping children" />
      </div>
    </div>
    <div className="h-full bg-white p-xs rounded-xl shadow-xl border border-outline-variant/30 transform translate-y-8 rotate-2 hover:rotate-0 transition-transform duration-300 hover:z-20">
      <img className="w-full h-full object-cover rounded-lg" src="/charity_impact_2.png" alt="Community education center" />
    </div>
  </div>
  <div className="absolute -bottom-xl right-0 z-30 bg-win-gold-light p-lg rounded-xl shadow-xl border border-win-gold/30 max-w-[240px] transform translate-y-16 translate-x-8">
    <div className="flex items-center gap-md mb-sm">
      <span className="material-symbols-outlined text-momentum-orange-dark" style={{"fontVariationSettings":"'FILL' 1"}}>workspace_premium</span>
      <span className="font-bold text-on-surface text-body-sm">Last Month's Winner</span>
    </div>
    <p className="text-body-sm text-on-surface-variant">Player #8492 just won a set of premium performance gear.</p>
  </div>
</div>
</div>
</section>
{/*  Social Proof Stats  */}
<section className="py-3xl container mx-auto px-xl">
<div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
<div className="text-center p-xl bg-white rounded-xl shadow-sm border-b-4 border-primary">
<div className="font-display text-headline-md text-primary">12k+</div>
<div className="font-body-sm text-subtle-gray uppercase tracking-widest">Active Players</div>
</div>
<div className="text-center p-xl bg-white rounded-xl shadow-sm border-b-4 border-impact-green-dark">
<div className="font-display text-headline-md text-impact-green-dark">$450k+</div>
<div className="font-body-sm text-subtle-gray uppercase tracking-widest">Funds Donated</div>
</div>
<div className="text-center p-xl bg-white rounded-xl shadow-sm border-b-4 border-momentum-orange-dark">
<div className="font-display text-headline-md text-momentum-orange-dark">24</div>
<div className="font-body-sm text-subtle-gray uppercase tracking-widest">Global Charities</div>
</div>
<div className="text-center p-xl bg-white rounded-xl shadow-sm border-b-4 border-win-gold">
<div className="font-display text-headline-md text-win-gold">850+</div>
<div className="font-body-sm text-subtle-gray uppercase tracking-widest">Prizes Awarded</div>
</div>
</div>
</section>
{/*  Value Propositions (3-Column Grid)  */}
<section className="py-5xl bg-surface-bright">
<div className="container mx-auto px-xl">
<div className="text-center mb-4xl">
<h2 className="font-headline-md text-headline-md text-on-surface mb-md">Redefining the Game</h2>
<p className="text-on-surface-variant max-w-2xl mx-auto">Focus on your performance while we handle the social impact. Our platform bridges the gap between your passion and purpose.</p>
</div>
<div className="grid md:grid-cols-3 gap-2xl">
{/*  Prop 1  */}
<div className="bento-card bg-white p-2xl rounded-xl shadow-sm border border-outline-variant/20">
<div className="w-16 h-16 bg-hero-blue-light flex items-center justify-center rounded-xl mb-xl">
<span className="material-symbols-outlined text-primary text-[32px]">bar_chart</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-md">Track Performance</h3>
<p className="text-on-surface-variant font-body-md">Advanced analytics for your rounds. Gain insights into your consistency and growth with our pro-level dashboard.</p>
</div>
{/*  Prop 2  */}
<div className="bento-card bg-white p-2xl rounded-xl shadow-sm border border-outline-variant/20 border-t-4 border-t-win-gold">
<div className="w-16 h-16 bg-win-gold-light flex items-center justify-center rounded-xl mb-xl">
<span className="material-symbols-outlined text-momentum-orange-dark text-[32px]">emoji_events</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-md">Win Monthly Prizes</h3>
<p className="text-on-surface-variant font-body-md">Your scores enter you into monthly draws. Compete for gear, experiences, and tech rewards from global partners.</p>
</div>
{/*  Prop 3  */}
<div className="bento-card bg-white p-2xl rounded-xl shadow-sm border border-outline-variant/20 border-l-4 border-l-impact-green-dark">
<div className="w-16 h-16 bg-impact-green-light flex items-center justify-center rounded-xl mb-xl">
<span className="material-symbols-outlined text-impact-green-dark text-[32px]">favorite</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-md">Support Charities</h3>
<p className="text-on-surface-variant font-body-md">A portion of every participation fee goes directly to world-class nonprofit organizations of your choice.</p>
</div>
</div>
</div>
</section>
{/*  Featured Charity Spotlight  */}
<section className="py-5xl bg-impact-green-light/30">
<div className="container mx-auto px-xl">
<div className="flex flex-col lg:flex-row items-center gap-4xl">
<div className="lg:w-1/2">
<div className="inline-block px-lg py-xs bg-impact-green-dark text-white rounded-full font-label-sm mb-lg">FEATURED CHARITY</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xl">The Clean Water Initiative</h2>
<p className="text-on-surface-variant font-body-lg mb-2xl">
                            Providing sustainable, clean drinking water to remote communities. By playing with ImpactScore this month, you help fund the construction of solar-powered water filtration systems.
                        </p>
<div className="flex items-center gap-2xl mb-2xl">
<div>
<div className="text-headline-sm font-bold text-impact-green-dark">$25,430</div>
<div className="text-body-sm text-on-surface-variant uppercase tracking-wider">Raised this month</div>
</div>
<div className="h-12 w-[1px] bg-outline-variant"></div>
<div>
<div className="text-headline-sm font-bold text-on-surface">1,240</div>
<div className="text-body-sm text-on-surface-variant uppercase tracking-wider">Lives Impacted</div>
</div>
</div>
<Link to="/charities" className="inline-block bg-impact-green-dark text-white px-2xl py-lg rounded-lg font-title-md hover:bg-secondary transition-all">Learn More About the Mission</Link>
</div>
<div className="lg:w-1/2">
<div className="relative">
<img className="rounded-2xl shadow-xl w-full aspect-video object-cover" data-alt="A cinematic, high-quality photograph of a vibrant community water pump project in a bright, sunlit rural environment. The focus is on clean water splashing into a container, symbolizing life and health. The image is crisp, modern, and high-impact, avoiding stereotypical charity tropes in favor of professional empowerment-focused storytelling." src="/charity_placeholder.png"/>
<div className="absolute top-md right-md bg-white/90 backdrop-blur-md p-md rounded-lg shadow-lg">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-impact-green-dark">verified</span>
<span className="font-bold text-on-surface text-body-sm">Verified Impact</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Bottom CTA Footer  */}
<section className="bg-dark-slate py-5xl text-center relative overflow-hidden">
{/*  Subtle overlay effect  */}
<div className="absolute inset-0 bg-primary opacity-10 mix-blend-overlay"></div>
<div className="container mx-auto px-xl relative z-10">
<h2 className="font-headline-md text-headline-md text-white mb-lg">Ready to make an impact?</h2>
<p className="text-subtle-gray font-body-lg mb-3xl max-w-xl mx-auto">Join thousands of golfers who are already winning big while giving back. No hidden fees, just pure impact.</p>
<div className="flex flex-col sm:flex-row gap-lg justify-center items-center">
<Link to="/register" className="bg-primary text-white font-title-md text-body-md px-5xl py-xl rounded-lg hover:bg-hero-blue-dark hover:scale-105 transition-all duration-300 shadow-xl inline-block">
                        Create Your Free Account
                    </Link>
<Link to="/register" className="text-white hover:text-primary transition-colors font-body-md flex items-center gap-sm">
                        How it works <span className="material-symbols-outlined">arrow_forward</span>
</Link>
</div>
</div>
</section>
</div>
    </>
  );
};
