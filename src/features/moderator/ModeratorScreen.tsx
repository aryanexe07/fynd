import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Claim, Item } from '../../types';
import {
  Shield,
  CheckCircle,
  XCircle,
  History,
  Lock,
  ArrowRight
} from 'lucide-react';
import { StatusBadge, RiskTierBadge } from '../../components/common/Badge';

interface ModeratorScreenProps {
  onSelectItem: (item: Item) => void;
  onOpenHandover: (itemId: string) => void;
}

export const ModeratorScreen: React.FC<ModeratorScreenProps> = ({ onSelectItem, onOpenHandover }) => {
  const {
    claims,
    items,
    privateEvidences,
    moderatorReviewClaim,
    auditLogs,
    handovers,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'claims' | 'handovers' | 'audit'>('claims');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const escalatedClaims = claims.filter(
    (c) => c.status === 'escalated' || c.status === 'pending_verification'
  );

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || escalatedClaims[0];
  const targetItem = selectedClaim ? items.find((i) => i.id === selectedClaim.foundItemId) : null;
  const targetEvidence = selectedClaim ? privateEvidences[selectedClaim.foundItemId] : null;

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold border border-rose-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl text-slate-900">Campus Safety Desk</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                Staff View
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluate high-risk claims, verify private evidence, and authorize return handovers.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#eef1f4] p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'claims' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims ({escalatedClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'handovers' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Handovers ({handovers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'audit' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Queue */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">
              Pending Queue
            </h3>

            {escalatedClaims.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white text-center border border-slate-200/80 text-xs text-slate-400 shadow-soft">
                <CheckCircle className="w-8 h-8 text-[#22a36b] mx-auto mb-2" />
                No escalated claims currently pending review.
              </div>
            ) : (
              escalatedClaims.map((claim) => {
                const item = items.find((i) => i.id === claim.foundItemId);
                const isSelected = selectedClaim?.id === claim.id;

                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`p-4 rounded-3xl bg-white border shadow-soft cursor-pointer transition-all ${
                      isSelected ? 'border-[#22a36b] bg-[#e8f7ee]/30 ring-1 ring-[#22a36b]' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{claim.id}</span>
                      <RiskTierBadge tier={claim.riskTier} />
                    </div>

                    <h4 className="font-display font-extrabold text-sm text-slate-900 truncate">
                      {item?.title || 'Item'}
                    </h4>

                    <div className="text-xs text-slate-600 mt-1">
                      Claimant: <span className="font-bold text-slate-900">{claim.claimantName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Terminal */}
          <div className="lg:col-span-8">
            {selectedClaim && targetItem ? (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-[#22a36b] uppercase tracking-wider">
                      Evidence Comparison
                    </span>
                    <h2 className="font-display font-extrabold text-lg text-slate-900 mt-0.5">
                      {targetItem.title}
                    </h2>
                  </div>
                  <RiskTierBadge tier={targetItem.riskTier} />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Claimant */}
                  <div className="p-4 rounded-2xl bg-[#f5f6f8] border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">Claimant Submission</div>
                    <div className="space-y-2">
                      {Object.entries(selectedClaim.submittedAnswers).map(([k, ans], i) => (
                        <div key={k} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Answer #{i + 1}</div>
                          <div className="text-slate-900 font-medium">{ans}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ground Truth */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="text-xs font-bold text-[#34d399]">Stored Ground Truth</div>
                    {targetEvidence?.serialNumber && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs">
                        <div className="text-[10px] text-slate-300 uppercase">Serial / IMEI</div>
                        <div className="font-mono text-[#34d399] font-bold">{targetEvidence.serialNumber}</div>
                      </div>
                    )}
                    {targetEvidence?.secretQuestions.map((q, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs">
                        <div className="text-[10px] text-slate-300">Q: {q.prompt}</div>
                        <div className="text-[#34d399] font-bold mt-0.5">True: {q.expectedAnswer}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes & Actions */}
                <div className="space-y-3 pt-2">
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter decision notes..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#22a36b] resize-none font-medium"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'approve', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="btn-emerald-cta px-6 py-2.5 text-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Claim & Authorize Handover</span>
                    </button>

                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'reject', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white text-center border border-slate-200/80 text-slate-400 text-xs shadow-soft">
                Select a claim from the left to inspect evidence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Handovers */}
      {activeTab === 'handovers' && (
        <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200/80 shadow-soft">
          <h3 className="font-display font-extrabold text-base text-slate-900">Active Handover Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Item</th>
                  <th>Location</th>
                  <th>OTP Code</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {handovers.map((h) => {
                  const item = items.find((i) => i.id === h.itemId);
                  return (
                    <tr key={h.id} className="text-slate-800">
                      <td className="py-3 font-semibold text-slate-900">{item?.title}</td>
                      <td>{h.locationName}</td>
                      <td className="font-mono text-[#22a36b] font-bold">{h.handoverCode}</td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f7ee] text-[#22a36b]">
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => onOpenHandover(h.itemId)}
                          className="btn-emerald-cta px-3.5 py-1 text-xs"
                        >
                          Open Room
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 space-y-3 border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#22a36b]" />
            <h3 className="font-display font-extrabold text-base text-slate-900">Platform Audit Trail</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900">{log.action}</span>
                  <span className="text-slate-500"> • By {log.actorName}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

