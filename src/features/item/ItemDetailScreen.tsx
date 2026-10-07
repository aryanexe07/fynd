import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item } from '../../types';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  ChevronLeft,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Lock,
  Sparkles,
  KeyRound,
  Minus,
  Plus,
  Bookmark,
  Share2,
  Check,
  ShieldAlert,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ItemDetailScreenProps {
  item: Item;
  onBack: () => void;
  onOpenClaimChallenge: (foundItem: Item) => void;
  onOpenHandover: (itemId: string) => void;
  onSelectCandidateItem: (candidate: Item) => void;
}

export const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({
  item,
  onBack,
  onOpenClaimChallenge,
  onOpenHandover,
  onSelectCandidateItem,
}) => {
  const { currentUser, getMatchesForItem, getPrivateEvidence, items, handovers } = useAppState();

  const [quantity, setQuantity] = useState(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('12');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'zk_proof' | 'matches'>('details');

  const matches = getMatchesForItem(item.id);
  const privateEvidence = getPrivateEvidence(item.id);
  const isReporter = item.reporterId === currentUser.uid;
  const isModerator = currentUser.role === 'moderator';
  const existingHandover = handovers.find((h) => h.itemId === item.id);

  // Dynamic price & spec mockup for presentation
  const price = item.riskTier === 3 ? 165.00 : item.riskTier === 2 ? 135.97 : 89.50;
  const originalPrice = (price * 1.74).toFixed(2);
  const formattedPrice = price.toFixed(2);

  const colorSwatches = [
    { name: 'Onyx Black', hex: '#18181b', ring: '#18181b' },
    { name: 'Queen Conch', hex: '#831843', ring: '#9d174d' },
    { name: 'Jade Emerald', hex: '#22a36b', ring: '#16a34a' },
  ];

  const sizeOptions = ['12', '11.5', '10', '9.5'];

  // Safe image fallback
  const displayImages = item.imageUrls?.length > 0 ? item.imageUrls : [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'
  ];

  return (
    <div className="max-w-2xl mx-auto pb-28 animate-fade-in">
      {/* 1. Top Showcase Card Container with curved backdrop */}
      <div className="bg-[#f2f4f7] rounded-3xl overflow-hidden pt-4 pb-0 relative shadow-soft border border-slate-200/60">
        {/* Top Floating App Bar: Back (<) on left, More (...) on right */}
        <div className="flex items-center justify-between px-5 pt-2">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95"
              aria-label="Bookmark"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#22a36b] text-[#22a36b]' : ''}`} />
            </button>
            <button
              onClick={() => {}}
              className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Product Image Showcase with floating drop shadow */}
        <div className="relative px-6 py-6 sm:py-8 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
            <img
              src={displayImages[activeImageIndex % displayImages.length]}
              alt={item.title}
              className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300 select-none"
            />
          </div>

          {/* Type Badge Floating */}
          <div className="absolute top-2 left-6">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-[#22a36b] text-white'
              }`}
            >
              {item.type} Case
            </span>
          </div>
        </div>

        {/* 2. Signature Emerald Green Curved Wave Transition with Pagination Dots */}
        <div className="bg-[#22a36b] pt-5 pb-9 px-6 relative rounded-t-[36px] -mb-5">
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((dotIndex) => {
              const isActive = dotIndex === 2; // middle active dot as in screenshot
              return (
                <div
                  key={dotIndex}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. White Bottom Details Sheet (Curved Top Sheet) */}
      <div className="bg-white rounded-t-[36px] rounded-b-3xl p-6 sm:p-8 space-y-6 -mt-4 relative z-10 shadow-card border border-slate-100">
        {/* Title, Brand, & Price Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {item.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {item.brand || 'CAMPUS VERIFIED'} {item.subcategory && `• ${item.subcategory}`}
              </span>
              <RiskTierBadge tier={item.riskTier} />
            </div>
          </div>

          {/* Price Block with Original Strike & Bold Green/Black Price */}
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400 line-through font-medium">
              ${originalPrice}
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-none mt-0.5">
              ${formattedPrice}
            </div>
          </div>
        </div>

        {/* Rating & Reviews Bar */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">4.5</span>
          {/* 4 Green Dots + 1 Gray Dot */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22a36b]" />
            <span className="w-2 h-2 rounded-full bg-[#22a36b]" />
            <span className="w-2 h-2 rounded-full bg-[#22a36b]" />
            <span className="w-2 h-2 rounded-full bg-[#22a36b]" />
            <span className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
          <span className="text-xs text-slate-500 font-semibold ml-1">
            7.1k reviews
          </span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-xs text-[#22a36b] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>94% Confidence</span>
          </div>
        </div>

        {/* Color Swatches & Size Options (Matching the screenshot UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Available Colors */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Colors
            </span>
            <div className="flex items-center gap-3">
              {colorSwatches.map((swatch, idx) => {
                const isSelected = selectedColorIndex === idx;
                return (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                        : 'hover:scale-105 opacity-80'
                    }`}
                    title={swatch.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Pills */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Size
            </span>
            <div className="flex items-center gap-2.5">
              {sizeOptions.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#22a36b] text-white shadow-sm scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location & Time Info Banner */}
        <div className="p-4 rounded-2xl bg-[#f5f6f8] border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-800 font-bold">
            <MapPin className="w-4 h-4 text-[#22a36b] shrink-0" />
            <span>{item.locationName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Reported on {new Date(item.incidentDate).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })} {item.approximateTime && `at ${item.approximateTime}`}
            </span>
          </div>
        </div>

        {/* Public Description */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Description
          </span>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {item.publicDescription ||
              'The LeBron XXI has a cabling system that works with Zoom Air cushioning and a light, low-to-the-ground design, giving you agile fluidity and explosiveness without excess weight.'}
          </p>
        </div>

        {/* Tab View: Sealed Zero-Knowledge Proof & Match Candidates */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === 'details'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('zk_proof')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'zk_proof'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3 h-3 text-[#22a36b]" />
              <span>Zero-Knowledge Proof</span>
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'matches'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#22a36b]" />
              <span>Matches ({matches.length})</span>
            </button>
          </div>

          {/* Zero-Knowledge Proof Panel */}
          {activeTab === 'zk_proof' && (
            <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-[#22a36b]" />
                  <span>Sealed Private Evidence</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-[#34d399]">
                  {isModerator ? 'Moderator Access' : isReporter ? 'Owner View' : 'Encrypted'}
                </span>
              </div>

              {privateEvidence ? (
                <div className="space-y-2 pt-1 text-xs">
                  {privateEvidence.serialNumber && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Serial / IMEI:</span>
                      <div className="font-mono text-[#34d399] font-bold mt-0.5">{privateEvidence.serialNumber}</div>
                    </div>
                  )}
                  {privateEvidence.secretQuestions.map((q, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                      <div className="text-slate-300 font-medium">Q: {q.prompt}</div>
                      <div className="text-[#34d399] font-bold mt-0.5">Answer: {q.expectedAnswer}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  Claimants must prove ownership through zero-knowledge verification questions before physical return.
                </p>
              )}
            </div>
          )}

          {/* Matches Panel */}
          {activeTab === 'matches' && (
            <div className="space-y-2 animate-fade-in">
              {matches.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No compatible items found yet. Automatic scanning is active.
                </p>
              ) : (
                matches.map((m) => {
                  const oppId = m.lostItemId === item.id ? m.foundItemId : m.lostItemId;
                  const cand = items.find((i) => i.id === oppId);
                  if (!cand) return null;
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-[#f5f6f8] border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={cand.imageUrls[0]} alt={cand.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <MatchBadge score={m.score} classification={m.classification} />
                          <div className="font-bold text-xs text-slate-900 mt-0.5">{cand.title}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectCandidateItem(cand)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                      >
                        Compare
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Sticky Floating Action Bar matching the mockup with `- 2 +` & `ADD TO CART >` */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 shadow-floating">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Quantity Stepper Pill `- 2 +` */}
          <div className="flex items-center justify-between bg-[#f2f4f7] rounded-full px-3 py-2 w-28 shrink-0 shadow-inner">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-white text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-soft text-sm font-bold active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-display font-extrabold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-white text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-soft text-sm font-bold active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Action Button (Solid Emerald Green with circular chevron disc) */}
          {existingHandover ? (
            <button
              onClick={() => onOpenHandover(item.id)}
              className="flex-1 btn-emerald-cta py-3.5 px-6"
            >
              <KeyRound className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Open Handover</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center ml-auto">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : item.type === 'found' && !isReporter ? (
            <button
              onClick={() => onOpenClaimChallenge(item)}
              className="flex-1 btn-emerald-cta py-3.5 px-6"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Initiate Claim</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center ml-auto">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : isReporter ? (
            <button
              onClick={() => onOpenClaimChallenge(item)}
              className="flex-1 btn-emerald-cta py-3.5 px-6"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Manage Case</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center ml-auto">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => onOpenClaimChallenge(item)}
              className="flex-1 btn-emerald-cta py-3.5 px-6"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Add to My Cases</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center ml-auto">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

