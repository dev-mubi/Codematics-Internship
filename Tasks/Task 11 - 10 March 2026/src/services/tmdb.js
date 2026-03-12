import axios from 'axios';
import { TMDB_BASE_URL } from '../constants/tmdb';

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const getTrendingMovies = async () => {
  const response = await tmdbClient.get('/trending/movie/week');
  return response.data;
};

export const getNowPlayingMovies = async () => {
  const response = await tmdbClient.get('/movie/now_playing');
  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await tmdbClient.get('/movie/top_rated');
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await tmdbClient.get(`/movie/${id}`);
  return response.data;
};

export const getMovieVideos = async (id) => {
  const response = await tmdbClient.get(`/movie/${id}/videos`);
  return response.data;
};

export const getGenres = async () => {
  const response = await tmdbClient.get('/genre/movie/list');
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbClient.get('/search/movie', {
    params: { query, page }
  });
  return response.data;
};

export const discoverMovies = async (params) => {
  const response = await tmdbClient.get('/discover/movie', { params });
  return response.data;
};
