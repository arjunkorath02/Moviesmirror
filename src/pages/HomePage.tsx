import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Play, Info, TrendingUp, Film, Tv, Star } from 'lucide-react';
import MediaGrid from '../components/Shared/MediaGrid';
import LoadingScreen from '../components/Shared/LoadingScreen';
import { getTrending, getLatestMovies, getLatestTVShows, getPopularMovies, getTopRatedMovies, getTopRatedTVShows } from '../api/tmdbApi';
import { MediaItem } from '../types';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
  
  // Fetch trending media
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery(
    'trending', 
    () => getTrending('all', 'week')
  );
  
  // Fetch top rated movies
  const { data: topRatedMoviesData, isLoading: isTopRatedMoviesLoading } = useQuery(
    'topRatedMovies', 
    () => getTopRatedMovies()
  );
  
  // Fetch top rated TV shows
  const { data: topRatedTVShowsData, isLoading: isTopRatedTVShowsLoading } = useQuery(
    'topRatedTVShows', 
    () => getTopRatedTVShows()
  );
  
  // Fetch latest movies
  const { data: latestMoviesData, isLoading: isLatestMoviesLoading } = useQuery(
    'latestMovies', 
    () => getLatestMovies()
  );
  
  // Fetch latest TV shows
  const { data: latestTVShowsData, isLoading: isLatestTVShowsLoading } = useQuery(
    'latestTVShows', 
    () => getLatestTVShows()
  );
  
  // Set a random trending item as the hero
  useEffect(() => {
    if (trendingData && trendingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.length));
      setHeroItem(trendingData[randomIndex]);
    }
  }, [trendingData]);
  
  // Show loading screen if all data is loading
  if (isTrendingLoading && isLatestMoviesLoading && isLatestTVShowsLoading) {
    return <LoadingScreen />;
  }
  
  // Hero backdrop path
  const heroBackdropPath = heroItem?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${heroItem.backdrop_path}` 
    : null;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroItem && (
        <motion.div 
          className="relative h-screen mb-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Hero Background */}
          <div className="absolute inset-0">
            {heroBackdropPath ? (
              <div className="relative w-full h-full">
                <motion.img
                  src={heroBackdropPath}
                  alt={heroItem.title || heroItem.name}
                  className="w-full h-full object-cover object-center"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                />
                <div className="absolute inset-0 hero-gradient"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
            )}
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl float-animation" style={{ animationDelay: '2s' }}></div>
          
          {/* Hero Content */}
          <div className="container-custom relative h-full flex items-center">
            <motion.div 
              className="max-w-3xl z-10"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Category Badge */}
              <motion.div 
                className="inline-flex items-center liquid-glass px-4 py-2 rounded-full mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-semibold text-white sf-pro-text">Trending Now</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-black mb-6 sf-pro-display text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {heroItem.title || heroItem.name}
              </motion.h1>
              
              {/* Rating and Year */}
              <motion.div 
                className="flex items-center space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center liquid-glass px-3 py-2 rounded-xl">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                  <span className="text-white font-semibold sf-pro-text">{heroItem.vote_average?.toFixed(1)}</span>
                </div>
                <div className="liquid-glass px-3 py-2 rounded-xl">
                  <span className="text-white font-semibold sf-pro-text">
                    {new Date(heroItem.release_date || heroItem.first_air_date || '').getFullYear()}
                  </span>
                </div>
                <div className="liquid-glass px-3 py-2 rounded-xl">
                  <span className="text-white font-semibold sf-pro-text">
                    {heroItem.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-white/90 text-lg mb-8 line-clamp-3 sf-pro-text leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                {heroItem.overview}
              </motion.p>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Link
                  to={`/${heroItem.media_type}/${heroItem.id}`}
                  className="btn-primary flex items-center text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-3 fill-white" />
                  <span className="sf-pro-text font-semibold">Watch Now</span>
                </Link>
                <Link
                  to={`/${heroItem.media_type}/${heroItem.id}`}
                  className="btn-secondary flex items-center text-lg px-8 py-4"
                >
                  <Info className="w-5 h-5 mr-3" />
                  <span className="sf-pro-text font-semibold">More Info</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      <div className="container-custom">
        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MediaGrid 
            title="🔥 Trending This Week" 
            items={trendingData || []} 
            isLoading={isTrendingLoading} 
          />
        </motion.div>
        
        {/* Top 10 Movies */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <MediaGrid 
            title="🎬 Top 10 Movies" 
            items={(topRatedMoviesData?.results || []).slice(0, 10).map(item => ({ ...item, media_type: 'movie' }))} 
            isLoading={isTopRatedMoviesLoading}
            showRanking={true}
          />
        </motion.div>
        
        {/* Top 10 TV Shows */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <MediaGrid 
            title="📺 Top 10 TV Shows" 
            items={(topRatedTVShowsData?.results || []).slice(0, 10).map(item => ({ ...item, media_type: 'tv' }))} 
            isLoading={isTopRatedTVShowsLoading}
            showRanking={true}
          />
        </motion.div>
        
        {/* Latest Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <MediaGrid 
            title="🆕 Latest Movies" 
            items={(latestMoviesData?.results || []).map(item => ({ ...item, media_type: 'movie' }))} 
            isLoading={isLatestMoviesLoading} 
          />
        </motion.div>
        
        {/* Latest TV Shows Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <MediaGrid 
            title="📺 Latest TV Shows" 
            items={(latestTVShowsData?.results || []).map(item => ({ ...item, media_type: 'tv' }))} 
            isLoading={isLatestTVShowsLoading} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;