import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import { StatusBadge, RiskTierBadge } from '../../components/common/Badge';
import {
  Sparkles,
  KeyRound,
  CheckCircle2,
  MapPin
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
    <div className="space-y-5 pb-24 max-w-5xl mx-auto animate-fade-in">
      {/* Profile summary card */}
      <div className="card-clean p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-forest-900 text-lime-400 font-display font-black text-xl flex items-center justify-center shadow-md">
            {currentUser.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl text-slate-900">{currentUser.displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 text-forest-900 border border-lime-300">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.department} • Trust Rating: <span className="text-forest-700 font-bold">{currentUser.recoveryRating}%</span>
            </p>
          </div>
        </div>

        {/* Segmented Filter Bar */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'lost' ? 'bg-forest-900 text-lime-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lost ({myLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'found' ? 'bg-forest-900 text-lime-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Found ({myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'claims' ? 'bg-forest-900 text-lime-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('recovered')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'recovered' ? 'bg-forest-900 text-lime-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recovered ({myRecovered.length})
          </button>
        </div>
      </div>

      {/* Lost Reports */}
      {activeTab === 'lost' && (
        <div className="space-y-3">
          {myLostItems.length === 0 ? (
            <div className="card-clean p-12 text-center">
              <h4 className="font-display font-bold text-base text-slate-800">No active lost reports</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">Did you misplace an item on campus?</p>
              <button
                onClick={() => openReportModal('lost')}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400"
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
                    className="card-clean p-4 cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-2xl object-cover" />
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">{item.title}</h4>
                        <div className="text-xs text-slate-500">{item.locationName}</div>
                      </div>
                    </div>

                    {itemMatches.length > 0 && (
                      <div className="p-2.5 rounded-2xl bg-lime-50 border border-lime-300 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-forest-900 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                          <span>{itemMatches[0].score}% Match Found</span>
                        </div>
                        <span className="text-xs font-bold text-forest-800">Review →</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Found Reports */}
      {activeTab === 'found' && (
        <div className="space-y-3">
          {myFoundItems.length === 0 ? (
            <div className="card-clean p-12 text-center">
              <h4 className="font-display font-bold text-base text-slate-800">No active found reports</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">Did you find an item on campus?</p>
              <button
                onClick={() => openReportModal('found')}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400"
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
                  className="card-clean p-4 cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900">{item.title}</h4>
                      <div className="text-xs text-slate-500">{item.locationName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-3">
          {myClaims.length === 0 ? (
            <div className="card-clean p-12 text-center">
              <h4 className="font-display font-bold text-base text-slate-800">No claims submitted</h4>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myClaims.map((claim) => {
                const foundItem = items.find((i) => i.id === claim.foundItemId);
                const handover = handovers.find((h) => h.claimId === claim.id);

                return (
                  <div
                    key={claim.id}
                    className="card-clean p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-forest-800">Claim ID: {claim.id}</span>
                        <RiskTierBadge tier={claim.riskTier} />
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-900 mt-0.5">
                        {foundItem?.title || 'Claimed Item'}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Status: <span className="font-bold text-slate-800 capitalize">{claim.status}</span>
                      </div>
                    </div>

                    {handover && (
                      <button
                        onClick={() => onOpenHandover(claim.foundItemId)}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-forest-900 text-lime-400 flex items-center justify-center gap-1.5 shadow-sm"
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

      {/* Recovered */}
      {activeTab === 'recovered' && (
        <div className="space-y-3">
          {myRecovered.length === 0 ? (
            <div className="card-clean p-12 text-center">
              <h4 className="font-display font-bold text-base text-slate-800">No completed recoveries yet</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRecovered.map((item) => (
                <div key={item.id} className="card-clean p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status="recovered" />
                    <span className="text-xs text-emerald-600 font-bold">Successfully Returned ✓</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900">{item.title}</h4>
                  <div className="text-xs text-slate-500">{item.locationName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
