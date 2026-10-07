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
  Bookmark,
  Share2,
  Check,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Clock,
  Building2,
  FileText,
  UserCheck
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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'zk_proof' | 'matches'>('details');

  const matches = getMatchesForItem(item.id);
  const privateEvidence = getPrivateEvidence(item.id);
  const isReporter = item.reporterId === currentUser.uid;
  const isModerator = currentUser.role === 'moderator';
  const existingHandover = handovers.find((h) => h.itemId === item.id);

  // Fallback images
  const displayImages = item.imageUrls?.length > 0 ? item.imageUrls : [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'
  ];

  return (
    <div className="max-w-2xl mx-auto pb-28 animate-fade-in">
      {/* 1. Top Showcase Card Container with curved backdrop */}
      <div className="bg-[#f2f4f7] rounded-3xl overflow-hidden pt-4 pb-0 relative shadow-soft border border-slate-200/60">
        {/* Top Floating Navigation Bar */}
        <div className="flex items-center justify-between px-5 pt-2">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95 border border-slate-200/80"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              CASE RECORD
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-700">
              #{item.id.toUpperCase().replace('ITEM_', 'FYND-')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95 border border-slate-200/80"
              aria-label="Bookmark"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#22a36b] text-[#22a36b]' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95 border border-slate-200/80"
              aria-label="Share case"
              title="Copy link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Item Image Showcase */}
        <div className="relative px-6 py-6 sm:py-8 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
            <img
              src={displayImages[activeImageIndex % displayImages.length]}
              alt={item.title}
              className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300 select-none"
            />
          </div>

        {/* Type Badge Floating */}
        <div className="absolute top-2 left-6 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
              item.type === 'lost' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-[#22a36b] text-white font-bold'
            }`}
          >
            {item.type} Item
          </span>
          <RiskTierBadge tier={item.riskTier} />
        </div>
      </div>

      {/* 2. Main Details Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 mt-4 relative z-10 shadow-card border border-slate-200/80">
        {/* Header: Title, Category & Current Status */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {item.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {item.category.replace('_', ' ')} {item.brand && `• ${item.brand}`}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-[#22a36b]">
                {item.color || 'Standard Model'}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <StatusBadge status={item.status} />
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
              Case Status
            </span>
          </div>
        </div>

        {/* Campus Custody & Safe Desk Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f5f6f8] border border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#22a36b]" />
              <span>Location / Campus Zone</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {item.locationName}
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#22a36b]" />
              <span>Reported Date & Time</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">
              {new Date(item.incidentDate).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })} {item.approximateTime && `at ${item.approximateTime}`}
            </div>
          </div>
        </div>

        {/* Reporter / Custody Verified Strip */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <UserCheck className="w-4 h-4 text-[#22a36b]" />
            <span>
              Filed by <strong>{item.reporterName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#22a36b] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Knowledge Proof Enabled</span>
          </div>
        </div>

        {/* Public Description */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Public Incident Description
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#f9fafb] p-3.5 rounded-2xl border border-slate-100">
            {item.publicDescription || 'No additional public details provided.'}
          </p>
        </div>

        {/* Navigation Tabs: Details / ZK Proof / Matches */}
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
              Specifications
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
              <span>AI Matches ({matches.length})</span>
            </button>
          </div>

          {/* Specifications Panel */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 animate-fade-in text-xs">
              <div className="p-3 rounded-2xl bg-[#f5f6f8] border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <div className="font-bold text-slate-900 capitalize mt-0.5">{item.category.replace('_', ' ')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f5f6f8] border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Brand / Maker</span>
                <div className="font-bold text-slate-900 mt-0.5">{item.brand || 'Unbranded / Unknown'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f5f6f8] border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Color</span>
                <div className="font-bold text-slate-900 mt-0.5">{item.color || 'Not specified'}</div>
              </div>
            </div>
          )}

          {/* Zero-Knowledge Proof Panel */}
          {activeTab === 'zk_proof' && (
            <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-[#22a36b]" />
                  <span>Sealed Verification Evidence</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-[#34d399]">
                  {isModerator ? 'Moderator View' : isReporter ? 'Owner View' : 'Encrypted on Server'}
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
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ownership challenge questions protect this item. To recover, a claimant must answer private verification challenges known only to the legitimate owner.
                </p>
              )}
            </div>
          )}

          {/* Matches Panel */}
          {activeTab === 'matches' && (
            <div className="space-y-2 animate-fade-in">
              {matches.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#f9fafb] text-center border border-slate-100">
                  <p className="text-xs text-slate-400">
                    No active match candidates currently found. Campus auto-matcher is monitoring 24/7.
                  </p>
                </div>
              ) : (
                matches.map((m) => {
                  const oppId = m.lostItemId === item.id ? m.foundItemId : m.lostItemId;
                  const cand = items.find((i) => i.id === oppId);
                  if (!cand) return null;
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-[#f5f6f8] border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={cand.imageUrls[0]} alt={cand.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <MatchBadge score={m.score} classification={m.classification} />
                          <div className="font-bold text-xs text-slate-900 mt-0.5">{cand.title}</div>
                          <div className="text-[11px] text-slate-500">{cand.locationName}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectCandidateItem(cand)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shrink-0"
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

      {/* 4. Professional Lost and Found Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 shadow-floating">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {existingHandover ? (
            <button
              onClick={() => onOpenHandover(item.id)}
              className="w-full btn-emerald-cta py-3.5 px-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-white" />
                <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Open Handover Room (OTP)</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : item.type === 'found' && !isReporter ? (
            <button
              onClick={() => onOpenClaimChallenge(item)}
              className="w-full btn-emerald-cta py-3.5 px-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Claim Item / Prove Ownership</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : isReporter ? (
            <button
              onClick={() => {
                if (matches.length > 0) {
                  setActiveTab('matches');
                } else {
                  onBack();
                }
              }}
              className="w-full btn-emerald-cta py-3.5 px-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">
                  {matches.length > 0 ? `Review Matches (${matches.length})` : 'Case Active • Monitoring'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => onOpenClaimChallenge(item)}
              className="w-full btn-emerald-cta py-3.5 px-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">Verify & Track Case</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-[#22a36b] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
