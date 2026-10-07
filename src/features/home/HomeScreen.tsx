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
  Scale,
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
  ChevronRight
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
    if (item.status === 'recovered') return false; // recovered in archives
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
    { id: 'all', label: 'All', icon: Layers },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'id_cards', label: 'IDs & Passes', icon: CreditCard },
    { id: 'keys', label: 'Keys', icon: Key },
    { id: 'bags_wallets', label: 'Bags/Wallets', icon: Briefcase },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'books_stationery', label: 'Books', icon: BookOpen },
  ];

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto animate-fade-in">
      {/* 1. Search Bar with Pill Input & Square Accent Filter Button (Exact as Mockup) */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 relative flex items-center bg-white rounded-2xl border border-slate-200/90 px-3.5 py-3 shadow-soft hover:border-forest-600 transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search items, brands, campus locations..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Square Filter Button in Forest Green / Lime Theme */}
        <button
          onClick={onNavigateSearch}
          className="w-11 h-11 rounded-2xl bg-forest-900 text-lime-400 hover:bg-forest-800 flex items-center justify-center shadow-md transition-all shrink-0"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Match Alert (If match exists for student) */}
      {userMatches.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-900 text-white p-4 shadow-card flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-forest-950 font-bold flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-lime-400">
                  Potential Match Detected
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  {userMatches[0].score}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                A compatible item was found in the library study zone.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const targetFound = items.find((i) => i.id === userMatches[0].foundItemId);
              if (targetFound) onSelectItem(targetFound);
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-400 text-forest-950 hover:bg-lime-300 transition-colors shrink-0 flex items-center gap-1 shadow-sm"
          >
            <span>Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Circular Category Bar (Exact format as After mockup) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-none"
              >
                <div className={`category-circle-btn ${isActive ? 'active' : 'inactive'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] transition-colors ${
                    isActive ? 'font-bold text-forest-900' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Hero Banner Card (Exact style as After mockup: Deep Forest/Emerald gradient + White CTA button + 3D campus badge) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-800 p-5 sm:p-6 text-white shadow-card">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-lime-400/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-md">
            <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider">
              Campus Zero-Knowledge Network
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight">
              Report your Item for <span className="text-lime-300 italic">Free</span>
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              List it on FYND and verify ownership securely without exposing serial numbers.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openReportModal('lost')}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-forest-950 bg-white hover:bg-lime-50 hover:shadow-glow-lime shadow-md transition-all flex items-center gap-2"
              >
                <span>Report an item</span>
                <ArrowRight className="w-3.5 h-3.5 text-forest-900" />
              </button>
            </div>
          </div>

          {/* Graphic / Tag element on the right (like the house/coin 3D hand in the mockup) */}
          <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <div className="w-12 h-12 rounded-xl bg-lime-400 text-forest-950 font-black text-2xl flex items-center justify-center shadow-lg">
              F
            </div>
            <span className="text-[10px] font-bold text-lime-300 uppercase tracking-wider mt-1.5">
              Instant Match
            </span>
          </div>
        </div>
      </div>

      {/* 5. Segmented Capsule Toggle (For Rent / For Sale -> All / Lost / Found) + Sort Button */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* Rounded Capsule Toggle matching the mockup */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveSegment('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSegment === 'all'
                ? 'bg-forest-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Active
          </button>
          <button
            onClick={() => setActiveSegment('lost')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSegment === 'lost'
                ? 'bg-forest-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lost
          </button>
          <button
            onClick={() => setActiveSegment('found')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSegment === 'found'
                ? 'bg-forest-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Found
          </button>
        </div>

        {/* Sort Button with Icon (as shown on the right in mockup) */}
        <button
          onClick={onNavigateSearch}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-forest-600 shadow-soft transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700" />
          <span>Filter & Sort</span>
        </button>
      </div>

      {/* 6. Section Header: "Featured Listings" / "Recent Campus Cases" with "See All" */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Recent Campus Cases
          </h3>
          <button
            onClick={onNavigateSearch}
            className="text-xs font-bold text-forest-700 hover:text-forest-900 transition-colors"
          >
            See All
          </button>
        </div>

        {/* 7. Featured Item Cards matching the Modern Mockup card styling */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-soft">
            <h4 className="font-display font-bold text-base text-slate-800">No items match your filter</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try selecting another category or clear search terms.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveSegment('all');
                setSearchKeyword('');
              }}
              className="px-4 py-2 rounded-full text-xs font-bold bg-forest-900 text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const itemMatches = matches.filter((m) => m.lostItemId === item.id || m.foundItemId === item.id);
              const topMatch = itemMatches[0];
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="card-clean p-3.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Card Image with Age Tag + Top Right Action Icons */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Age Pill on Top Left (as shown in mockup: "1 year old" / "Today") */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                          {new Date(item.incidentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            item.type === 'lost'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {/* Action Icons on Top Right (Plus, Scale, Heart/Bookmark as in mockup) */}
                      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 flex items-center justify-center transition-colors"
                          title="Bookmark"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-lime-400 text-lime-400' : ''}`} />
                        </button>
                      </div>

                      {/* Floating "Map 🗺️" Pill at the bottom center of card (exact feature from mockup) */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-forest-900/90 backdrop-blur-md text-white flex items-center gap-1 shadow-md border border-white/20">
                          <Map className="w-3 h-3 text-lime-400" />
                          <span>Campus Map</span>
                        </span>
                      </div>
                    </div>

                    {/* Match Badge if available */}
                    {topMatch && (
                      <div className="mb-1.5">
                        <MatchBadge score={topMatch.score} classification={topMatch.classification} />
                      </div>
                    )}

                    {/* Title & Brand */}
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    {item.brand && (
                      <div className="text-xs font-semibold text-forest-700 mt-0.5">
                        {item.brand} {item.color && `• ${item.color}`}
                      </div>
                    )}

                    {/* Description snippet */}
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.publicDescription}
                    </p>
                  </div>

                  {/* Footer Meta: Location with MapPin + Status pill */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500 truncate max-w-[170px]">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                      <span className="truncate text-[11px]">{item.locationName}</span>
                    </div>

                    <StatusBadge status={item.status} />
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
