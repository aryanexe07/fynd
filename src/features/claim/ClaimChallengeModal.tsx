import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative my-8">
        {!submissionOutcome ? (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-glow-lime">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white">Ownership Challenge</h2>
                  <p className="text-xs text-emerald-400">Zero-Knowledge Verification Workflow</p>
                </div>
              </div>
              <RiskTierBadge tier={foundItem.riskTier} />
            </div>

            {/* Target Item summary */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center gap-3">
              <img
                src={foundItem.imageUrls[0]}
                alt={foundItem.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="truncate">
                <div className="font-bold text-xs text-white truncate">{foundItem.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Found at {foundItem.locationName}</div>
              </div>
            </div>

            {/* Shield Guidance Alert */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Knowledge Rule:</strong> To prevent false claims, you must provide identifying evidence known only to the genuine owner.
              </span>
            </div>

            {/* Challenges Inputs */}
            <div className="space-y-3.5">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Challenge #{idx + 1}: {q.prompt}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter your exact knowledge (e.g. sticker description, serial #, contents)..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-lime-400 resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Risk Tier Note */}
            {foundItem.riskTier === 3 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  High-Value Tier: This item requires Campus Safety Moderator sign-off prior to physical handover.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Proof...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Claim Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Submission Outcome Screen */
          <div className="space-y-6 text-center animate-fade-in py-2">
            {submissionOutcome.passed ? (
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-lime-400 flex items-center justify-center mx-auto shadow-glow-lime">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : submissionOutcome.escalated ? (
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10" />
              </div>
            )}

            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">
                {submissionOutcome.passed
                  ? 'Ownership Verified!'
                  : submissionOutcome.escalated
                  ? 'Escalated to Moderator Desk'
                  : 'Verification Inconclusive'}
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                {submissionOutcome.message}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onClaimSubmitted(submissionOutcome);
                }}
                className="w-full py-3 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 transition-colors shadow-glow-lime"
              >
                {submissionOutcome.passed ? 'Proceed to Secure Handover' : 'Return to Case View'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
