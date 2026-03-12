import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard, { MovieSkeleton } from './MovieCard';

const MovieGrid = ({ movies, isLoading, isFetchingNextPage }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <AnimatePresence mode="popLayout">
        {movies?.map((movie, index) => (
          <motion.div
            key={movie.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {(isLoading || isFetchingNextPage) && 
        Array(10).fill(0).map((_, i) => <MovieSkeleton key={i} />)
      }
    </div>
  );
};

export default MovieGrid;
