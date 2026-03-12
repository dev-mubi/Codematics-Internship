import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { toggleTheme } from '../store/slices/themeSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || '');
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile updated');
      setIsEditing(false);
      fetchProfile();
    }
    setLoading(false);
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">Account Settings</h1>
          <p className="text-muted">Manage your identity and preferences.</p>
        </header>

        <div className="space-y-8">
          {/* Identity Card */}
          <section className="glass-card p-8 border border-border/50">
            <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-8">Identity</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-muted uppercase tracking-widest mb-2 font-semibold">Display Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-surface border border-border rounded-xl p-4 outline-none focus:border-accent text-primary w-full transition-all"
                      placeholder="Enter name..."
                    />
                  ) : (
                    <p className="text-xl font-bold tracking-tight">{profile?.display_name || 'Anonymous User'}</p>
                  )}
                </div>
                <Button 
                  onClick={() => isEditing ? updateProfile() : setIsEditing(true)}
                  disabled={loading}
                  variant={isEditing ? 'primary' : 'secondary'}
                  className="w-full md:w-auto px-8"
                >
                  {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              <div className="pt-4 border-t border-border/10">
                <label className="block text-xs text-muted uppercase tracking-widest mb-1 font-semibold">Registered Email</label>
                <p className="text-primary font-medium">{user?.email}</p>
                <p className="text-[10px] text-accent mt-2 uppercase tracking-wider font-bold opacity-80">Connected via Secure Auth Provider</p>
              </div>
            </div>
          </section>

          {/* Preferences Card */}
          <section className="glass-card p-8 border border-border/50">
            <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-8">Personalization</h2>
            
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold">Visual Theme</h3>
                <p className="text-sm text-muted">Toggle between cinematic dark and professional light modes.</p>
              </div>
              <button 
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-1 bg-surface border border-border p-1.5 rounded-xl transition-all hover:border-accent/50 group"
              >
                <div className={`p-2.5 rounded-lg transition-all ${mode === 'dark' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-muted hover:text-primary'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div className={`p-2.5 rounded-lg transition-all ${mode === 'light' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-muted hover:text-primary'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M15.657 15.657l-.707.707" />
                  </svg>
                </div>
              </button>
            </div>
          </section>

          {/* Security Card */}
          <section className="glass-card p-8 border border-border/50">
            <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-8">Security</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Credential Management</h3>
              <p className="text-sm text-muted leading-relaxed">
                To maintain the highest level of platform integrity while our automated mail delivery systems are in transition, credential modifications are restricted to secure, audited administrative channels. 
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
