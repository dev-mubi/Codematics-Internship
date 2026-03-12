import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TMDB_IMAGE_BASE, POSTER_SIZE } from '../../constants/tmdb';
import Skeleton from '../ui/Skeleton';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE}/${POSTER_SIZE}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-accent/20 transition-all border border-border/50"
    >
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={imageUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <h3 className="font-display font-bold text-white text-sm line-clamp-2 mb-1">{movie.title}</h3>
          {movie.vote_average && (
            <div className="flex items-center gap-1">
              <span className="text-accent text-xs">★</span>
              <span className="text-white/80 text-[10px] font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>
      
      {movie.onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            movie.onRemove();
          }}
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-md p-2 rounded-full text-accent opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-white"
          title="Remove from watchlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export const MovieSkeleton = () => (
  <div className="aspect-[2/3] overflow-hidden">
    <Skeleton className="w-full h-full" />
  </div>
);

export default MovieCard;
