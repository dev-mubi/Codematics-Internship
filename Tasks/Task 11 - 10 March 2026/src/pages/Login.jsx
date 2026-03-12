import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Cinematic Experiences",
      description: "Discover the best movies from around the world in stunning quality.",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Personal Watchlist",
      description: "Keep track of everything you want to watch in one beautiful place.",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Editorial Selection",
      description: "Hand-picked collections curated for the true cinephile.",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login successful');
      navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen flex bg-background overflow-hidden">
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
                <div className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4">Discovery awaits</div>
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

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/5 h-full flex items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md h-fit"
        >
          <div className="mb-10 block lg:hidden text-center">
            <h1 className="text-3xl font-display font-bold text-accent tracking-tighter">CINEVIA</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-2 text-primary">Welcome Back</h2>
            <p className="text-muted">Enter your credentials to access your library.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-primary/60">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`w-full bg-surface border ${errors.email ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all shadow-sm text-primary`}
                placeholder="name@example.com"
              />
              {errors.email && <span className="text-accent text-xs mt-1">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-primary/60">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className={`w-full bg-surface border ${errors.password ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all shadow-sm text-primary`}
                placeholder="••••••••"
              />
              {errors.password && <span className="text-accent text-xs mt-1">{errors.password.message}</span>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm font-bold uppercase tracking-widest mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-border w-full"></div>
              <span className="bg-background px-4 text-[10px] text-muted absolute uppercase tracking-widest font-bold whitespace-nowrap">OR CONTINUE WITH</span>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="theme"
              className="w-full flex items-center justify-center gap-3 normal-case tracking-normal py-3 shadow-none hover:shadow-md transition-shadow font-medium"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-primary">Google Account</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-muted">
            New to Cinevia?{' '}
            <Link to="/signup" className="text-accent font-bold hover:underline">Create an account</Link>
          </p>


        </motion.div>
      </div>
    </div>
  );
};

export default Login;
