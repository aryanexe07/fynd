import React from 'react';
import { ItemStatus, RiskTier, MatchClassification } from '../../types';

export const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const config: Record<ItemStatus, { label: string; bg: string; text: string; border: string }> = {
    active: { label: 'Active Listing', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    matched: { label: 'Match Detected', bg: 'bg-lime-500/15', text: 'text-lime-400', border: 'border-lime-500/30' },
    claim_pending: { label: 'Claim In Review', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
    verification: { label: 'Verifying', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
    handover_pending: { label: 'Handover Ready', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
    recovered: { label: 'Recovered ✓', bg: 'bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-400/50' },
    expired: { label: 'Expired', bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
    disputed: { label: 'Disputed', bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/40' },
    draft: { label: 'Draft', bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
  };

  const item = config[status] || config.active;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.bg} ${item.text} ${item.border} backdrop-blur-sm`}
    >
      {item.label}
    </span>
  );
};

export const RiskTierBadge: React.FC<{ tier: RiskTier }> = ({ tier }) => {
  if (tier === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        Tier 3: High-Value
      </span>
    );
  }
  if (tier === 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
        Tier 2: Personal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 text-slate-300 border border-slate-500/30">
      Tier 1: Standard
    </span>
  );
};

export const MatchBadge: React.FC<{ score: number; classification?: MatchClassification }> = ({ score, classification }) => {
  let color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let label = 'Strong Match';

  if (score >= 70 || classification === 'strong') {
    color = 'bg-lime-500/20 text-lime-300 border-lime-500/50 shadow-glow-lime';
    label = 'Strong Match';
  } else if (score >= 45 || classification === 'possible') {
    color = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    label = 'Possible Match';
  } else {
    color = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    label = 'Weak Match';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      {score}% • {label}
    </span>
  );
};
