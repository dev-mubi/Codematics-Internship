import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieGrid from '../components/movie/MovieGrid';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';

const Watchlist = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('added_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (movieId) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist', user?.id]);
      toast.success('Removed from watchlist');
    },
  });

  const movies = watchlist?.map(item => ({
    id: item.movie_id,
    title: item.movie_title,
    poster_path: item.poster_path,
    onRemove: () => removeMutation.mutate(item.movie_id)
  })) || [];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">My Watchlist</h1>
          <p className="text-muted">Your curated collection of cinematic experiences.</p>
        </header>

        {movies.length > 0 ? (
          <MovieGrid movies={movies} isLoading={isLoading} />
        ) : !isLoading ? (
          <div className="text-center py-32 glass-card">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Your watchlist is empty</h2>
            <p className="text-muted mb-8 max-w-sm mx-auto">Explore the catalog and save movies you want to watch later.</p>
            <Link to="/catalog">
              <Button>Browse Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Watchlist;
