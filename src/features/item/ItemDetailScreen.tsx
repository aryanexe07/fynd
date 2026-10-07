import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, MatchRecord } from '../../types';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Calendar,
  Clock,
  User,
  Sparkles,
  Lock,
  Eye,
  CheckCircle,
  HelpCircle,
  FileText,
  KeyRound,
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

  const matches = getMatchesForItem(item.id);
  const privateEvidence = getPrivateEvidence(item.id);
  const isReporter = item.reporterId === currentUser.uid;
  const isModerator = currentUser.role === 'moderator';

  // Check if there is an active handover for this item
  const existingHandover = handovers.find((h) => h.itemId === item.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-lime-400" />
        <span>Back to Directory</span>
      </button>

      {/* Main Item Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Item Image Gallery */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/20 relative shadow-2xl">
              <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                  }`}
                >
                  {item.type} Report
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Risk Classification:</span>
              <RiskTierBadge tier={item.riskTier} />
            </div>
          </div>

          {/* Core Information */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Case ID: {item.id}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                  {item.title}
                </h1>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Brand & Attribute Row */}
            <div className="flex flex-wrap gap-2 pt-1">
              {item.brand && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  Brand: {item.brand}
                </span>
              )}
              {item.color && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  Color: {item.color}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 capitalize">
                {item.category.replace('_', ' ')}
              </span>
            </div>

            {/* Location & Time Pills */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-emerald-500/15">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-lime-400 shrink-0" />
                <span className="font-semibold">{item.locationName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
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
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Public Description
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/10">
                {item.publicDescription}
              </p>
            </div>

            {/* CTA Buttons based on Role & State */}
            <div className="pt-2">
              {existingHandover ? (
                <button
                  onClick={() => onOpenHandover(item.id)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Open Safe Handover Room</span>
                </button>
              ) : item.type === 'found' && !isReporter ? (
                <button
                  onClick={() => onOpenClaimChallenge(item)}
                  className="w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Initiate Zero-Knowledge Claim</span>
                </button>
              ) : isReporter ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 text-center font-medium">
                  ✓ You are the reporter of this case. FYND matching engine is actively scanning.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Zero-Knowledge Private Evidence Panel (Visible ONLY to Owner or Moderator) */}
        {privateEvidence && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-emerald-950/40 to-slate-950 p-5 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Sealed Private Evidence (Zero-Knowledge Stored)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                {isModerator ? 'Moderator Access' : 'Reporter Private View'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              This evidence is never exposed to claimants. Incoming claims must supply matching proof to be accepted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {privateEvidence.serialNumber && (
                <div className="p-3 rounded-xl bg-black/50 border border-purple-500/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Protected Serial/IMEI</div>
                  <div className="font-mono text-xs text-lime-400 mt-0.5">{privateEvidence.serialNumber}</div>
                </div>
              )}

              {privateEvidence.finderPrivateNotes && (
                <div className="p-3 rounded-xl bg-black/50 border border-purple-500/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Confidential Notes</div>
                  <div className="text-xs text-slate-200 mt-0.5">{privateEvidence.finderPrivateNotes}</div>
                </div>
              )}
            </div>

            {privateEvidence.secretQuestions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-purple-300">Stored Challenge Verification Facts:</div>
                {privateEvidence.secretQuestions.map((q, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-purple-500/15 text-xs">
                    <div className="text-slate-300 font-medium">Q: {q.prompt}</div>
                    <div className="text-lime-300 font-bold mt-1">Expected: {q.expectedAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matching Engine Relationship Section */}
        <div className="border-t border-emerald-500/20 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" />
              <h3 className="font-display font-bold text-lg text-white">Potential Match Intelligence</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {matches.length} candidate match{matches.length === 1 ? '' : 'es'}
            </span>
          </div>

          {matches.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">
              No matching records detected yet. FYND engine will notify both parties automatically upon match discovery.
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const oppositeId = m.lostItemId === item.id ? m.foundItemId : m.lostItemId;
                const candidate = items.find((i) => i.id === oppositeId);
                if (!candidate) return null;

                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl glass-card border border-lime-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={candidate.imageUrls[0]}
                        alt={candidate.title}
                        className="w-16 h-16 rounded-xl object-cover border border-emerald-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <MatchBadge score={m.score} classification={m.classification} />
                          <span className="text-xs text-slate-400 capitalize">• {candidate.type}</span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-white mt-1">{candidate.title}</h4>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {candidate.locationName} • {candidate.color || candidate.brand || 'No brand'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onSelectCandidateItem(candidate)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 flex items-center justify-center gap-1 shadow-md"
                      >
                        <span>Compare Candidate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
