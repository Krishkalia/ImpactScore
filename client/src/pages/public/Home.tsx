
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <section className="relative overflow-hidden bg-dark text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-8"
          >
            Make an Impact.<br/>
            <span className="text-secondary">Win Big.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-12"
          >
            Join the community driving change through golf. Track your scores, fund incredible charities, and enter our monthly draw.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="/register" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:bg-blue-600 transition-all shadow-lg shadow-primary/30">
              Subscribe Now
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Track Your Scores</h3>
              <p className="text-slate-600">Enter your Stableford scores. Your last 5 scores form your ticket for the monthly draw.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Fund Charities</h3>
              <p className="text-slate-600">A minimum of 10% of your subscription goes directly to the charity of your choice.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Win the Draw</h3>
              <p className="text-slate-600">Match 3, 4, or 5 numbers in our monthly draw to win from the massive prize pool.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
