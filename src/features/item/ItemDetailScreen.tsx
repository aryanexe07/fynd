import React from 'react';
import { useAppState } from '../../services/stateContext';
import { Item } from '../../types';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Lock,
  Sparkles,
  KeyRound,
  ArrowRight,
  Shield
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

  const matches = getMatchesForItem(item.id);
  const privateEvidence = getPrivateEvidence(item.id);
  const isReporter = item.reporterId === currentUser.uid;
  const isModerator = currentUser.role === 'moderator';

  const existingHandover = handovers.find((h) => h.itemId === item.id);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-forest-700" />
        <span>Back to Directory</span>
      </button>

      {/* Main Item Profile Card */}
      <div className="card-clean p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Image & Classification */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-soft">
              <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {item.type} Report
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Risk Level:</span>
              <RiskTierBadge tier={item.riskTier} />
            </div>
          </div>

          {/* Right: Details & CTAs */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-forest-700 uppercase">
                  ID: {item.id}
                </span>
                <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-0.5">
                  {item.title}
                </h1>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {item.brand && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-900 border border-forest-200">
                  Brand: {item.brand}
                </span>
              )}
              {item.color && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-900 border border-forest-200">
                  Color: {item.color}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 capitalize">
                {item.category.replace('_', ' ')}
              </span>
            </div>

            {/* Location & Time */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                <span>{item.locationName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {new Date(item.incidentDate).toLocaleDateString([], {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  {item.approximateTime && `at ${item.approximateTime}`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Public Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {item.publicDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {existingHandover ? (
                <button
                  onClick={() => onOpenHandover(item.id)}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-md flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Open Safe Handover Room</span>
                </button>
              ) : item.type === 'found' && !isReporter ? (
                <button
                  onClick={() => onOpenClaimChallenge(item)}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-lime-400" />
                  <span>Initiate Zero-Knowledge Claim</span>
                </button>
              ) : isReporter ? (
                <div className="p-3 rounded-2xl bg-forest-50 border border-forest-200 text-xs text-forest-800 font-semibold text-center">
                  ✓ You reported this item. FYND matching engine is actively scanning.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sealed Evidence (Only Owner or Moderator) */}
        {privateEvidence && (
          <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-3 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-lime-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Sealed Private Evidence (Zero-Knowledge)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-lime-300">
                {isModerator ? 'Moderator View' : 'Reporter Private View'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              This data is strictly isolated on the backend. Claimants must supply matching evidence without seeing these values.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {privateEvidence.serialNumber && (
                <div className="p-3 rounded-xl bg-black/40 border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Protected Serial/IMEI</div>
                  <div className="font-mono text-xs text-lime-400 font-bold mt-0.5">{privateEvidence.serialNumber}</div>
                </div>
              )}

              {privateEvidence.finderPrivateNotes && (
                <div className="p-3 rounded-xl bg-black/40 border border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Confidential Notes</div>
                  <div className="text-xs text-slate-200 mt-0.5">{privateEvidence.finderPrivateNotes}</div>
                </div>
              )}
            </div>

            {privateEvidence.secretQuestions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-300">Challenge Questions:</div>
                {privateEvidence.secretQuestions.map((q, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-xs">
                    <div className="text-slate-300 font-medium">Q: {q.prompt}</div>
                    <div className="text-lime-300 font-bold mt-0.5">Answer: {q.expectedAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Potential Matches */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-700" />
              <h3 className="font-display font-bold text-base text-slate-900">Potential Match Candidates</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {matches.length} candidate{matches.length === 1 ? '' : 's'}
            </span>
          </div>

          {matches.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No matching records detected yet. FYND will notify you automatically.
            </p>
          ) : (
            <div className="space-y-2.5">
              {matches.map((m) => {
                const oppositeId = m.lostItemId === item.id ? m.foundItemId : m.lostItemId;
                const candidate = items.find((i) => i.id === oppositeId);
                if (!candidate) return null;

                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.imageUrls[0]}
                        alt={candidate.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <MatchBadge score={m.score} classification={m.classification} />
                          <span className="text-xs text-slate-500 capitalize">• {candidate.type}</span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-slate-900 mt-0.5">{candidate.title}</h4>
                        <div className="text-[11px] text-slate-500">
                          {candidate.locationName} • {candidate.color || candidate.brand || ''}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCandidateItem(candidate)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Compare</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
