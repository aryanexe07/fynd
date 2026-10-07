import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { Item, ItemCategory, RiskTier } from '../../types';
import { StatusBadge, RiskTierBadge } from '../../components/common/Badge';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  Laptop,
  Briefcase,
  Key,
  CreditCard,
  Shirt,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface SearchScreenProps {
  onSelectItem: (item: Item) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectItem }) => {
  const { items, matches } = useAppState();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterRiskTier, setFilterRiskTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredItems = items.filter((item) => {
    // Exclude recovered from active search unless typed
    if (item.status === 'recovered' && !query.trim()) return false;

    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterLocation !== 'all' && item.locationId !== filterLocation) return false;
    if (filterRiskTier !== 'all' && item.riskTier.toString() !== filterRiskTier) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchDesc = item.publicDescription.toLowerCase().includes(q);
      const matchLoc = item.locationName.toLowerCase().includes(q);
      const matchColor = item.color?.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchDesc && !matchLoc && !matchColor) return false;
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const timeA = new Date(a.incidentDate).getTime();
    const timeB = new Date(b.incidentDate).getTime();
    return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const clearFilters = () => {
    setQuery('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterLocation('all');
    setFilterRiskTier('all');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Campus Item Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Search active Lost & Found listings with structured campus filters
        </p>
      </div>

      {/* Main Search Bar & Quick Toggles */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-500/25 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          <input
            type="text"
            placeholder="Search keywords, brand, color, model (e.g. Sony, Hydro Flask, AirPods, Calculator)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-lime-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Type Toggle */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Report Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/20 text-xs text-slate-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">Lost & Found</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/20 text-xs text-slate-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="id_cards">IDs & Passes</option>
              <option value="keys">Keys</option>
              <option value="bags_wallets">Bags & Wallets</option>
              <option value="clothing">Clothing</option>
              <option value="books_stationery">Books & Stationery</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Campus Location */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Location
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/20 text-xs text-slate-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">All Campus Zones</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.zone}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/20 text-xs text-slate-200 focus:outline-none focus:border-lime-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">
          Showing <span className="text-lime-400 font-bold">{sortedItems.length}</span> results
        </span>
        {(query || filterType !== 'all' || filterCategory !== 'all' || filterLocation !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-xs text-emerald-400 hover:text-lime-300 font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results List / Cards */}
      {sortedItems.length === 0 ? (
        <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
          <Search className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-white">No items matching criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try loosening your filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="rounded-2xl glass-card p-4 border border-emerald-500/20 hover:border-lime-400/50 cursor-pointer flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 border border-emerald-500/10">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                        item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                      }`}
                    >
                      {item.type}
                    </span>
                    <RiskTierBadge tier={item.riskTier} />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <h4 className="font-display font-bold text-base text-white group-hover:text-lime-300 transition-colors line-clamp-1">
                  {item.title}
                </h4>

                {item.brand && (
                  <div className="text-xs font-semibold text-emerald-400/90 mt-0.5">
                    {item.brand} {item.color && `• ${item.color}`}
                  </div>
                )}

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {item.publicDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/15 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{new Date(item.incidentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 group-hover:text-lime-300 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
