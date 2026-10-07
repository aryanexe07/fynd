import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { Item } from '../../types';
import { StatusBadge, RiskTierBadge } from '../../components/common/Badge';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Map,
  Filter
} from 'lucide-react';

interface SearchScreenProps {
  onSelectItem: (item: Item) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectItem }) => {
  const { items } = useAppState();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredItems = items.filter((item) => {
    if (item.status === 'recovered' && !query.trim()) return false;

    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterLocation !== 'all' && item.locationId !== filterLocation) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.publicDescription.toLowerCase().includes(q) ||
        item.locationName.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q);
      if (!match) return false;
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
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto animate-fade-in">
      {/* Search Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Campus Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Find items across all campus zones with structured filters
        </p>
      </div>

      {/* Search Box & Controls */}
      <div className="card-clean p-4 space-y-3">
        <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200 px-3.5 py-2.5">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search keywords, brand, color (e.g. Sony, Bellroy, Hydro Flask)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-forest-600"
            >
              <option value="all">Lost & Found</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-forest-600"
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

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-forest-600"
            >
              <option value="all">All Zones</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-forest-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">
          Showing <span className="font-bold text-forest-900">{sortedItems.length}</span> items
        </span>
        {(query || filterType !== 'all' || filterCategory !== 'all' || filterLocation !== 'all') && (
          <button onClick={clearFilters} className="font-bold text-forest-700 hover:text-forest-900">
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {sortedItems.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-soft">
          <h4 className="font-display font-bold text-base text-slate-800">No items match your criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try loosening your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="card-clean p-3.5 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
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

                <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                  {item.title}
                </h4>

                {item.brand && (
                  <div className="text-xs font-semibold text-forest-700 mt-0.5">
                    {item.brand} {item.color && `• ${item.color}`}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.publicDescription}
                </p>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 truncate max-w-[170px]">
                  <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span className="truncate text-[11px]">{item.locationName}</span>
                </div>

                <span className="font-bold text-forest-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
