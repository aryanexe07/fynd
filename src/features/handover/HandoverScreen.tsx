import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle
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
        <h3 className="font-display font-bold text-xl text-slate-800">No active handover found</h3>
        <button
          onClick={onBack}
          className="btn-emerald-cta px-6 py-2.5 text-xs"
        >
          Return
        </button>
      </div>
    );
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const result = confirmHandover(handover.id, enteredCode);
    setVerificationFeedback(result);

    if (result.success) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22a36b', '#34d399', '#111827', '#10b981'],
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(handover.handoverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-soft"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#22a36b]" />
        <span>Back</span>
      </button>

      {/* Main Handover Station Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#22a36b] text-white flex items-center justify-center font-bold shadow-soft">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-slate-900">Safe Handover Station</h1>
              <p className="text-xs text-[#22a36b] font-bold">Physical Return & Ownership Confirmation</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Item Summary */}
        <div className="p-4 rounded-2xl bg-[#f5f6f8] border border-slate-200 flex items-center gap-4">
          <img src={item.imageUrls[0]} alt={item.title} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-900">{item.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#22a36b]" />
              <span>Meeting Point: {handover.locationName}</span>
            </div>
          </div>
        </div>

        {handover.status === 'completed' || item.status === 'recovered' ? (
          /* Completed State */
          <div className="rounded-3xl bg-slate-900 text-white p-8 text-center space-y-4 animate-fade-in shadow-card border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-[#22a36b] text-white flex items-center justify-center mx-auto shadow-glow-green">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-extrabold text-2xl">Item Successfully Recovered!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Handover code confirmed. The case lifecycle is complete and safely logged.
            </p>
            <div className="pt-2">
              <button
                onClick={onBack}
                className="btn-emerald-cta px-8 py-3 text-xs"
              >
                Return to Campus Feed
              </button>
            </div>
          </div>
        ) : (
          /* Active Handover View */
          <div className="space-y-5">
            {/* Claimant View: One-Time 6-Digit OTP Box */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 text-center space-y-3 shadow-card border border-slate-800">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#34d399] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>One-Time Handover Code</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="font-mono font-black text-4xl sm:text-5xl tracking-widest text-white bg-black/40 px-6 py-3 rounded-2xl border border-white/20">
                  {handover.handoverCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-5 h-5 text-[#34d399]" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Show this 6-digit code to the finder or Campus Safety desk to confirm physical handover.
              </p>
            </div>

            {/* Finder / Officer Confirmation Form */}
            <form
              onSubmit={handleVerifyCode}
              className="p-5 rounded-3xl bg-[#f5f6f8] border border-slate-200 space-y-3"
            >
              <label className="block text-xs font-bold text-slate-800">
                Finder / Moderator Verification Input
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code..."
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm font-mono text-slate-900 tracking-wider focus:outline-none focus:border-[#22a36b] font-bold"
                />
                <button
                  type="submit"
                  disabled={enteredCode.length !== 6}
                  className="btn-emerald-cta px-6 py-3 text-xs disabled:opacity-40"
                >
                  Confirm
                </button>
              </div>

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    verificationFeedback.success
                      ? 'bg-[#e8f7ee] text-[#22a36b] border border-[#22a36b]/30'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {verificationFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22a36b]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
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

