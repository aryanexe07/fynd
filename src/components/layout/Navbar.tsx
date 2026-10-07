import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import {
  Bell,
  CheckCircle2,
  MapPin,
  ChevronDown,
  User,
  Shield,
  Search,
  SlidersHorizontal,
  Compass,
  FolderCheck,
  Plus
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Top Left: Avatar + "Hello 👋" + Name (Exact style as After mockup) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="relative focus:outline-none group"
            >
              <div className="w-11 h-11 rounded-full bg-forest-900 text-lime-400 font-display font-extrabold text-lg flex items-center justify-center border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                {currentUser.displayName.charAt(0)}
              </div>
            </button>
            <div className="text-left">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <span>Hello</span>
                <span>👋</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 leading-tight">
                  {currentUser.displayName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.2 rounded-full text-[10px] font-bold bg-lime-100 text-forest-900 border border-lime-300">
                  {currentUser.role === 'moderator' ? 'Safety Officer' : 'Verified Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Center Brand / Campus Location Pill for Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle border border-slate-200 text-xs font-semibold text-slate-700 hover:border-forest-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                <span className="max-w-[200px] truncate">
                  {filterCampusLocation === 'all'
                    ? 'All Campus Zones'
                    : CAMPUS_LOCATIONS.find((l) => l.id === filterCampusLocation)?.zone || 'Selected Zone'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLocationPicker && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl p-2 border border-slate-100 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-forest-900 uppercase tracking-wider">
                    Select Campus Zone
                  </div>
                  <button
                    onClick={() => {
                      setFilterCampusLocation('all');
                      setShowLocationPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      filterCampusLocation === 'all'
                        ? 'bg-lime-100 text-forest-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Campus Zones</span>
                    {filterCampusLocation === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />}
                  </button>
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setFilterCampusLocation(loc.id);
                        setShowLocationPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        filterCampusLocation === loc.id
                          ? 'bg-lime-100 text-forest-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{loc.name}</span>
                      {filterCampusLocation === loc.id && <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Right: Actions, Notifications & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Report Buttons on desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => openReportModal('lost')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-forest-900 bg-forest-100 hover:bg-forest-200 transition-all"
              >
                Report Lost
              </button>
              <button
                onClick={() => openReportModal('found')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-lime-400" />
                <span>Report Found</span>
              </button>
            </div>

            {/* Notification Bell (Circular white button with count badge as in mockup) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-forest-600 flex items-center justify-center relative shadow-sm transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl p-4 border border-slate-100 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-forest-900" />
                      <span className="font-display font-bold text-sm text-slate-900">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] font-semibold text-forest-600 hover:text-forest-900"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2 pr-1">
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
                            n.read ? 'opacity-60 hover:opacity-100 hover:bg-slate-50' : 'bg-lime-50/80 hover:bg-lime-100/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-forest-900">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-lime-500 mt-1" />}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => switchUserRole(currentUser.role === 'student' ? 'moderator' : 'student')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all shadow-sm ${
                currentUser.role === 'moderator'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-forest-50 text-forest-900 border-forest-200'
              }`}
              title="Click to toggle test role"
            >
              {currentUser.role === 'moderator' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Officer Jenkins</span>
                  <span className="sm:hidden">Desk</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-forest-700" />
                  <span className="hidden sm:inline">Student Mode</span>
                  <span className="sm:hidden">Student</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
