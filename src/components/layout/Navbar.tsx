import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import {
  Compass,
  Search,
  PlusCircle,
  FolderCheck,
  ShieldAlert,
  Bell,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronDown,
  User,
  Shield,
  Layers
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../../services/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openReportModal: (type: 'lost' | 'found') => void;
  onSelectNotificationItem?: (itemId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openReportModal,
  onSelectNotificationItem,
}) => {
  const {
    currentUser,
    switchUserRole,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    filterCampusLocation,
    setFilterCampusLocation,
    matches,
  } = useAppState();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeMatchesCount = matches.filter((m) => m.status === 'open').length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center text-slate-950 font-display font-extrabold text-xl shadow-glow-lime group-hover:scale-105 transition-transform">
                F
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-xl tracking-tight text-white">FYND</span>
                  <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    Campus PWA
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400/80 font-medium tracking-wide">
                  Find it. Verify it. Return it.
                </p>
              </div>
            </button>

            {/* Campus Location Filter Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-xs text-slate-200 hover:border-lime-400/40 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-lime-400" />
                <span className="max-w-[180px] truncate">
                  {filterCampusLocation === 'all'
                    ? 'All Campus Zones'
                    : CAMPUS_LOCATIONS.find((l) => l.id === filterCampusLocation)?.zone || 'Selected Zone'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLocationPicker && (
                <div className="absolute top-full left-0 mt-2 w-72 glass-panel rounded-xl shadow-2xl p-2 border border-emerald-500/30 z-50 animate-fade-in">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Select Campus Zone
                  </div>
                  <button
                    onClick={() => {
                      setFilterCampusLocation('all');
                      setShowLocationPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      filterCampusLocation === 'all'
                        ? 'bg-lime-400/20 text-lime-300 font-semibold'
                        : 'text-slate-300 hover:bg-emerald-900/50'
                    }`}
                  >
                    <span>All Campus Zones</span>
                    {filterCampusLocation === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
                  </button>
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setFilterCampusLocation(loc.id);
                        setShowLocationPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                        filterCampusLocation === loc.id
                          ? 'bg-lime-400/20 text-lime-300 font-semibold'
                          : 'text-slate-300 hover:bg-emerald-900/50'
                      }`}
                    >
                      <span className="truncate">{loc.name}</span>
                      {filterCampusLocation === loc.id && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'home'
                  ? 'bg-emerald-500/20 text-lime-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </button>

            <button
              onClick={() => setCurrentTab('search')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'search'
                  ? 'bg-emerald-500/20 text-lime-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Search className="w-4 h-4" />
              Search
            </button>

            <button
              onClick={() => setCurrentTab('cases')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'cases'
                  ? 'bg-emerald-500/20 text-lime-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <FolderCheck className="w-4 h-4" />
              My Cases
              {activeMatchesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-lime-400 text-slate-950">
                  {activeMatchesCount}
                </span>
              )}
            </button>

            {/* Moderator Console Portal Link */}
            <button
              onClick={() => {
                if (currentUser.role !== 'moderator') {
                  switchUserRole('moderator');
                }
                setCurrentTab('moderator');
              }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'moderator'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              Campus Desk
            </button>
          </nav>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Report Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => openReportModal('lost')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/80 hover:border-emerald-400 transition-all flex items-center gap-1.5"
              >
                <span>Report Lost</span>
              </button>
              <button
                onClick={() => openReportModal('found')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Found</span>
              </button>
            </div>

            {/* Notification Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-slate-300 hover:text-white hover:border-lime-400/50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-lime-400 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl p-4 border border-emerald-500/30 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-lime-400" />
                      <span className="font-display font-bold text-sm text-white">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-emerald-400 hover:text-lime-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-emerald-500/10 max-h-80 overflow-y-auto mt-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkTarget && onSelectNotificationItem) {
                              onSelectNotificationItem(n.linkTarget);
                              setShowNotifications(false);
                            }
                          }}
                          className={`py-3 px-2 rounded-xl text-left cursor-pointer transition-colors ${
                            n.read ? 'opacity-60 hover:opacity-100 hover:bg-emerald-900/30' : 'bg-emerald-500/10 hover:bg-emerald-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-lime-300">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-lime-400 mt-1" />}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-emerald-400/70 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Demo Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-500/20">
              <button
                onClick={() => switchUserRole(currentUser.role === 'student' ? 'moderator' : 'student')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  currentUser.role === 'moderator'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
                title="Click to toggle between Student and Moderator test accounts"
              >
                {currentUser.role === 'moderator' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <span>Officer Jenkins</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Alex Rivera</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
