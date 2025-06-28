import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Calendar
} from 'lucide-react';
import { MediaItem } from '../../types';
import { getImagePath } from '../../api/tmdbApi';
import { Link } from 'react-router-dom';

interface HeroCarouselProps {
  items: MediaItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const HeroCarousel = ({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const currentItem = items[currentIndex];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, items.length, autoPlayInterval]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items.length) return null;

  const title = currentItem.title || currentItem.name || 'Unknown';
  const backdropPath = getImagePath(currentItem.backdrop_path, 'original');
  const releaseDate = currentItem.release_date || currentItem.first_air_date;
  const mediaType = currentItem.media_type || (currentItem.title ? 'movie' : 'tv');

  return (
    <div 
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Parallax Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {backdropPath ? (
            <img
              src={backdropPath}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          )}
          
          {/* Multiple Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {isHovered && items.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 liquid-glass-strong rounded-full p-4 apple-hover"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 liquid-glass-strong rounded-full p-4 apple-hover"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="container-custom relative h-full flex items-center z-10">
        <motion.div 
          className="max-w-3xl"
          key={`content-${currentIndex}`}
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
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-semibold text-white sf-pro-text">
              {mediaType === 'movie' ? 'Latest Movie' : 'Latest Series'}
            </span>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 sf-pro-display text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {title}
          </motion.h1>
          
          {/* Meta Information */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Rating */}
            <div className="flex items-center liquid-glass px-3 py-2 rounded-xl">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
              <span className="text-white font-semibold sf-pro-text">
                {currentItem.vote_average?.toFixed(1)}
              </span>
            </div>
            
            {/* Release Year */}
            {releaseDate && (
              <div className="flex items-center liquid-glass px-3 py-2 rounded-xl">
                <Calendar className="w-4 h-4 mr-2 text-white/70" />
                <span className="text-white sf-pro-text">
                  {new Date(releaseDate).getFullYear()}
                </span>
              </div>
            )}
            
            {/* Media Type */}
            <div className="liquid-glass px-3 py-2 rounded-xl">
              <span className="text-white font-semibold sf-pro-text">
                {mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>

            {/* Maturity Rating */}
            <div className="bg-white/20 border border-white/30 px-2 py-1 rounded text-xs font-bold text-white">
              {mediaType === 'movie' ? 'PG-13' : 'TV-MA'}
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-white/90 text-lg mb-8 line-clamp-3 sf-pro-text leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {currentItem.overview}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link
              to={`/${mediaType}/${currentItem.id}`}
              className="btn-primary flex items-center text-lg px-8 py-4 apple-hover"
            >
              <Play className="w-6 h-6 mr-3 fill-white" />
              <span className="sf-pro-text font-semibold">Play</span>
            </Link>
            
            <Link
              to={`/${mediaType}/${currentItem.id}`}
              className="liquid-glass-strong flex items-center text-lg px-8 py-4 rounded-2xl apple-hover"
            >
              <Info className="w-6 h-6 mr-3" />
              <span className="sf-pro-text font-semibold text-white">More Info</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
            >
              <div className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'w-12 bg-white' 
                  : 'w-8 bg-white/40 group-hover:bg-white/60'
              }`} />
              
              {/* Auto-play progress bar */}
              {index === currentIndex && isPlaying && !isHovered && (
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    duration: autoPlayInterval / 1000, 
                    ease: 'linear',
                    repeat: 0
                  }}
                  key={`progress-${currentIndex}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Age Rating Badge */}
      <div className="absolute top-24 right-8 z-20">
        <div className="liquid-glass-strong rounded-lg px-3 py-2">
          <span className="text-white text-sm font-bold sf-pro-text">
            {mediaType === 'movie' ? '13+' : '16+'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;