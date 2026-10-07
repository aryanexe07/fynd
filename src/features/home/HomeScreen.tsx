import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Map,
  Plus,
  Bookmark,
  Footprints,
  Laptop,
  CreditCard,
  Key,
  Briefcase,
  Shirt,
  BookOpen,
  Eye,
  CheckCircle2,
  Filter,
  Layers,
  ShieldCheck,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Item, ItemCategory } from '../../types';

interface HomeScreenProps {
  onSelectItem: (item: Item) => void;
  openReportModal: (type: 'lost' | 'found') => void;
  onNavigateSearch: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectItem, openReportModal, onNavigateSearch }) => {
  const { items, matches, currentUser, filterCampusLocation } = useAppState();

  const [activeSegment, setActiveSegment] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter items based on segment, category, location, and search
  const filteredItems = items.filter((item) => {
    if (activeSegment === 'lost' && item.type !== 'lost') return false;
    if (activeSegment === 'found' && item.type !== 'found') return false;
    if (item.status === 'recovered') return false;
    if (filterCampusLocation !== 'all' && item.locationId !== filterCampusLocation) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const match = item.title.toLowerCase().includes(q) ||
                    item.publicDescription.toLowerCase().includes(q) ||
                    item.locationName.toLowerCase().includes(q) ||
                    item.brand?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // User matches alert
  const userMatches = matches.filter((m) => {
    const lostItem = items.find((i) => i.id === m.lostItemId);
    const foundItem = items.find((i) => i.id === m.foundItemId);
    return lostItem?.reporterId === currentUser.uid || foundItem?.reporterId === currentUser.uid;
  });

  const categories: Array<{ id: ItemCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Items', icon: Layers },
    { id: 'clothing', label: 'Sneakers & Apparel', icon: Footprints },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'bags_wallets', label: 'Bags & Wallets', icon: Briefcase },
    { id: 'accessories', label: 'Accessories', icon: Tag },
    { id: 'id_cards', label: 'IDs & Passes', icon: CreditCard },
    { id: 'keys', label: 'Keys', icon: Key },
  ];

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto animate-fade-in">
      {/* 1. Search Bar with Clean Pill Input & Emerald Filter Button */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 relative flex items-center bg-white rounded-full border border-slate-200/90 px-4 py-3 shadow-soft hover:border-[#22a36b] transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search laptops, headphones, wallets, keys, cards, bottles..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Square / Rounded Filter Button with Emerald Theme */}
        <button
          onClick={onNavigateSearch}
          className="w-12 h-12 rounded-2xl bg-slate-900 text-white hover:bg-[#22a36b] flex items-center justify-center shadow-soft transition-all shrink-0 active:scale-95"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Match Alert (If match exists for student) */}
      {userMatches.length > 0 && (
        <div className="rounded-3xl bg-slate-900 text-white p-4 sm:p-5 shadow-card flex items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#22a36b] text-white font-bold flex items-center justify-center shrink-0 shadow-glow-green">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#34d399]">
                  Verified Match Found
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  {userMatches[0].score}% Match
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                A compatible match was located at Main Campus Library Desk.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const targetFound = items.find((i) => i.id === userMatches[0].foundItemId);
              if (targetFound) onSelectItem(targetFound);
            }}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#22a36b] text-white hover:bg-[#1c8c5c] transition-colors shrink-0 flex items-center gap-1 shadow-sm"
          >
            <span>Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Circular Category Bar with Emerald Highlights & Toggle Return */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Categories
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-[#22a36b] hover:text-[#1c8c5c] transition-colors flex items-center gap-1"
            >
              <span>Reset Category</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-2 px-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? 'all' : cat.id)}
                className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-none"
                title={isActive ? 'Click to deselect' : `Filter by ${cat.label}`}
              >
                <div className={`category-circle-btn ${isActive ? 'active' : 'inactive'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] transition-colors whitespace-nowrap ${
                    isActive ? 'font-bold text-slate-900' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Featured Hero Banner with Clean Non-Glitch Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-[#1c8c5c] p-6 sm:p-7 text-white shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[11px] font-extrabold text-[#34d399] uppercase tracking-wider">
              Zero-Knowledge Campus Protection
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
              Report & Recover Items <span className="text-[#34d399] italic">Instantly</span>
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              Verify true ownership through private zero-knowledge challenges without exposing serial numbers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openReportModal('lost')}
                className="btn-emerald-cta px-5 py-2.5 text-xs"
              >
                <span>Report Lost Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openReportModal('found')}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20"
              >
                Report Found Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Segmented Capsule Toggle: All / Lost / Found + Active Filter Return Bar */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center bg-[#eef1f4] p-1 rounded-full border border-slate-200/80">
            <button
              onClick={() => setActiveSegment('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'all'
                  ? 'bg-[#22a36b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveSegment('lost')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'lost'
                  ? 'bg-[#22a36b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveSegment('found')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSegment === 'found'
                  ? 'bg-[#22a36b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found
            </button>
          </div>

          <button
            onClick={onNavigateSearch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#22a36b] shadow-soft transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#22a36b]" />
            <span>Advanced Search</span>
          </button>
        </div>

        {/* Active Filter Chips & Return Bar */}
        {(selectedCategory !== 'all' || activeSegment !== 'all' || searchKeyword || filterCampusLocation !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#e8f7ee] rounded-2xl border border-[#22a36b]/30 text-xs">
            <span className="font-bold text-[#1c8c5c] text-[11px] uppercase tracking-wider">
              Active Filters:
            </span>

            {activeSegment !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-800 font-bold text-[11px] shadow-xs border border-slate-200">
                Type: {activeSegment}
                <button
                  onClick={() => setActiveSegment('all')}
                  className="hover:text-rose-600 font-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-800 font-bold text-[11px] shadow-xs border border-slate-200">
                Category: {categories.find((c) => c.id === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-rose-600 font-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {searchKeyword && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-800 font-bold text-[11px] shadow-xs border border-slate-200">
                Query: "{searchKeyword}"
                <button
                  onClick={() => setSearchKeyword('')}
                  className="hover:text-rose-600 font-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveSegment('all');
                setSearchKeyword('');
              }}
              className="ml-auto text-[11px] font-extrabold text-[#1c8c5c] hover:underline"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 6. Section Header: Recent Campus Cases */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-lg text-slate-900">
            Recent Campus Cases & Items
          </h3>
          <button
            onClick={onNavigateSearch}
            className="text-xs font-bold text-[#22a36b] hover:text-[#1c8c5c] transition-colors"
          >
            See All ({filteredItems.length})
          </button>
        </div>

        {/* 7. Clean, High-Fidelity Item Cards */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 sm:p-12 text-center border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center mx-auto font-bold">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-800">
              No items match your active filters
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try selecting another category, clearing your search keywords, or resetting your filter options.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveSegment('all');
                setSearchKeyword('');
              }}
              className="btn-emerald-cta px-5 py-2.5 text-xs font-bold shadow-md"
            >
              Return & Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const itemMatches = matches.filter((m) => m.lostItemId === item.id || m.foundItemId === item.id);
              const topMatch = itemMatches[0];
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="card-clean p-4 cursor-pointer flex flex-col justify-between group hover:border-[#22a36b]/40 hover:-translate-y-1 transition-all duration-200"
                >
                  <div>
                    {/* Card Image Container with clean neutral background */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100 flex items-center justify-center p-3">
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                      />

                      {/* Type & Risk Tier Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.type === 'lost'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-[#22a36b] text-white font-bold'
                          }`}
                        >
                          {item.type}
                        </span>
                        <RiskTierBadge tier={item.riskTier} />
                      </div>

                      {/* Bookmark Icon on Top Right */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-soft transition-transform active:scale-90"
                          title="Bookmark"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#22a36b] text-[#22a36b]' : ''}`} />
                        </button>
                      </div>

                      {/* Status Badge at bottom right of image */}
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    {/* Match Badge (if any) */}
                    {topMatch && (
                      <div className="mb-2">
                        <MatchBadge score={topMatch.score} classification={topMatch.classification} />
                      </div>
                    )}

                    {/* Title & Brand */}
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#22a36b] transition-colors line-clamp-1 leading-snug">
                      {item.title}
                    </h4>

                    {item.brand && (
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
                        {item.brand} {item.color && `• ${item.color}`}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.publicDescription}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-[#22a36b] shrink-0" />
                      <span className="truncate text-[11px] font-medium">{item.locationName}</span>
                    </div>

                    <span className="text-[11px] font-bold text-[#22a36b] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

