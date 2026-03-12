import React, { useRef } from 'react';
import MovieCard, { MovieSkeleton } from './MovieCard';

const MovieRow = ({ title, movies, isLoading }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 relative group/row">
      <h2 className="text-xl font-display font-bold mb-6 px-8 md:px-12 uppercase tracking-widest text-primary/80">
        {title}
      </h2>

      <div className="relative group/nav">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 bg-background/60 backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto hide-scrollbar px-8 md:px-12 pb-4 scroll-smooth"
        >
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="min-w-[150px] md:min-w-[200px]">
                <MovieSkeleton />
              </div>
            ))
          ) : (
            movies?.map((movie) => (
              <div key={movie.id} className="min-w-[150px] md:min-w-[200px]">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 bg-background/60 backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
