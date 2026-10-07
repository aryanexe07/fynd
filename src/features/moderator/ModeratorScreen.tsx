import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Claim, Item } from '../../types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  Layers,
  History,
  AlertTriangle
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
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-rose-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/40">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-white">Campus Safety Moderator Desk</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Staff Portal
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Review high-risk claims, evaluate ownership evidence, and authorize physical handovers.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-rose-500/20">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'claims'
                ? 'bg-rose-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Escalated Claims ({escalatedClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'handovers'
                ? 'bg-rose-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Handovers ({handovers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-rose-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Claims Queue List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">
              Pending Queue
            </h3>

            {escalatedClaims.length === 0 ? (
              <div className="p-8 rounded-2xl glass-card text-center border border-emerald-500/20 text-xs text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
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
                    className={`p-4 rounded-2xl glass-card border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500/60 bg-rose-950/30'
                        : 'border-emerald-500/20 hover:border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-rose-400">{claim.id}</span>
                      <RiskTierBadge tier={claim.riskTier} />
                    </div>

                    <h4 className="font-display font-bold text-sm text-white truncate">
                      {item?.title || 'Unknown Item'}
                    </h4>

                    <div className="text-xs text-slate-300 mt-1">
                      Claimant: <span className="font-semibold text-white">{claim.claimantName}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 pt-2 border-t border-emerald-500/10">
                      <span>Status: {claim.status}</span>
                      <span className="text-rose-400 font-semibold">Review →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Inspection Terminal */}
          <div className="lg:col-span-8">
            {selectedClaim && targetItem ? (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-rose-500/30 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Side-by-Side Evidence Verification
                    </span>
                    <h2 className="font-display font-bold text-xl text-white mt-0.5">
                      {targetItem.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Found at: {targetItem.locationName}
                    </p>
                  </div>
                  <RiskTierBadge tier={targetItem.riskTier} />
                </div>

                {/* Evidence Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Claimant Submission */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">Claimant Submitted Proof</span>
                      <span className="text-[10px] text-slate-400">{selectedClaim.claimantName}</span>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(selectedClaim.submittedAnswers).map(([k, ans], i) => (
                        <div key={k} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
                          <div className="text-[10px] uppercase text-slate-400 font-semibold">Answer #{i + 1}</div>
                          <div className="text-slate-100 font-medium mt-0.5">{ans}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stored Private Evidence */}
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">Protected Ground Truth</span>
                      <span className="text-[10px] text-purple-400">Reporter / Safe Desk</span>
                    </div>

                    {targetEvidence?.serialNumber && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 text-xs">
                        <div className="text-[10px] uppercase text-purple-400 font-semibold">Serial / IMEI</div>
                        <div className="font-mono text-lime-400">{targetEvidence.serialNumber}</div>
                      </div>
                    )}

                    {targetEvidence?.secretQuestions.map((q, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 text-xs">
                        <div className="text-[10px] text-slate-400 font-semibold">Q: {q.prompt}</div>
                        <div className="text-lime-300 font-bold mt-0.5">True: {q.expectedAnswer}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderator Decision Box */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Official Decision Notes / Meeting Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter notes (e.g. Serial numbers verified against student ID. Proceed to Safety Office Room 102)."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-rose-400 resize-none"
                  />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'approve', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 flex items-center gap-1.5 shadow-glow-lime"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Claim & Authorize Handover</span>
                    </button>

                    <button
                      onClick={() => {
                        moderatorReviewClaim(selectedClaim.id, 'reject', reviewNotes);
                        setSelectedClaimId(null);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Claim</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl glass-card text-center border border-emerald-500/20 text-slate-400 text-xs">
                Select an escalated claim from the queue on the left to inspect evidence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Handover Table */}
      {activeTab === 'handovers' && (
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/25 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Active Handover Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-emerald-500/20 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Item</th>
                  <th>Location</th>
                  <th>OTP Code</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {handovers.map((h) => {
                  const item = items.find((i) => i.id === h.itemId);
                  return (
                    <tr key={h.id} className="text-slate-200">
                      <td className="py-3 font-semibold text-white">{item?.title}</td>
                      <td>{h.locationName}</td>
                      <td className="font-mono text-lime-400 font-bold">{h.handoverCode}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => onOpenHandover(h.itemId)}
                          className="px-3 py-1 rounded-lg bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-semibold"
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

      {/* Audit Log Stream */}
      {activeTab === 'audit' && (
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/25 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-lime-400" />
            <h3 className="font-display font-bold text-lg text-white">Immutable Platform Audit Trail</h3>
          </div>

          <div className="divide-y divide-emerald-500/10">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lime-400">{log.action}</span>
                    <span className="text-slate-400">• Actor: {log.actorName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: {log.targetType} ({log.targetId})
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
