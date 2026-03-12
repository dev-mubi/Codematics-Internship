import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const VerifyOTP = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const slides = [
    {
      title: "Secure Your Account",
      description: "Join our exclusive community of cinephiles and enthusiasts.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Confirm Your Email",
      description: "Just one more step to unlock a world of curated entertainment.",
      image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const onSubmit = async (data) => {
    if (!email) {
      toast.error('Session expired. Please sign up again.');
      return navigate('/signup');
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: data.token,
      type: 'signup',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Email verified successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) toast.error(error.message);
    else toast.success('New OTP sent to your email');
  };

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen flex bg-background overflow-hidden text-primary">
      {/* Left Side: Cinematic Brand Intro */}
      <div className="hidden lg:flex lg:w-3/5 h-screen relative overflow-hidden bg-surface">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Darker Overlays for Legibility */}
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
            
            <img 
              src={slides[currentSlide].image} 
              alt="Cinematic Background" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-xl"
              >
                <div className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4">Verification Required</div>
                <h1 className="text-6xl font-display font-bold text-white mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl text-white/70 font-light leading-relaxed">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </div>
            
            <div className="absolute bottom-12 left-24 z-20 flex gap-2">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-accent' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute top-12 left-12 z-30">
          <Link to="/" className="text-3xl font-display font-bold text-accent tracking-tighter">
            CINEVIA
          </Link>
        </div>
      </div>

      {/* Right Side: OTP Form */}
      <div className="w-full lg:w-2/5 h-full flex flex-col items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md h-fit"
        >
          <div className="mb-10 block lg:hidden text-center">
            <h1 className="text-3xl font-display font-bold text-accent tracking-tighter">CINEVIA</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold mb-2">Verify Email</h2>
            <p className="text-muted text-sm">
              Sent 8-digit code to <span className="text-primary font-bold">{email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-4 text-primary/60 text-center lg:text-left">Verification Code</label>
              <input
                type="text"
                maxLength="8"
                {...register('token', { 
                  required: 'OTP is required',
                  pattern: { value: /^\d{8}$/, message: 'Must be an 8-digit code' }
                })}
                className={`w-full bg-surface border ${errors.token ? 'border-accent' : 'border-border'} rounded-2xl p-6 text-center text-4xl font-display font-bold tracking-[0.3em] outline-none focus:border-accent transition-all shadow-sm text-primary`}
                placeholder="00000000"
              />
              {errors.token && <span className="text-accent text-xs mt-3 block text-center font-bold">{errors.token.message}</span>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 text-sm font-bold uppercase tracking-widest mt-4"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted mb-3">Didn't receive the code?</p>
            <button 
              onClick={handleResend}
              className="text-accent text-sm font-bold hover:underline uppercase tracking-widest py-2 px-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              Resend Code
            </button>
          </div>

          <div className="mt-10 text-center">
            <Link 
              to="/signup"
              className="text-muted text-xs hover:text-accent transition-colors flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
