import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import MediaGrid from '../components/Shared/MediaGrid';
import HeroCarousel from '../components/Shared/HeroCarousel';
import LoadingScreen from '../components/Shared/LoadingScreen';
import { getTrending, getLatestMovies, getLatestTVShows, getPopularMovies, getTopRatedMovies, getTopRatedTVShows, getLatestIndianMovies } from '../api/tmdbApi';
import { MediaItem } from '../types';

const HomePage = () => {
  // Fetch trending media for hero carousel
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

  // Fetch latest Indian movies
  const { data: latestIndianMoviesData, isLoading: isLatestIndianMoviesLoading } = useQuery(
    'latestIndianMovies', 
    () => getLatestIndianMovies()
  );
  
  // Show loading screen if hero data is loading
  if (isTrendingLoading) {
    return <LoadingScreen />;
  }
  
  // Get top 5 trending items for hero carousel
  const heroItems = trendingData?.slice(0, 5) || [];
  
  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      {heroItems.length > 0 && (
        <HeroCarousel 
          items={heroItems}
          autoPlay={true}
          autoPlayInterval={6000}
        />
      )}
      
      <div className="container-custom py-16">
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

        {/* Latest Indian Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <MediaGrid 
            title="🇮🇳 Latest Indian Movies" 
            items={(latestIndianMoviesData?.results || []).map(item => ({ ...item, media_type: 'movie' }))} 
            isLoading={isLatestIndianMoviesLoading}
            emptyMessage="No Indian movies found at the moment."
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