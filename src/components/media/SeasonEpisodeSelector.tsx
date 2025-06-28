import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Clock, Calendar, Star } from 'lucide-react';
import { Season, Episode } from '../../types';

interface SeasonEpisodeSelectorProps {
  seasons: Season[];
  initialSeason?: number;
  initialEpisode?: number;
  onSelect: (seasonNumber: number, episodeNumber: number) => void;
}

const SeasonEpisodeSelector = ({ 
  seasons, 
  initialSeason = 1, 
  initialEpisode = 1, 
  onSelect 
}: SeasonEpisodeSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  // Find the selected season when it changes
  useEffect(() => {
    const season = seasons.find(s => s.season_number === selectedSeason) || null;
    setCurrentSeason(season);
  }, [selectedSeason, seasons]);

  // Handle initial values
  useEffect(() => {
    if (initialSeason) {
      setSelectedSeason(initialSeason);
    }
    if (initialEpisode) {
      setSelectedEpisode(initialEpisode);
    }
  }, [initialSeason, initialEpisode]);

  // Handle season selection
  const handleSeasonSelect = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1); // Reset to first episode when changing season
    setIsSeasonDropdownOpen(false);
    onSelect(seasonNumber, 1);
  };

  // Handle episode selection
  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    onSelect(selectedSeason, episodeNumber);
  };

  return (
    <motion.div 
      className="liquid-glass-card rounded-3xl p-8 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <motion.h3 
          className="text-3xl font-bold mb-4 md:mb-0 sf-pro-display text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Episodes
        </motion.h3>
        
        {/* Season Selector */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center justify-between liquid-glass rounded-2xl px-6 py-3 min-w-[180px] apple-hover text-white font-semibold sf-pro-text"
          >
            <span>Season {selectedSeason}</span>
            <ChevronDown className={`w-5 h-5 ml-3 transition-transform duration-300 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isSeasonDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute right-0 mt-2 w-full liquid-glass-strong rounded-2xl shadow-2xl z-20 max-h-60 overflow-y-auto"
              >
                <div className="p-2">
                  {seasons.map(season => (
                    <motion.button
                      key={season.id}
                      onClick={() => handleSeasonSelect(season.season_number)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 sf-pro-text font-medium ${
                        selectedSeason === season.season_number 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Season {season.season_number}
                      {season.episode_count && (
                        <span className="text-xs text-white/50 ml-2">
                          ({season.episode_count} episodes)
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Episodes Grid */}
      <div className="space-y-4">
        {currentSeason?.episodes ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-4"
          >
            {currentSeason.episodes.map((episode, index) => (
              <EpisodeItem
                key={episode.id}
                episode={episode}
                isSelected={selectedEpisode === episode.episode_number}
                onSelect={handleEpisodeSelect}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="liquid-glass rounded-3xl p-8">
              <p className="text-white/60 sf-pro-text text-lg">No episodes found for this season.</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface EpisodeItemProps {
  episode: Episode;
  isSelected: boolean;
  onSelect: (episodeNumber: number) => void;
  index: number;
}

const EpisodeItem = ({ episode, isSelected, onSelect, index }: EpisodeItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        isSelected 
          ? 'liquid-glass-strong border border-blue-500/30 shadow-2xl' 
          : 'liquid-glass apple-hover'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Episode Thumbnail */}
        <div className="relative lg:w-80 aspect-video rounded-xl overflow-hidden flex-shrink-0 group">
          <img
            src={episode.still_path 
              ? `https://image.tmdb.org/t/p/w500${episode.still_path}` 
              : 'https://via.placeholder.com/500x280/1C1C1E/ffffff?text=No+Image'
            }
            alt={episode.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            {/* Episode Number Badge */}
            <div className="absolute top-3 left-3">
              <div className="liquid-glass-strong rounded-xl px-3 py-1.5">
                <span className="text-white font-bold sf-pro-text text-sm">
                  Episode {episode.episode_number}
                </span>
              </div>
            </div>
            
            {/* Runtime Badge */}
            {episode.runtime && (
              <div className="absolute top-3 right-3">
                <div className="liquid-glass-strong rounded-xl px-3 py-1.5 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5 text-white/70" />
                  <span className="text-white/90 text-xs font-medium sf-pro-text">
                    {episode.runtime}m
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Play Button Overlay */}
          <AnimatePresence>
            {(isHovered || isSelected) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelect(episode.episode_number)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="liquid-glass-strong rounded-full p-4 apple-hover">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Episode Info */}
        <div className="flex-grow space-y-4">
          {/* Title and Air Date */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <h4 className="text-xl font-bold text-white sf-pro-display line-clamp-2">
              {episode.name}
            </h4>
            {episode.air_date && (
              <div className="flex items-center liquid-glass rounded-xl px-3 py-1.5 flex-shrink-0">
                <Calendar className="w-3 h-3 mr-1.5 text-white/70" />
                <span className="text-white/90 text-xs font-medium sf-pro-text">
                  {new Date(episode.air_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-white/80 sf-pro-text leading-relaxed line-clamp-3 lg:line-clamp-4">
            {episode.overview || 'No description available for this episode.'}
          </p>
          
          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3">
              {/* Episode Rating (if available) */}
              <div className="flex items-center liquid-glass rounded-xl px-3 py-1.5">
                <Star className="w-3 h-3 mr-1.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white/90 text-xs font-medium sf-pro-text">
                  {episode.vote_average ? episode.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
            
            <motion.button
              onClick={() => onSelect(episode.episode_number)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 sf-pro-text ${
                isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'liquid-glass text-white/90 hover:bg-blue-500/20 hover:text-blue-400 apple-hover'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected ? 'Currently Selected' : 'Watch Episode'}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400"
          style={{ transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  );
};

export default SeasonEpisodeSelector;