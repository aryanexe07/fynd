import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { ItemCategory, RiskTier, Item } from '../../types';
import {
  PackagePlus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Camera,
  ShieldCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { MatchBadge } from '../../components/common/Badge';

interface ReportFoundScreenProps {
  onClose: () => void;
  onItemCreated: (item: Item) => void;
}

export const ReportFoundScreen: React.FC<ReportFoundScreenProps> = ({ onClose, onItemCreated }) => {
  const { reportItem } = useAppState();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [locationId, setLocationId] = useState(CAMPUS_LOCATIONS[0].id);
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('15:00');
  const [publicDescription, setPublicDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [riskTier, setRiskTier] = useState<RiskTier>(2);

  // Private Finder Observations
  const [finderPrivateNotes, setFinderPrivateNotes] = useState('');
  const [secretQuestions, setSecretQuestions] = useState<Array<{ prompt: string; expectedAnswer: string }>>([
    {
      prompt: 'Describe any specific contents, engraving, or lock screen details.',
      expectedAnswer: '',
    },
  ]);

  const [createdResult, setCreatedResult] = useState<{ item: Item; matches: any[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = CAMPUS_LOCATIONS.find((l) => l.id === locationId) || CAMPUS_LOCATIONS[0];

    const result = reportItem({
      type: 'found',
      category,
      title: title.trim(),
      brand: brand.trim() || undefined,
      color: color.trim() || undefined,
      locationId,
      locationName: locObj.name,
      incidentDate,
      approximateTime,
      publicDescription: publicDescription.trim(),
      imageUrls: imageUrl ? [imageUrl] : [],
      riskTier,
      finderPrivateNotes: finderPrivateNotes.trim() || undefined,
      secretQuestions: secretQuestions.filter((q) => q.prompt.trim() && q.expectedAnswer.trim()),
    });

    setCreatedResult(result);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-glow-lime">
              📦
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">Report a Found Item</h2>
              <p className="text-xs text-lime-400 font-medium">Controlled Campus Safe Handover</p>
            </div>
          </div>

          {step < 4 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="text-lime-400">Step {step}</span>
              <span className="text-slate-600">/</span>
              <span>3</span>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-semibold text-base text-white">Step 1: Found Item Basics</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              >
                <option value="electronics">Electronics (Phone, Laptop, Headphones)</option>
                <option value="id_cards">Campus Cards & ID Badges</option>
                <option value="keys">Keys & Keychains</option>
                <option value="bags_wallets">Wallets, Bags & Purses</option>
                <option value="clothing">Jackets & Clothing</option>
                <option value="books_stationery">Textbooks & Calculators</option>
                <option value="accessories">Bottles, Glasses & Jewelry</option>
                <option value="other">Other Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Name / Summary</label>
              <input
                type="text"
                placeholder="e.g. Black Sony Over-Ear Headphones"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand (if visible)</label>
                <input
                  type="text"
                  placeholder="e.g. Sony, Apple, Hydro Flask"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color</label>
                <input
                  type="text"
                  placeholder="e.g. Black, Silver, Navy"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Where on campus was it found?</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 disabled:opacity-50 flex items-center gap-1.5 shadow-glow-lime"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-semibold text-base text-white">Step 2: Safe Public Listing</h3>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Controlled Disclosure Rule:</strong> Do NOT disclose serial numbers, money amounts, or secret contents in the public description so claimants can be tested!
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Public Safe Description</label>
              <textarea
                rows={3}
                placeholder="e.g. Found near desk #14 in the 2nd floor library quiet room."
                value={publicDescription}
                onChange={(e) => setPublicDescription(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Public Photo URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!publicDescription.trim()}
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 disabled:opacity-50 flex items-center gap-1.5 shadow-glow-lime"
              >
                <span>Finder Verification Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-white">
                Step 3: Private Finder Observations (Zero-Knowledge)
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-purple-400" />
                Sealed Verification
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Private Finder Notes (Only visible to you & Campus Safety Moderator)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Has a small green sticker on inner band and orange aux cable inside pouch."
                value={finderPrivateNotes}
                onChange={(e) => setFinderPrivateNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-lime-400 resize-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/25 space-y-2">
              <label className="block text-xs font-bold text-emerald-400">
                Challenge Question for Potential Claimant
              </label>
              <input
                type="text"
                value={secretQuestions[0].prompt}
                onChange={(e) => {
                  const updated = [...secretQuestions];
                  updated[0].prompt = e.target.value;
                  setSecretQuestions(updated);
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-emerald-500/20 text-xs text-white"
              />
              <input
                type="text"
                value={secretQuestions[0].expectedAnswer}
                onChange={(e) => {
                  const updated = [...secretQuestions];
                  updated[0].expectedAnswer = e.target.value;
                  setSecretQuestions(updated);
                }}
                required
                placeholder="Expected true answer (e.g. octocat sticker and scratch on power button)"
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-lime-400/30 text-xs text-lime-300 font-medium"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 hover:brightness-110 shadow-glow-lime flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Publish Found Report</span>
              </button>
            </div>
          </form>
        )}

        {step === 4 && createdResult && (
          <div className="space-y-5 text-center animate-fade-in py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-lime-400 flex items-center justify-center mx-auto shadow-glow-lime">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">Found Report Registered!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Thank you for helping keep campus honest and safe. Report ID: <span className="font-mono text-lime-400">{createdResult.item.id}</span>
              </p>
            </div>

            {createdResult.matches.length > 0 ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-lime-950/80 border border-lime-400/40 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Compatible Lost Item Found!
                  </span>
                  <MatchBadge score={createdResult.matches[0].score} />
                </div>
                <p className="text-xs text-slate-200">
                  A student previously filed a lost report matching this description. The owner will be notified to begin ownership verification!
                </p>
              </div>
            ) : null}

            <button
              onClick={() => {
                onClose();
                onItemCreated(createdResult.item);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 transition-colors shadow-md"
            >
              Done & Return to Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
