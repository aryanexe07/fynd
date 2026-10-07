import React from 'react';
import { ItemStatus, RiskTier, MatchClassification } from '../../types';

export const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const config: Record<ItemStatus, { label: string; bg: string; text: string; border: string }> = {
    active: { label: 'Active', bg: 'bg-[#e8f7ee]', text: 'text-[#22a36b] font-bold', border: 'border-[#22a36b]/30' },
    matched: { label: 'Match Found', bg: 'bg-[#e8f7ee]', text: 'text-[#22a36b] font-extrabold', border: 'border-[#22a36b]' },
    claim_pending: { label: 'In Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    verification: { label: 'Verifying', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    handover_pending: { label: 'Handover Ready', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    recovered: { label: 'Recovered', bg: 'bg-[#e8f7ee]', text: 'text-[#22a36b] font-bold', border: 'border-[#22a36b]' },
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
  let bg = 'bg-[#e8f7ee] text-[#22a36b] border-[#22a36b]/40';

  if (score >= 70 || classification === 'strong') {
    bg = 'bg-[#e8f7ee] text-[#22a36b] border-[#22a36b] font-extrabold shadow-soft';
  } else if (score >= 45 || classification === 'possible') {
    bg = 'bg-amber-50 text-amber-800 border-amber-300';
  } else {
    bg = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#22a36b] animate-pulse" />
      {score}% Match
    </span>
  );
};

