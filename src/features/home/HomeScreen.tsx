import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Clock,
  Search,
  Filter,
  Layers,
  HelpCircle,
  Laptop,
  Key,
  CreditCard,
  Briefcase,
  Shirt,
  BookOpen,
  Smartphone,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Item, ItemCategory } from '../../types';

interface HomeScreenProps {
  onSelectItem: (item: Item) => void;
  openReportModal: (type: 'lost' | 'found') => void;
  onNavigateSearch: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectItem, openReportModal, onNavigateSearch }) => {
  const { items, matches, currentUser, filterCampusLocation } = useAppState();
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'lost' | 'found' | 'recovered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeFeedTab === 'lost' && item.type !== 'lost') return false;
    if (activeFeedTab === 'found' && item.type !== 'found') return false;
    if (activeFeedTab === 'recovered' && item.status !== 'recovered') return false;
    if (activeFeedTab !== 'recovered' && item.status === 'recovered') return false; // keep recovered separate
    if (filterCampusLocation !== 'all' && item.locationId !== filterCampusLocation) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  // Check if current user has any active matches
  const userMatches = matches.filter((m) => {
    const lostItem = items.find((i) => i.id === m.lostItemId);
    const foundItem = items.find((i) => i.id === m.foundItemId);
    return lostItem?.reporterId === currentUser.uid || foundItem?.reporterId === currentUser.uid;
  });

  const categories: Array<{ id: ItemCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Items', icon: Layers },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'id_cards', label: 'IDs & Passes', icon: CreditCard },
    { id: 'keys', label: 'Keys', icon: Key },
    { id: 'bags_wallets', label: 'Bags & Wallets', icon: Briefcase },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'books_stationery', label: 'Books & Tools', icon: BookOpen },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* High-Impact Matched Alert Banner */}
      {userMatches.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-lime-950 border border-lime-400/40 p-4 sm:p-5 shadow-glow-lime relative overflow-hidden animate-fade-in">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-400">Match Alert</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-400/20 text-lime-300 border border-lime-400/40">
                    {userMatches[0].score}% Confidence
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-white mt-0.5">
                  Potential match detected for your report!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  A matching item was recorded at the Library. Review ownership challenge questions to initiate recovery.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const targetFound = items.find((i) => i.id === userMatches[0].foundItemId);
                if (targetFound) onSelectItem(targetFound);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 transition-colors flex items-center gap-1.5 shrink-0 shadow-md"
            >
              <span>Review Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome & Stats */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/20 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Campus Verified Zero-Knowledge Recovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Lost something on campus? <br />
              <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                Find it. Verify it. Return it.
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              FYND combines automated attribute matching with zero-knowledge ownership challenges, keeping your private serial numbers and marks safe from false claimants.
            </p>

            {/* Quick Action Duo */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openReportModal('lost')}
                className="px-5 py-3 rounded-xl text-sm font-bold bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-800 hover:border-emerald-400 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Report a Lost Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openReportModal('found')}
                className="px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime transition-all flex items-center gap-2"
              >
                <span>Found Something</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Campus Metric Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-lime-400">94.2%</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Recovery Success</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified handovers</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">{items.length}</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Campus Cases</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Tracked this semester</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">&lt; 2 hrs</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Avg Match Time</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Deterministic signals</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-300">0%</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">False Claims</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Protected proof shield</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">Browse by Category</h3>
          <button
            onClick={onNavigateSearch}
            className="text-xs font-semibold text-emerald-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
          >
            <span>Advanced Filters</span>
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-lime-400 text-slate-950 shadow-glow-lime'
                    : 'bg-emerald-950/60 border border-emerald-500/20 text-slate-300 hover:text-white hover:border-lime-400/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campus Activity Feed Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white">Campus Recovery Feed</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
              {filteredItems.length} active
            </span>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-emerald-950/80 border border-emerald-500/20">
            {(['all', 'lost', 'found', 'recovered'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFeedTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeFeedTab === tab
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'all' ? 'All Live' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
            <HelpCircle className="w-12 h-12 text-emerald-400/60 mx-auto mb-3" />
            <h4 className="font-display font-bold text-lg text-white">No items found in this view</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your category filters or campus zone selector.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveFeedTab('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-900 border border-emerald-500/40 text-emerald-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const itemMatches = matches.filter((m) => m.lostItemId === item.id || m.foundItemId === item.id);
              const topMatch = itemMatches[0];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="rounded-2xl glass-card p-4 border border-emerald-500/20 hover:border-lime-400/50 cursor-pointer flex flex-col justify-between group transition-all"
                >
                  <div>
                    {/* Item Image with Type Badge */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 border border-emerald-500/10">
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                            item.type === 'lost'
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-emerald-400 text-slate-950 shadow-md'
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

                    {/* Top Match Tag if exists */}
                    {topMatch && item.status !== 'recovered' && (
                      <div className="mb-2">
                        <MatchBadge score={topMatch.score} classification={topMatch.classification} />
                      </div>
                    )}

                    {/* Item Title & Brand */}
                    <h4 className="font-display font-bold text-base text-white group-hover:text-lime-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    {item.brand && (
                      <div className="text-xs font-semibold text-emerald-400/90 mt-0.5">
                        {item.brand} {item.color && `• ${item.color}`}
                      </div>
                    )}

                    {/* Public Description Snippet */}
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {item.publicDescription}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 pt-3 border-t border-emerald-500/15 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="truncate">{item.locationName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {new Date(item.incidentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                          {item.approximateTime && `at ${item.approximateTime}`}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-emerald-400 group-hover:text-lime-300 flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
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
