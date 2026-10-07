import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  FolderCheck,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Plus,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

interface MyCasesScreenProps {
  onSelectItem: (item: Item) => void;
  onOpenHandover: (itemId: string) => void;
  openReportModal: (type: 'lost' | 'found') => void;
}

export const MyCasesScreen: React.FC<MyCasesScreenProps> = ({
  onSelectItem,
  onOpenHandover,
  openReportModal,
}) => {
  const { currentUser, items, claims, handovers, matches } = useAppState();
  const [activeTab, setActiveTab] = useState<'my_reports' | 'my_claims' | 'handovers' | 'recovered'>('my_reports');

  const myLostItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'lost' && i.status !== 'recovered');
  const myFoundItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'found' && i.status !== 'recovered');
  const myReports = [...myLostItems, ...myFoundItems];

  const myClaims = claims.filter((c) => c.claimantId === currentUser.uid);
  const myHandovers = handovers.filter(
    (h) => h.claimantId === currentUser.uid || h.finderId === currentUser.uid
  );
  const myRecovered = items.filter(
    (i) => i.status === 'recovered' && (i.reporterId === currentUser.uid || claims.some((c) => c.foundItemId === i.id && c.claimantId === currentUser.uid))
  );

  return (
    <div className="max-w-3xl mx-auto pb-32 space-y-6 animate-fade-in">
      {/* 1. Header: Cases & Recovery Vault */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center font-bold shrink-0">
              <FolderCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                My Cases & Recovery Vault
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your reported items, track ownership claims, and verify physical handovers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openReportModal('lost')}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-[#f5f6f8] hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => openReportModal('found')}
              className="btn-emerald-cta px-4 py-2 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Found</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Reports
            </span>
            <span className="font-display font-black text-xl text-slate-900 mt-0.5 block">
              {myReports.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#e8f7ee] border border-[#22a36b]/30 text-center">
            <span className="text-[10px] font-bold text-[#22a36b] uppercase tracking-wider block">
              Active Claims
            </span>
            <span className="font-display font-black text-xl text-[#22a36b] mt-0.5 block">
              {myClaims.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 text-white text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recovered
            </span>
            <span className="font-display font-black text-xl text-[#34d399] mt-0.5 block">
              {myRecovered.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Segmented Navigation Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center bg-[#eef1f4] p-1 rounded-full border border-slate-200/80 shrink-0">
          <button
            onClick={() => setActiveTab('my_reports')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'my_reports'
                ? 'bg-[#22a36b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Reports ({myReports.length})
          </button>
          <button
            onClick={() => setActiveTab('my_claims')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'my_claims'
                ? 'bg-[#22a36b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims in Progress ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'handovers'
                ? 'bg-[#22a36b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Handovers ({myHandovers.length})
          </button>
          <button
            onClick={() => setActiveTab('recovered')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'recovered'
                ? 'bg-[#22a36b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recovered Archive ({myRecovered.length})
          </button>
        </div>
      </div>

      {/* Tab 1: My Reports */}
      {activeTab === 'my_reports' && (
        <div className="space-y-3">
          {myReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-full bg-[#f5f6f8] text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-base text-slate-800">
                No active reports filed
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Have you lost an item or found someone's property? Create a secure campus report to start automated matching.
              </p>
              <button
                onClick={() => openReportModal('lost')}
                className="btn-emerald-cta px-6 py-2.5 text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Report Lost Item</span>
              </button>
            </div>
          ) : (
            myReports.map((item) => {
              const itemMatches = matches.filter((m) => m.lostItemId === item.id || m.foundItemId === item.id);
              const topMatch = itemMatches[0];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#f4f5f7] p-2 flex items-center justify-center shrink-0 border border-slate-100">
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            item.type === 'lost' ? 'bg-amber-400 text-slate-950' : 'bg-[#22a36b] text-white'
                          }`}
                        >
                          {item.type}
                        </span>
                        <StatusBadge status={item.status} />
                        <RiskTierBadge tier={item.riskTier} />
                      </div>

                      <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-[#22a36b] transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#22a36b]" />
                          {item.locationName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.incidentDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {topMatch ? (
                      <div className="flex items-center gap-2 bg-[#e8f7ee] px-3 py-1.5 rounded-2xl border border-[#22a36b]/30">
                        <Sparkles className="w-4 h-4 text-[#22a36b]" />
                        <span className="text-xs font-bold text-[#22a36b]">
                          {topMatch.score}% Match Ready
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        Active Monitoring
                      </span>
                    )}

                    <div className="w-9 h-9 rounded-full bg-[#f5f6f8] text-slate-700 flex items-center justify-center group-hover:bg-[#22a36b] group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Claims in Progress */}
      {activeTab === 'my_claims' && (
        <div className="space-y-3">
          {myClaims.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-full bg-[#f5f6f8] text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-base text-slate-800">
                No claims currently in progress
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                When you find an item in the directory that belongs to you, submit a zero-knowledge claim to verify ownership.
              </p>
            </div>
          ) : (
            myClaims.map((claim) => {
              const targetItem = items.find((i) => i.id === claim.foundItemId);
              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        CLAIM REF: {claim.id}
                      </span>
                      <h4 className="font-display font-extrabold text-base text-slate-900 mt-0.5">
                        {targetItem?.title || 'Found Item'}
                      </h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        claim.status === 'approved' || claim.status === 'passed'
                          ? 'bg-[#e8f7ee] text-[#22a36b] border border-[#22a36b]/30'
                          : claim.status === 'escalated'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {claim.status === 'passed'
                        ? 'Verification Passed'
                        : claim.status === 'escalated'
                        ? 'Under Moderator Review'
                        : claim.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-[#f9fafb] p-3 rounded-2xl border border-slate-100">
                    {claim.status === 'passed'
                      ? 'Your ownership answers were validated! You may now open the Safe Handover Station.'
                      : claim.status === 'escalated'
                      ? 'High-value item verification is being reviewed by Campus Safety Desk staff.'
                      : 'Verification challenge in evaluation.'}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {targetItem && (
                      <button
                        onClick={() => onSelectItem(targetItem)}
                        className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        Inspect Item
                      </button>
                    )}
                    {(claim.status === 'passed' || claim.status === 'approved') && targetItem && (
                      <button
                        onClick={() => onOpenHandover(targetItem.id)}
                        className="btn-emerald-cta px-5 py-2 text-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Open Handover (OTP)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Handovers */}
      {activeTab === 'handovers' && (
        <div className="space-y-3">
          {myHandovers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-full bg-[#f5f6f8] text-slate-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-base text-slate-800">
                No active handover sessions
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Physical meetups and Safe Desk collections generate a secure 6-digit OTP code to confirm item return.
              </p>
            </div>
          ) : (
            myHandovers.map((h) => {
              const item = items.find((i) => i.id === h.itemId);
              return (
                <div
                  key={h.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center font-bold shrink-0">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-base text-slate-900">
                        {item?.title || 'Handover Item'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#22a36b]" />
                        <span>{h.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        OTP Code
                      </span>
                      <span className="font-mono font-black text-sm text-[#34d399]">
                        {h.handoverCode}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenHandover(h.itemId)}
                      className="btn-emerald-cta px-5 py-2.5 text-xs"
                    >
                      <span>Enter Room</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 4: Recovered Archive */}
      {activeTab === 'recovered' && (
        <div className="space-y-3">
          {myRecovered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-full bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-base text-slate-800">
                No resolved cases yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Completed handovers will be archived here with permanent tamper-proof audit logs.
              </p>
            </div>
          ) : (
            myRecovered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-base text-slate-900">{item.title}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Recovered at {item.locationName}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#22a36b] bg-[#e8f7ee] px-3 py-1 rounded-full border border-[#22a36b]/30">
                  Returned ✓
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
