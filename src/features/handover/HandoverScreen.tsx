import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Handover } from '../../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  QrCode,
  MapPin,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';

interface HandoverScreenProps {
  itemId: string;
  onBack: () => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({ itemId, onBack }) => {
  const { handovers, getItemById, confirmHandover, currentUser } = useAppState();

  const item = getItemById(itemId);
  const handover = handovers.find((h) => h.itemId === itemId);

  const [enteredCode, setEnteredCode] = useState('');
  const [verificationFeedback, setVerificationFeedback] = useState<{ success?: boolean; message?: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  if (!item || !handover) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <h3 className="font-display font-bold text-xl text-white">No active handover record found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-900 border border-emerald-500/30 text-emerald-300"
        >
          Return
        </button>
      </div>
    );
  }

  const isClaimant = handover.claimantId === currentUser.uid;
  const isFinder = handover.finderId === currentUser.uid || currentUser.role === 'moderator';

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const result = confirmHandover(handover.id, enteredCode);
    setVerificationFeedback(result);

    if (result.success) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a3e635', '#10b981', '#ffffff', '#34d399'],
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(handover.handoverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-lime-400" />
        <span>Back</span>
      </button>

      {/* Main Handover Station Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-glow-lime">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Safe Handover Station</h1>
              <p className="text-xs text-lime-400">Step 5: Physical Return & Ownership Transfer</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Item Summary */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center gap-3.5">
          <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-lime-400" />
              <span>Meeting Point: {handover.locationName}</span>
            </div>
          </div>
        </div>

        {handover.status === 'completed' || item.status === 'recovered' ? (
          /* Completed State */
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950 to-lime-950/80 p-8 border border-lime-400/40 text-center space-y-4 animate-fade-in shadow-glow-lime">
            <div className="w-16 h-16 rounded-3xl bg-lime-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">Item Officially Recovered!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                The handover confirmation code has been verified. The lifecycle for this case is now safely complete.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300"
              >
                Return to Campus Feed
              </button>
            </div>
          </div>
        ) : (
          /* Handover Active State */
          <div className="space-y-6">
            {/* Claimant View: Show One-Time 6-Digit OTP */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/80 via-black to-slate-950 p-6 border border-lime-400/40 text-center space-y-4 shadow-glow-lime">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>One-Time Handover Verification Code</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="font-mono font-black text-4xl sm:text-5xl tracking-widest text-white bg-black/60 px-6 py-3 rounded-2xl border border-lime-400/30">
                  {handover.handoverCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-slate-300 hover:text-white"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-5 h-5 text-lime-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Show this 6-digit code to the finder or Campus Safety officer at the meeting location to confirm exchange.
              </p>
            </div>

            {/* Finder / Officer Confirmation Terminal */}
            <form
              onSubmit={handleVerifyCode}
              className="p-5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Finder / Moderator Verification Input
                </label>
                <span className="text-[10px] text-emerald-400 font-medium">Verify code from claimant</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP..."
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm font-mono text-white tracking-wider focus:outline-none focus:border-lime-400"
                />
                <button
                  type="submit"
                  disabled={enteredCode.length !== 6}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-lime-400 text-slate-950 hover:bg-lime-300 disabled:opacity-40 transition-colors shadow-md"
                >
                  Confirm Return
                </button>
              </div>

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    verificationFeedback.success
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {verificationFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{verificationFeedback.message}</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
