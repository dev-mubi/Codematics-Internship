import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrendingMovies, getNowPlayingMovies, getTopRatedMovies } from '../services/tmdb';
import { TMDB_IMAGE_BASE, BACKDROP_SIZE } from '../constants/tmdb';
import MovieRow from '../components/movie/MovieRow';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useSelector } from 'react-redux';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: getTrendingMovies,
  });

  const { data: nowPlaying, isLoading: nowPlayingLoading } = useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: getNowPlayingMovies,
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: getTopRatedMovies,
  });

  const { data: watchlist } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const heroMovie = trending?.results?.[0];
  const isInWatchlist = watchlist?.some(item => item.movie_id === heroMovie?.id);

  const toggleWatchlist = useMutation({
    mutationFn: async () => {
      if (!user) return toast.error('Please login to add to watchlist');
      
      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', heroMovie.id);
        if (error) throw error;
        toast.success('Removed from watchlist');
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: heroMovie.id,
            movie_title: heroMovie.title,
            poster_path: heroMovie.poster_path,
          });
        if (error) throw error;
        toast.success('Added to watchlist');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist', user?.id]);
    },
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="h-[90vh] relative flex items-center overflow-hidden">
        {heroMovie && (
          <>
            <img 
              src={`${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 cinematic-overlay"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 px-8 md:px-24 max-w-4xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded">Trending Now</span>
                <span className="text-sm font-medium text-white/80">{heroMovie.release_date?.split('-')[0]}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-none">
                {heroMovie.title}
              </h1>
              <p className="text-lg text-white/70 mb-8 line-clamp-3 md:line-clamp-none max-w-2xl font-light leading-relaxed">
                {heroMovie.overview}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => window.location.href = `/movie/${heroMovie.id}`}
                  variant="white"
                >
                  Watch Now
                </Button>
                <Button 
                  onClick={() => toggleWatchlist.mutate()}
                  variant={isInWatchlist ? 'white' : 'secondary'}
                >
                  {isInWatchlist ? 'In Watchlist' : '+ Watchlist'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </section>

      {/* Content Rows */}
      <div className="relative z-20 -mt-10 md:-mt-20 pb-20 space-y-12">
        <div className="px-4">
        <br/><br/><br/><br/>
          <MovieRow title="Trending Movies" movies={trending?.results?.slice(1)} isLoading={trendingLoading} />
        </div>
        <div className="px-4">
          <MovieRow title="Now Playing" movies={nowPlaying?.results} isLoading={nowPlayingLoading} />
        </div>
        <div className="px-4">
          <MovieRow title="Top Rated Classics" movies={topRated?.results} isLoading={topRatedLoading} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
