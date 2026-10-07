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
          className="px-5 py-2 rounded-full text-xs font-bold bg-forest-900 text-white"
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
        colors: ['#84cc16', '#059669', '#07281d', '#10b981'],
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(handover.handoverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-forest-700" />
        <span>Back</span>
      </button>

      {/* Main Handover Station Panel */}
      <div className="card-clean p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-forest-900 text-lime-400 flex items-center justify-center font-bold shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">Safe Handover Station</h1>
              <p className="text-xs text-forest-700 font-medium">Physical Return & Ownership Confirmation</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Item Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
          <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h4 className="font-display font-bold text-base text-slate-900">{item.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              <span>Meeting Point: {handover.locationName}</span>
            </div>
          </div>
        </div>

        {handover.status === 'completed' || item.status === 'recovered' ? (
          /* Completed State */
          <div className="rounded-3xl bg-forest-900 text-white p-8 text-center space-y-3 animate-fade-in shadow-card">
            <div className="w-16 h-16 rounded-full bg-lime-400 text-forest-950 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-extrabold text-2xl">Item Officially Recovered!</h3>
            <p className="text-xs text-slate-200 max-w-sm mx-auto">
              Handover code confirmed. The case lifecycle is complete and safely logged.
            </p>
            <div className="pt-2">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-lime-400 text-forest-950 hover:bg-lime-300"
              >
                Return to Campus Feed
              </button>
            </div>
          </div>
        ) : (
          /* Active Handover View */
          <div className="space-y-5">
            {/* Claimant View: One-Time 6-Digit OTP Box */}
            <div className="rounded-3xl bg-forest-900 text-white p-6 text-center space-y-3 shadow-card">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-lime-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>One-Time Handover Code</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="font-mono font-black text-4xl sm:text-5xl tracking-widest text-white bg-black/40 px-6 py-3 rounded-2xl border border-white/20">
                  {handover.handoverCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
                  title="Copy"
                >
                  {copied ? <Check className="w-5 h-5 text-lime-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Show this 6-digit code to the finder or Campus Safety desk to confirm physical handover.
              </p>
            </div>

            {/* Finder / Officer Confirmation Form */}
            <form
              onSubmit={handleVerifyCode}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
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
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-sm font-mono text-slate-900 tracking-wider focus:outline-none focus:border-forest-600 font-bold"
                />
                <button
                  type="submit"
                  disabled={enteredCode.length !== 6}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 disabled:opacity-40 shadow-sm"
                >
                  Confirm
                </button>
              </div>

              {verificationFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    verificationFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {verificationFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
