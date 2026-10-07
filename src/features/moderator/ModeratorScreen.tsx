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
    <div className="space-y-5 pb-24 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card-clean p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold border border-rose-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl text-slate-900">Campus Safety Desk</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                Staff View
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluate high-risk claims, verify private evidence, and approve returns.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'claims' ? 'bg-forest-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims ({escalatedClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'handovers' ? 'bg-forest-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Handovers ({handovers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'audit' ? 'bg-forest-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Queue */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider">
              Pending Queue
            </h3>

            {escalatedClaims.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white text-center border border-slate-200 text-xs text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
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
                    className={`p-4 rounded-2xl card-clean cursor-pointer transition-all ${
                      isSelected ? 'border-forest-600 bg-forest-50/50' : 'hover:border-forest-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-500">{claim.id}</span>
                      <RiskTierBadge tier={claim.riskTier} />
                    </div>

                    <h4 className="font-display font-bold text-sm text-slate-900 truncate">
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
              <div className="card-clean p-6 space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-forest-700 uppercase">
                      Evidence Comparison
                    </span>
                    <h2 className="font-display font-bold text-lg text-slate-900 mt-0.5">
                      {targetItem.title}
                    </h2>
                  </div>
                  <RiskTierBadge tier={targetItem.riskTier} />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Claimant */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">Claimant Submission</div>
                    <div className="space-y-1.5">
                      {Object.entries(selectedClaim.submittedAnswers).map(([k, ans], i) => (
                        <div key={k} className="p-2 rounded-xl bg-white border border-slate-200 text-xs">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Answer #{i + 1}</div>
                          <div className="text-slate-900 font-medium">{ans}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ground Truth */}
                  <div className="p-4 rounded-2xl bg-forest-900 text-white space-y-2">
                    <div className="text-xs font-bold text-lime-400">Stored Ground Truth</div>
                    {targetEvidence?.serialNumber && (
                      <div className="p-2 rounded-xl bg-black/40 border border-white/20 text-xs">
                        <div className="text-[10px] text-slate-300 uppercase">Serial / IMEI</div>
                        <div className="font-mono text-lime-400 font-bold">{targetEvidence.serialNumber}</div>
                      </div>
                    )}
                    {targetEvidence?.secretQuestions.map((q, i) => (
                      <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/20 text-xs">
                        <div className="text-[10px] text-slate-300">Q: {q.prompt}</div>
                        <div className="text-lime-300 font-bold mt-0.5">True: {q.expectedAnswer}</div>
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
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-forest-600 resize-none font-medium"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'approve', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Claim & Authorize Handover</span>
                    </button>

                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'reject', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white text-center border border-slate-200 text-slate-400 text-xs">
                Select a claim from the left to inspect evidence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Handovers */}
      {activeTab === 'handovers' && (
        <div className="card-clean p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">Active Handover Sessions</h3>
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
                      <td className="font-mono text-forest-700 font-bold">{h.handoverCode}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-forest-900">
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => onOpenHandover(h.itemId)}
                          className="px-3 py-1 rounded-full bg-forest-900 text-lime-400 text-xs font-bold"
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
        <div className="card-clean p-6 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-forest-700" />
            <h3 className="font-display font-bold text-base text-slate-900">Platform Audit Trail</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-forest-900">{log.action}</span>
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
