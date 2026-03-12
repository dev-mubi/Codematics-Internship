import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMovieDetails, getMovieVideos } from '../services/tmdb';
import { TMDB_IMAGE_BASE, BACKDROP_SIZE, POSTER_SIZE } from '../constants/tmdb';
import { supabase } from '../services/supabase';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const MovieDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: () => getMovieDetails(id),
  });

  const { data: videos } = useQuery({
    queryKey: ['movies', 'videos', id],
    queryFn: () => getMovieVideos(id),
  });

  const { data: watchlist } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isInWatchlist = watchlist?.some(item => item.movie_id === parseInt(id));

  const toggleWatchlist = useMutation({
    mutationFn: async () => {
      if (!user) return toast.error('Please login to add to watchlist');
      
      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', id);
        if (error) throw error;
        toast.success('Removed from watchlist');
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: id,
            movie_title: movie.title,
            poster_path: movie.poster_path,
          });
        if (error) throw error;
        toast.success('Added to watchlist');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist', user?.id]);
    },
  });

  const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img 
          src={`${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${movie?.backdrop_path}`}
          alt={movie?.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 cinematic-overlay"></div>
        
        <div className="absolute inset-0 flex items-end pb-12 px-8 md:px-24">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full max-w-7xl mx-auto">
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={`${TMDB_IMAGE_BASE}/${POSTER_SIZE}${movie?.poster_path}`}
              alt={movie?.title}
              className="w-48 md:w-64 rounded-xl shadow-2xl border border-white/10 hidden md:block"
            />
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">
                {movie?.title}
              </h1>
              {movie?.tagline && <p className="text-accent italic mb-4 text-lg">{movie?.tagline}</p>}
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 mb-8 font-medium uppercase tracking-widest">
                <span>{movie?.release_date?.split('-')[0]}</span>
                <span>{movie?.runtime} min</span>
                <div className="flex gap-2">
                  {movie?.genres?.slice(0, 3).map(g => (
                    <span key={g.id} className="border border-white/20 px-2 py-0.5 rounded text-[10px]">{g.name}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {trailer && (
                  <Button 
                    onClick={() => setIsTrailerOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play Trailer
                  </Button>
                )}
                <Button 
                  onClick={() => toggleWatchlist.mutate()}
                  variant={isInWatchlist ? 'white' : 'secondary'}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-7xl mx-auto px-8 md:px-24 py-16 grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="md:col-span-2">
          <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-4">Overview</h2>
          <p className="text-lg text-primary/80 leading-relaxed font-light">
            {movie?.overview}
          </p>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted font-bold mb-4">Rating</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={226}
                    strokeDashoffset={226 - (226 * (movie?.vote_average || 0)) / 10}
                    className="text-accent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl">
                  {movie?.vote_average?.toFixed(1)}
                </div>
              </div>
              <div className="text-sm text-muted">
                <div className="font-bold text-primary">{movie?.vote_count}</div>
                votes from TMDB
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted font-bold mb-2">Language</h3>
            <span className="text-primary font-bold uppercase">{movie?.original_language}</span>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <Modal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)}
        transparent={true}
      >
        <div className="flex flex-col">
          <div className="w-full aspect-video">
            <ReactPlayer 
              url={`https://www.youtube.com/watch?v=${trailer?.key}`}
              width="100%"
              height="100%"
              playing={isTrailerOpen}
              controls={true}
            />
          </div>
          <p className="flex-shrink-0 text-[10px] text-muted text-left md:text-center mt-4 md:mt-6 pb-8 md:pb-6 px-6 md:px-8 leading-relaxed opacity-60">
            Trailer content is sourced from YouTube and is governed by YouTube's Terms of Service. 
            Cinevia does not host, own, or control this content. Viewer discretion is advised.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default MovieDetail;
