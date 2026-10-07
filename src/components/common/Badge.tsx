import React from 'react';
import { ItemStatus, RiskTier, MatchClassification } from '../../types';

export const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const config: Record<ItemStatus, { label: string; bg: string; text: string; border: string }> = {
    active: { label: 'Active', bg: 'bg-forest-100', text: 'text-forest-700', border: 'border-forest-200' },
    matched: { label: 'Match Found', bg: 'bg-lime-100', text: 'text-lime-700 font-bold', border: 'border-lime-300' },
    claim_pending: { label: 'In Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    verification: { label: 'Verifying', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    handover_pending: { label: 'Handover Ready', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    recovered: { label: 'Recovered ✓', bg: 'bg-emerald-100', text: 'text-emerald-800 font-bold', border: 'border-emerald-300' },
    expired: { label: 'Expired', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    disputed: { label: 'Disputed', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  };

  const item = config[status] || config.active;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${item.bg} ${item.text} ${item.border}`}
    >
      {item.label}
    </span>
  );
};

export const RiskTierBadge: React.FC<{ tier: RiskTier }> = ({ tier }) => {
  if (tier === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        High-Value
      </span>
    );
  }
  if (tier === 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Personal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
      Standard
    </span>
  );
};

export const MatchBadge: React.FC<{ score: number; classification?: MatchClassification }> = ({ score, classification }) => {
  let bg = 'bg-lime-100 text-forest-900 border-lime-300';
  let label = 'Strong Match';

  if (score >= 70 || classification === 'strong') {
    bg = 'bg-lime-200 text-forest-900 border-lime-400 font-extrabold';
    label = 'Strong Match';
  } else if (score >= 45 || classification === 'possible') {
    bg = 'bg-amber-100 text-amber-800 border-amber-300';
    label = 'Possible Match';
  } else {
    bg = 'bg-slate-100 text-slate-600 border-slate-200';
    label = 'Weak Match';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-forest-900 animate-pulse" />
      {score}% Match
    </span>
  );
};
