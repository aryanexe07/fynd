import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Claim, Item } from '../../types';
import {
  Shield,
  CheckCircle,
  XCircle,
  History,
  Lock,
  ArrowRight,
  Camera,
  Eye,
  AlertTriangle,
  FileCheck,
  Check,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  UserCheck
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

  const [activeTab, setActiveTab] = useState<'claims' | 'photo_review' | 'handovers' | 'audit'>('photo_review');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [selectedPhotoItemId, setSelectedPhotoItemId] = useState<string | null>(items[0]?.id || null);
  const [photoFilter, setPhotoFilter] = useState<'all' | 'found' | 'lost'>('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [verifiedItemIds, setVerifiedItemIds] = useState<Set<string>>(new Set());
  const [flaggedItemIds, setFlaggedItemIds] = useState<Set<string>>(new Set());

  const escalatedClaims = claims.filter(
    (c) => c.status === 'escalated' || c.status === 'pending_verification'
  );

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || escalatedClaims[0];
  const targetItem = selectedClaim ? items.find((i) => i.id === selectedClaim.foundItemId) : null;
  const targetEvidence = selectedClaim ? privateEvidences[selectedClaim.foundItemId] : null;

  const itemsWithPhotos = items.filter((i) => {
    if (photoFilter !== 'all' && i.type !== photoFilter) return false;
    return i.imageUrls && i.imageUrls.length > 0;
  });

  const selectedPhotoItem = items.find((i) => i.id === selectedPhotoItemId) || itemsWithPhotos[0];

  const handleVerifyPhotos = (itemId: string) => {
    setVerifiedItemIds((prev) => new Set(prev).add(itemId));
    setFlaggedItemIds((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleFlagPhotos = (itemId: string) => {
    setFlaggedItemIds((prev) => new Set(prev).add(itemId));
    setVerifiedItemIds((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center font-bold border border-[#22a36b]/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl text-slate-900">Campus Safety Desk & Reviewer</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f7ee] text-[#22a36b] border border-[#22a36b]/30">
                Staff Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review student uploaded item photos, inspect zero-knowledge claims, and authorize handovers.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#eef1f4] p-1 rounded-full border border-slate-200/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('photo_review')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'photo_review' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Review ({itemsWithPhotos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'claims' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims ({escalatedClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'handovers' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Handovers ({handovers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* 1. Photo Review Section for Reviewer / Moderator */}
      {activeTab === 'photo_review' && (
        <div className="space-y-4">
          {/* Sub-filters for Photo Review */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filter Queue:
              </span>
              <div className="flex items-center bg-[#f5f6f8] p-1 rounded-full border border-slate-200 text-xs">
                <button
                  onClick={() => setPhotoFilter('all')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    photoFilter === 'all' ? 'bg-[#22a36b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Photos ({items.filter((i) => i.imageUrls?.length > 0).length})
                </button>
                <button
                  onClick={() => setPhotoFilter('found')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    photoFilter === 'found' ? 'bg-[#22a36b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Found Items ({items.filter((i) => i.type === 'found' && i.imageUrls?.length > 0).length})
                </button>
                <button
                  onClick={() => setPhotoFilter('lost')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    photoFilter === 'lost' ? 'bg-[#22a36b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lost Items ({items.filter((i) => i.type === 'lost' && i.imageUrls?.length > 0).length})
                </button>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Reviewing student submissions for campus safety compliance
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Photo Items Queue */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
                Student Upload Queue ({itemsWithPhotos.length})
              </h3>

              {itemsWithPhotos.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white text-center border border-slate-200/80 text-xs text-slate-400 shadow-soft">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No item photos found in this queue.
                </div>
              ) : (
                itemsWithPhotos.map((item) => {
                  const isSelected = selectedPhotoItem?.id === item.id;
                  const isVerified = verifiedItemIds.has(item.id);
                  const isFlagged = flaggedItemIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPhotoItemId(item.id)}
                      className={`p-3.5 rounded-3xl bg-white border shadow-soft cursor-pointer transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#22a36b] bg-[#e8f7ee]/30 ring-1 ring-[#22a36b]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-white text-[8px] font-bold">
                          {item.imageUrls.length}p
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                              item.type === 'lost' ? 'bg-amber-100 text-amber-900' : 'bg-[#e8f7ee] text-[#22a36b]'
                            }`}
                          >
                            {item.type}
                          </span>

                          {isVerified ? (
                            <span className="text-[10px] font-bold text-[#22a36b] flex items-center gap-0.5">
                              <Check className="w-3 h-3 stroke-[3]" /> Verified
                            </span>
                          ) : isFlagged ? (
                            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> Flagged
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">Needs Review</span>
                          )}
                        </div>

                        <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {item.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          By {item.reporterName} • {item.locationName}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: High-Res Photo Inspector & Decision Panel */}
            <div className="lg:col-span-8">
              {selectedPhotoItem ? (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
                  {/* Photo Inspector Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            selectedPhotoItem.type === 'lost' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-[#22a36b] text-white font-bold'
                          }`}
                        >
                          {selectedPhotoItem.type} item
                        </span>
                        <RiskTierBadge tier={selectedPhotoItem.riskTier} />
                        <StatusBadge status={selectedPhotoItem.status} />
                      </div>
                      <h2 className="font-display font-extrabold text-xl text-slate-900">
                        {selectedPhotoItem.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => onSelectItem(selectedPhotoItem)}
                      className="text-xs font-bold text-[#22a36b] hover:text-[#1c8c5c] flex items-center gap-1 self-start sm:self-auto bg-[#e8f7ee] px-3 py-1.5 rounded-full"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Full Case</span>
                    </button>
                  </div>

                  {/* High-Res Gallery Showcase */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Uploaded Photos for Inspection ({selectedPhotoItem.imageUrls.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPhotoItem.imageUrls.map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-soft group"
                        >
                          <img
                            src={url}
                            alt={`${selectedPhotoItem.title} ${i + 1}`}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white">
                            Angle / View #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Context & Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Student Reporter</div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#22a36b]" />
                        <span>{selectedPhotoItem.reporterName}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Location & Timestamp</div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#22a36b]" />
                        <span className="truncate">{selectedPhotoItem.locationName}</span>
                      </div>
                    </div>

                    <div className="col-span-full space-y-1 pt-2 border-t border-slate-200/80">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Description Given by Student</div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        "{selectedPhotoItem.publicDescription}"
                      </p>
                    </div>
                  </div>

                  {/* Reviewer Actions */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleVerifyPhotos(selectedPhotoItem.id)}
                        className={`btn-emerald-cta px-6 py-2.5 text-xs ${
                          verifiedItemIds.has(selectedPhotoItem.id) ? 'opacity-80' : ''
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>
                          {verifiedItemIds.has(selectedPhotoItem.id)
                            ? 'Photos Approved & Verified'
                            : 'Approve Photos & Mark Verified'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleFlagPhotos(selectedPhotoItem.id)}
                        className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Flag for Policy / PII</span>
                      </button>

                      <button
                        onClick={() => {
                          setVerifiedItemIds((prev) => {
                            const next = new Set(prev);
                            next.delete(selectedPhotoItem.id);
                            return next;
                          });
                          setFlaggedItemIds((prev) => {
                            const next = new Set(prev);
                            next.delete(selectedPhotoItem.id);
                            return next;
                          });
                        }}
                        className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Status</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-white text-center border border-slate-200/80 text-slate-400 text-xs shadow-soft">
                  Select an item from the queue to inspect and review student uploaded photos.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

