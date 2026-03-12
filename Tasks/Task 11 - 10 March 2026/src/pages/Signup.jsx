import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const password = watch("password", "");

  const slides = [
    {
      title: "Join the Community",
      description: "Create your profile and start building your ultimate movie collection.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Discover More",
      description: "Access deep insights, trailers, and personal recommendations.",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email for the verification code');
      navigate('/verify-otp', { state: { email: data.email } });
    }
    setLoading(false);
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
                <div className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4">Start your journey</div>
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

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-2/5 h-full flex items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md h-fit"
        >
          <div className="mb-6 block lg:hidden text-center">
            <h1 className="text-3xl font-display font-bold text-accent tracking-tighter">CINEVIA</h1>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold mb-2">Create Account</h2>
            <p className="text-muted text-sm">Join thousands of cinephiles today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-primary/60">Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className={`w-full bg-surface border ${errors.fullName ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all text-sm text-primary`}
                placeholder="John Doe"
              />
              {errors.fullName && <span className="text-accent text-[10px] mt-1 block">{errors.fullName.message}</span>}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-primary/60">Email Address</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                className={`w-full bg-surface border ${errors.email ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all text-sm text-primary`}
                placeholder="name@example.com"
              />
              {errors.email && <span className="text-accent text-[10px] mt-1 block">{errors.email.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-primary/60">Password</label>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' }
                  })}
                  className={`w-full bg-surface border ${errors.password ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all text-sm text-primary`}
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-accent text-[10px] mt-1 block">{errors.password.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-primary/60">Confirm</label>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Required',
                    validate: value => value === password || 'No match'
                  })}
                  className={`w-full bg-surface border ${errors.confirmPassword ? 'border-accent' : 'border-border'} rounded-xl p-4 outline-none focus:border-accent transition-all text-sm text-primary`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <span className="text-accent text-[10px] mt-1 block">{errors.confirmPassword.message}</span>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-bold hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
