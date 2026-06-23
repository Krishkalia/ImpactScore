import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { PageLoader } from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

export const DrawResults = () => {
  const { user, subscription } = useAuth();
  const [draws, setDraws] = useState<any[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [scoresCount, setScoresCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drawsRes, scoresRes] = await Promise.all([
          api.get('/draws'),
          user ? api.get('/scores').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);
        setDraws(drawsRes.data || []);
        
        if (user && scoresRes.data) {
          const scores = scoresRes.data;
          setScoresCount(scores.length);
          if (scores.length >= 5) {
            const latest5 = scores.slice(0, 5).map((s: any) => s.value).sort((a: number, b: number) => a - b);
            setUserPattern(latest5);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="pt-32 flex justify-center"><PageLoader /></div>;

  const latestDraw = draws[0];

  return (
    <main className="max-w-7xl mx-auto px-xl py-3xl min-h-screen">
      {/*  Hero Section  */}
      <section className="mb-5xl text-center relative">
        <div className="absolute inset-0 -z-10 overflow-hidden"></div>
        <div className="inline-flex items-center gap-sm bg-win-gold-light text-momentum-orange-dark px-lg py-xs rounded-full mb-lg font-label-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          {latestDraw && latestDraw.drawMonth && !isNaN(new Date(latestDraw.drawMonth).getTime()) 
            ? `${format(new Date(latestDraw.drawMonth), 'MMMM yyyy')} Draw Official Results` 
            : 'Official Results'}
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-background mb-md">Generosity Rewarded</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">See how your impact scores translated into winnings this month.</p>
      </section>

      {latestDraw ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/*  Winning Numbers Block (Featured)  */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-3xl shadow-sm border-t-4 border-primary">
            <div className="flex justify-between items-start mb-2xl">
              <div>
                <h2 className="font-title-md text-title-md text-on-background">The Winning Sequence</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Selected via verifiable random impact-weighting</p>
              </div>
              <button className="flex items-center gap-sm text-primary font-label-sm uppercase hover:underline">
                <span className="material-symbols-outlined">receipt_long</span>
                Verify Hash
              </button>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-xl py-xl">
              {latestDraw.winningNumbers?.map((num: number, idx: number) => (
                <div key={idx} className="draw-ball w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-on-primary font-headline-sm text-headline-sm shadow-lg">
                  {num}
                </div>
              ))}
              {!latestDraw.winningNumbers?.length && (
                <div className="text-subtle-gray">Winning sequence pending...</div>
              )}
            </div>

            {/* User Pattern Block */}
            {user && subscription?.status === 'active' && (
              <div className="mt-2xl pt-2xl border-t border-outline-variant/30">
                <div className="flex justify-between items-start mb-xl">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-background">Your Active Pattern</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Your latest 5 scores used for matching.</p>
                  </div>
                  {userPattern.length === 5 ? (
                    <span className="inline-flex items-center gap-xs px-md py-xs bg-impact-green-light text-impact-green-dark rounded-full font-label-sm uppercase font-bold">
                      <span className="w-2 h-2 rounded-full bg-impact-green-dark"></span> Qualified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-xs px-md py-xs bg-momentum-orange-light text-momentum-orange-dark rounded-full font-label-sm uppercase font-bold">
                      Pending Scores
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-md">
                  {userPattern.length === 5 ? (
                    userPattern.map((num, idx) => {
                      const isMatch = latestDraw.winningNumbers?.includes(num);
                      return (
                        <div key={idx} className={`w-16 h-16 rounded-full flex items-center justify-center font-headline-sm text-headline-sm shadow-sm border-2 ${
                          isMatch ? 'bg-win-gold text-dark-slate border-win-gold-dark' : 'bg-surface-container text-subtle-gray border-outline-variant/50'
                        }`}>
                          {num}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-subtle-gray font-body-md bg-light-mist px-xl py-lg rounded-lg border border-outline-variant/30 w-full text-center">
                      You currently have <strong className="text-on-background">{scoresCount}</strong> score{scoresCount === 1 ? '' : 's'}. 
                      Submit <strong className="text-momentum-orange-dark">{5 - scoresCount}</strong> more to lock in your pattern for the draw!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/*  Personalized Success Card  */}
          <div className="md:col-span-4 bg-win-gold-light rounded-xl p-3xl border-t-4 border-win-gold shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10">
              <span className="material-symbols-outlined text-[160px]" style={{"fontVariationSettings":"'FILL' 1"}}>workspace_premium</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-on-surface mb-xs">Prize Pool Status</h2>
              <div className={`bg-win-gold-muted/20 inline-block px-sm py-xs rounded-lg font-label-sm text-momentum-orange-dark mb-xl`}>
                {latestDraw.status === 'published' ? 'OFFICIAL' : latestDraw.status.toUpperCase()}
              </div>
              <p className="font-headline-sm text-headline-sm text-on-background font-bold">${latestDraw.prizePoolTotal?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Total Prize Pool Distributed</p>
            </div>
          </div>

          {/*  Tier Breakdown (Glassmorphism List)  */}
          <div className="md:col-span-12 lg:col-span-7 bg-surface-container-high/40 rounded-xl p-3xl border-l-4 border-momentum-orange shadow-sm">
            <h3 className="font-title-md text-title-md text-on-background mb-xl">Prize Pool Breakdown</h3>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-lg bg-surface-container-lowest rounded-lg border border-outline-variant hover:scale-[1.01] transition-transform cursor-default">
                <div className="flex items-center gap-lg">
                  <div className="w-10 h-10 rounded-full bg-win-gold/10 flex items-center justify-center text-win-gold">
                    <span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-on-background">Jackpot Pool (50%)</p>
                    <p className="font-body-sm text-on-surface-variant">Highest Matches</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body-lg font-bold text-primary">${((latestDraw.prizePoolTotal || 0) * 0.5).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-lg bg-surface-container-lowest rounded-lg border border-outline-variant hover:scale-[1.01] transition-transform cursor-default">
                <div className="flex items-center gap-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">filter_4</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-on-background">Secondary Pool (30%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body-lg font-bold text-primary">${((latestDraw.prizePoolTotal || 0) * 0.3).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-lg bg-surface-container-lowest rounded-lg border border-outline-variant hover:scale-[1.01] transition-transform cursor-default">
                <div className="flex items-center gap-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">filter_3</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-on-background">Tertiary Pool (20%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body-lg font-bold text-primary">${((latestDraw.prizePoolTotal || 0) * 0.2).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5xl text-subtle-gray">
          No draws have been published yet.
        </div>
      )}
    </main>
  );
};
