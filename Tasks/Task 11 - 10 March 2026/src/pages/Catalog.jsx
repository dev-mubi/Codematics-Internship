import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { discoverMovies, getGenres, searchMovies } from '../services/tmdb';
import MovieGrid from '../components/movie/MovieGrid';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const { ref, inView } = useInView();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['movies', 'catalog', debouncedQuery, selectedGenre, sortBy],
    queryFn: ({ pageParam = 1 }) => {
      if (debouncedQuery) {
        return searchMovies(debouncedQuery, pageParam);
      }
      return discoverMovies({
        with_genres: selectedGenre,
        sort_by: sortBy,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const movies = data?.pages.flatMap(page => page.results) || [];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-8">Browse Movies</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <input 
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl p-4 pl-12 focus:border-accent outline-none transition-all shadow-lg"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-surface border border-border rounded-lg px-4 py-2 outline-none focus:border-accent appearance-none text-sm font-medium pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B6B80\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">All Genres</option>
                {genres?.genres?.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface border border-border rounded-lg px-4 py-2 outline-none focus:border-accent appearance-none text-sm font-medium pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/xml\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B6B80\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Top Rated</option>
                <option value="primary_release_date.desc">Latest</option>
              </select>
            </div>
          </div>
        </header>

        {/* Movie Grid */}
        <MovieGrid movies={movies} isLoading={isLoading} isFetchingNextPage={isFetchingNextPage} />

        {/* Infinite Scroll Trigger */}
        <div ref={ref} className="h-20 flex items-center justify-center mt-12">
          {isFetchingNextPage && (
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {movies.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <h3 className="text-xl text-muted">No movies found. Try adjusting your filters.</h3>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
