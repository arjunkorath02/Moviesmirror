import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Heart, 
  Clock, 
  Star,
  Edit3,
  Save,
  X,
  Film,
  Tv
} from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  // Mock data for user stats and activity
  const userStats = {
    moviesWatched: 127,
    tvShowsWatched: 43,
    totalWatchTime: '2,340', // hours
    favoriteGenre: 'Action',
    joinDate: '2024-01-15'
  };

  const recentActivity = [
    {
      id: 1,
      type: 'movie',
      title: 'The Dark Knight',
      action: 'watched',
      date: '2 hours ago',
      poster: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    {
      id: 2,
      type: 'tv',
      title: 'Breaking Bad',
      action: 'added to watchlist',
      date: '1 day ago',
      poster: 'https://image.tmdb.org/t/p/w200/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg'
    },
    {
      id: 3,
      type: 'movie',
      title: 'Inception',
      action: 'rated 5 stars',
      date: '3 days ago',
      poster: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    }
  ];

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile via API
    console.log('Saving profile:', { name: editedName, email: editedEmail });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="container-custom py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="liquid-glass-card rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 liquid-glass-strong rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white/80" />
              </div>
              <div className="absolute -bottom-2 -right-2 liquid-glass rounded-full p-2">
                <Settings className="w-4 h-4 text-white/70" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1 sf-pro-text">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="liquid-glass rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sf-pro-text w-full md:w-80"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1 sf-pro-text">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="liquid-glass rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sf-pro-text w-full md:w-80"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex items-center px-4 py-2"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      <span className="sf-pro-text font-medium">Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="liquid-glass rounded-xl px-4 py-2 text-white/80 hover:text-white transition-colors apple-hover"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      <span className="sf-pro-text font-medium">Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white sf-pro-display">
                      {user?.name || 'User'}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="liquid-glass rounded-xl p-2 text-white/70 hover:text-white transition-colors apple-hover"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center text-white/70 mb-4">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="sf-pro-text">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="sf-pro-text text-sm">
                      Member since {new Date(userStats.joinDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <button className="liquid-glass rounded-xl px-4 py-2 text-white/80 hover:text-white transition-colors apple-hover flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span className="sf-pro-text font-medium">Watchlist</span>
              </button>
              <button 
                onClick={logout}
                className="liquid-glass rounded-xl px-4 py-2 text-red-400 hover:text-red-300 transition-colors apple-hover flex items-center"
              >
                <span className="sf-pro-text font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="liquid-glass-card rounded-2xl p-6 text-center"
          >
            <Film className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white sf-pro-display mb-1">
              {userStats.moviesWatched}
            </div>
            <div className="text-white/60 text-sm sf-pro-text">Movies Watched</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="liquid-glass-card rounded-2xl p-6 text-center"
          >
            <Tv className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white sf-pro-display mb-1">
              {userStats.tvShowsWatched}
            </div>
            <div className="text-white/60 text-sm sf-pro-text">TV Shows</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="liquid-glass-card rounded-2xl p-6 text-center"
          >
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white sf-pro-display mb-1">
              {userStats.totalWatchTime}h
            </div>
            <div className="text-white/60 text-sm sf-pro-text">Watch Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="liquid-glass-card rounded-2xl p-6 text-center"
          >
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-lg font-bold text-white sf-pro-display mb-1">
              {userStats.favoriteGenre}
            </div>
            <div className="text-white/60 text-sm sf-pro-text">Favorite Genre</div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="liquid-glass-card rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white sf-pro-display mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 liquid-glass rounded-2xl p-4 apple-hover"
              >
                <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={activity.poster}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    {activity.type === 'movie' ? (
                      <Film className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Tv className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-white font-semibold sf-pro-text">
                      {activity.title}
                    </span>
                  </div>
                  <p className="text-white/70 sf-pro-text text-sm mb-1">
                    You {activity.action}
                  </p>
                  <p className="text-white/50 sf-pro-text text-xs">
                    {activity.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 sf-pro-text">No recent activity</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;