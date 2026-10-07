import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  X
} from 'lucide-react';
import { RiskTierBadge } from '../../components/common/Badge';

interface ClaimChallengeModalProps {
  foundItem: Item;
  onClose: () => void;
  onClaimSubmitted: (result: { claim: Claim; passed: boolean; escalated: boolean; message: string }) => void;
}

export const ClaimChallengeModal: React.FC<ClaimChallengeModalProps> = ({
  foundItem,
  onClose,
  onClaimSubmitted,
}) => {
  const { privateEvidences, submitClaimChallenge } = useAppState();

  const targetEvidence = privateEvidences[foundItem.id];
  const questions = targetEvidence?.secretQuestions || [
    {
      id: 'default_q',
      prompt: 'Describe any specific distinguishing scratch, sticker, or secret contents inside this item.',
      expectedAnswer: '',
    },
  ];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionOutcome, setSubmissionOutcome] = useState<{
    claim: Claim;
    passed: boolean;
    escalated: boolean;
    message: string;
  } | null>(null);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitClaimChallenge(foundItem.id, answers);
      setIsSubmitting(false);
      setSubmissionOutcome(result);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8">
        {!submissionOutcome ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#22a36b] text-white flex items-center justify-center font-bold shadow-soft">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-lg text-slate-900">Zero-Knowledge Ownership Claim</h2>
                  <p className="text-xs text-[#22a36b] font-bold">Encrypted Verification Challenge</p>
                </div>
              </div>
              <RiskTierBadge tier={foundItem.riskTier} />
            </div>

            {/* Target Item summary */}
            <div className="p-3.5 rounded-2xl bg-[#f5f6f8] border border-slate-200 flex items-center gap-3">
              <img
                src={foundItem.imageUrls[0]}
                alt={foundItem.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 truncate">{foundItem.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Found at {foundItem.locationName}</div>
              </div>
            </div>

            {/* Shield Guidance Alert */}
            <div className="p-3 rounded-2xl bg-[#e8f7ee] border border-[#22a36b]/30 text-xs text-slate-800 flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#22a36b] shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Knowledge Verification:</strong> Provide exact details known only to the real owner to ensure safe return.
              </span>
            </div>

            {/* Challenge Questions */}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Challenge #{idx + 1}: {q.prompt}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter your exact knowledge (stickers, serial #, contents)..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f5f6f8] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#22a36b] resize-none font-medium"
                  />
                </div>
              ))}
            </div>

            {/* High-Value Note */}
            {foundItem.riskTier === 3 && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>High-Value Item: Campus Safety desk will review evidence before physical handover.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-emerald-cta px-6 py-2.5 text-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Evaluating Proof...</span>
                ) : (
                  <>
                    <span>Submit Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Submission Outcome Screen */
          <div className="space-y-5 text-center animate-fade-in py-2">
            {submissionOutcome.passed ? (
              <div className="w-16 h-16 rounded-full bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : submissionOutcome.escalated ? (
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-soft">
                <Clock className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10" />
              </div>
            )}

            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                {submissionOutcome.passed
                  ? 'Ownership Verified!'
                  : submissionOutcome.escalated
                  ? 'Escalated to Moderator Desk'
                  : 'Verification Inconclusive'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                {submissionOutcome.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onClaimSubmitted(submissionOutcome);
                }}
                className="w-full btn-emerald-cta py-3 text-xs"
              >
                {submissionOutcome.passed ? 'Proceed to Handover Station' : 'Return to Case'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

