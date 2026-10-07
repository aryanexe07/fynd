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
    <div className="space-y-6 pb-28 max-w-5xl mx-auto animate-fade-in">
      {/* Search Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Campus Directory & Case Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore lost and found cases across campus zones with instant zero-knowledge filters
        </p>
      </div>

      {/* Search Box & Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-4">
        <div className="relative flex items-center bg-[#f5f6f8] rounded-full border border-slate-200 px-4 py-3">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search laptops, headphones, wallets, keys, cards, bottles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#22a36b]"
            >
              <option value="all">All Items</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#22a36b]"
            >
              <option value="all">All Categories</option>
              <option value="clothing">Sneakers & Apparel</option>
              <option value="electronics">Electronics</option>
              <option value="bags_wallets">Bags & Wallets</option>
              <option value="accessories">Accessories</option>
              <option value="id_cards">IDs & Passes</option>
              <option value="keys">Keys</option>
              <option value="books_stationery">Books</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#22a36b]"
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#22a36b]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-semibold text-slate-600">
          Showing <span className="font-extrabold text-[#22a36b]">{sortedItems.length}</span> results
        </span>
        {(query || filterType !== 'all' || filterCategory !== 'all' || filterLocation !== 'all') && (
          <button onClick={clearFilters} className="font-bold text-[#22a36b] hover:text-[#1c8c5c]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="card-clean p-4 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#f4f5f7] mb-3 border border-slate-100 flex items-center justify-center p-3">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-[#22a36b] text-white'
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

                <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#22a36b] transition-colors line-clamp-1">
                  {item.title}
                </h4>

                {item.brand && (
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {item.brand} {item.color && `• ${item.color}`}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.publicDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 truncate max-w-[170px]">
                  <MapPin className="w-3.5 h-3.5 text-[#22a36b] shrink-0" />
                  <span className="truncate text-[11px] font-medium">{item.locationName}</span>
                </div>

                <span className="font-bold text-[#22a36b] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
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

