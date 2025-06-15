import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Clock } from 'lucide-react';
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

  // Format time (minutes to HH:MM format)
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-background-card rounded-lg p-4 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h3 className="text-xl font-bold mb-2 md:mb-0">Episodes</h3>
        
        {/* Season Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center justify-between bg-background-hover hover:bg-background-card border border-gray-700 rounded-md px-4 py-2 min-w-[160px] transition-colors"
          >
            <span>Season {selectedSeason}</span>
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isSeasonDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-full bg-background-card border border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
              >
                <ul>
                  {seasons.map(season => (
                    <li key={season.id}>
                      <button
                        onClick={() => handleSeasonSelect(season.season_number)}
                        className={`w-full text-left px-4 py-2 hover:bg-background-hover transition-colors ${
                          selectedSeason === season.season_number ? 'bg-primary/20 text-primary' : ''
                        }`}
                      >
                        Season {season.season_number}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Episodes List */}
      <div className="space-y-4">
        {currentSeason?.episodes ? (
          currentSeason.episodes.map(episode => (
            <EpisodeItem
              key={episode.id}
              episode={episode}
              isSelected={selectedEpisode === episode.episode_number}
              onSelect={handleEpisodeSelect}
            />
          ))
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <p>No episodes found for this season.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface EpisodeItemProps {
  episode: Episode;
  isSelected: boolean;
  onSelect: (episodeNumber: number) => void;
}

const EpisodeItem = ({ episode, isSelected, onSelect }: EpisodeItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex flex-col sm:flex-row gap-4 p-3 rounded-lg transition-colors ${
        isSelected ? 'bg-primary/20 border border-primary/30' : 'bg-background-hover hover:bg-background-card'
      }`}
    >
      {/* Episode Image */}
      <div className="relative sm:w-48 aspect-video rounded-md overflow-hidden flex-shrink-0">
        <img
          src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : 'https://via.placeholder.com/300x170/121212/ffffff?text=No+Image'}
          alt={episode.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-2 left-2 text-white">
            <span className="text-sm font-semibold">Ep {episode.episode_number}</span>
          </div>
        </div>
        
        {/* Play Button Overlay */}
        <button
          onClick={() => onSelect(episode.episode_number)}
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-primary/80 rounded-full p-3">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </button>
      </div>
      
      {/* Episode Info */}
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold">{episode.name}</h4>
          <div className="flex items-center text-text-secondary text-sm">
            <Clock className="w-3 h-3 mr-1" />
            <span>{episode.runtime ? `${episode.runtime}m` : 'N/A'}</span>
          </div>
        </div>
        
        <p className="text-text-secondary text-sm mt-2 line-clamp-2 sm:line-clamp-3">
          {episode.overview || 'No description available.'}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-text-muted">
            {episode.air_date ? new Date(episode.air_date).toLocaleDateString() : 'No air date'}
          </span>
          
          <button
            onClick={() => onSelect(episode.episode_number)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              isSelected 
                ? 'bg-primary text-white' 
                : 'bg-background-card hover:bg-primary/80 text-text-primary hover:text-white'
            }`}
          >
            {isSelected ? 'Currently Selected' : 'Watch Episode'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SeasonEpisodeSelector;