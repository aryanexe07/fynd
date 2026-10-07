import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import { StatusBadge, RiskTierBadge, MatchBadge } from '../../components/common/Badge';
import {
  FolderCheck,
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
  HelpCircle
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
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'claims' | 'recovered'>('lost');

  const myLostItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'lost' && i.status !== 'recovered');
  const myFoundItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'found' && i.status !== 'recovered');
  const myClaims = claims.filter((c) => c.claimantId === currentUser.uid);
  const myRecovered = items.filter(
    (i) => i.status === 'recovered' && (i.reporterId === currentUser.uid || claims.some((c) => c.foundItemId === i.id && c.claimantId === currentUser.uid))
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header Profile Summary */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 flex items-center justify-center font-display font-extrabold text-xl shadow-glow-lime">
            {currentUser.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl text-white">{currentUser.displayName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-400 border border-lime-400/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.department} • Trust Rating: <span className="text-lime-400 font-bold">{currentUser.recoveryRating}%</span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-emerald-500/20">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lost' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Lost ({myLostItems.length})
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'found' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Found ({myFoundItems.length})
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'claims' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Claims ({myClaims.length})
          </button>

          <button
            onClick={() => setActiveTab('recovered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'recovered' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recovered ({myRecovered.length})
          </button>
        </div>
      </div>

      {/* Lost Reports Tab */}
      {activeTab === 'lost' && (
        <div className="space-y-4">
          {myLostItems.length === 0 ? (
            <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
              <h4 className="font-display font-bold text-lg text-white">No active lost reports</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Have you misplaced something on campus?</p>
              <button
                onClick={() => openReportModal('lost')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950"
              >
                Report Lost Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLostItems.map((item) => {
                const itemMatches = matches.filter((m) => m.lostItemId === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="p-5 rounded-2xl glass-card border border-emerald-500/25 hover:border-lime-400/50 cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
                        <div className="text-xs text-slate-400">{item.locationName}</div>
                      </div>
                    </div>

                    {itemMatches.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-lime-300 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{itemMatches[0].score}% Match Found</span>
                        </div>
                        <span className="text-xs font-bold text-lime-400">Review →</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Found Reports Tab */}
      {activeTab === 'found' && (
        <div className="space-y-4">
          {myFoundItems.length === 0 ? (
            <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
              <h4 className="font-display font-bold text-lg text-white">No active found reports</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Did you find an item on campus?</p>
              <button
                onClick={() => openReportModal('found')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950"
              >
                Report Found Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFoundItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="p-5 rounded-2xl glass-card border border-emerald-500/25 hover:border-lime-400/50 cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
                      <div className="text-xs text-slate-400">{item.locationName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
              <h4 className="font-display font-bold text-lg text-white">No claims submitted</h4>
              <p className="text-xs text-slate-400 mt-1">When you claim a found item, track the verification here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myClaims.map((claim) => {
                const foundItem = items.find((i) => i.id === claim.foundItemId);
                const handover = handovers.find((h) => h.claimId === claim.id);

                return (
                  <div
                    key={claim.id}
                    className="p-5 rounded-2xl glass-card border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-lime-400">Claim ID: {claim.id}</span>
                        <RiskTierBadge tier={claim.riskTier} />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mt-1">
                        {foundItem?.title || 'Claimed Item'}
                      </h4>
                      <div className="text-xs text-slate-300 mt-0.5">
                        Status: <span className="font-bold text-white capitalize">{claim.status}</span>
                      </div>
                    </div>

                    {handover && (
                      <button
                        onClick={() => onOpenHandover(claim.foundItemId)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-lime-400 text-slate-950 flex items-center justify-center gap-2 shadow-glow-lime"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Open Handover Code</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recovered Tab */}
      {activeTab === 'recovered' && (
        <div className="space-y-4">
          {myRecovered.length === 0 ? (
            <div className="rounded-2xl glass-card p-12 text-center border border-emerald-500/20">
              <h4 className="font-display font-bold text-lg text-white">No completed recoveries yet</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRecovered.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status="recovered" />
                    <span className="text-xs text-emerald-400 font-bold">Successfully Returned ✓</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
                  <div className="text-xs text-slate-400">{item.locationName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
