import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Plus, Info } from 'lucide-react';
import { MediaItem } from '../../types';
import { getImagePath } from '../../api/tmdbApi';

interface MediaCardProps {
  item: MediaItem;
  priority?: boolean;
  showRanking?: boolean;
  ranking?: number;
}

const MediaCard = ({ item, priority = false, showRanking = false, ranking }: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const title = item.title || item.name || 'Unknown';
  const date = item.release_date || item.first_air_date;
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const link = `/${mediaType}/${item.id}`;
  
  const posterPath = getImagePath(item.poster_path);
  const fallbackImage = 'https://via.placeholder.com/300x450/1C1C1E/ffffff?text=No+Image';

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={link} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl liquid-glass-card apple-hover">
          {/* Ranking Number */}
          {showRanking && ranking && (
            <div className="absolute top-0 left-0 z-20">
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-6xl leading-none px-4 py-2 rounded-br-2xl rounded-tl-2xl shadow-2xl">
                {ranking}
              </div>
            </div>
          )}

          <img 
            src={posterPath || fallbackImage} 
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-70'
          }`}>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Rating and Year */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center liquid-glass px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-white sf-pro-text">
                      {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  {date && (
                    <div className="liquid-glass px-2 py-1 rounded-lg">
                      <span className="text-xs text-white sf-pro-text">
                        {new Date(date).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Media Type Badge */}
                <div className="liquid-glass px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-white sf-pro-text">
                    {mediaType === 'movie' ? 'Movie' : 'TV'}
                  </span>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-sm font-semibold text-white line-clamp-2 sf-pro-text">
                {title}
              </h3>
              
              {/* Hover Content */}
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Description */}
                  <p className="text-xs text-white/80 line-clamp-2 sf-pro-text">
                    {item.overview || 'No description available.'}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      className="flex-1 btn-primary flex items-center justify-center py-2 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle play action
                      }}
                    >
                      <Play className="w-3 h-3 mr-1 fill-white" />
                      <span className="sf-pro-text font-medium">Play</span>
                    </button>
                    
                    <button 
                      className="liquid-glass rounded-lg p-2 apple-hover"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle add to watchlist
                      }}
                      title="Add to Watchlist"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                    
                    <button 
                      className="liquid-glass rounded-lg p-2 apple-hover"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle more info
                      }}
                      title="More Info"
                    >
                      <Info className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Play Button Overlay for Non-Hover State */}
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="liquid-glass-strong rounded-full p-4">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;