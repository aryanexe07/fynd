import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { ItemCategory, RiskTier, Item } from '../../types';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-lime-400 flex items-center justify-center font-bold shadow-sm">
              📦
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">Report a Found Item</h2>
              <p className="text-xs text-forest-700 font-medium">Controlled Safe Handover</p>
            </div>
          </div>

          {step < 4 && (
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <span className="text-forest-900">Step {step}</span>
              <span>/</span>
              <span>3</span>
            </div>
          )}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-bold text-sm text-slate-900">Step 1: Found Item Basics</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-forest-600"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Item Title / Summary</label>
              <input
                type="text"
                placeholder="e.g. Black Sony Over-Ear Headphones"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-forest-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Sony, Apple"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  placeholder="e.g. Black, Silver"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Where was it found?</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-forest-600"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 disabled:opacity-40 shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-bold text-sm text-slate-900">Step 2: Safe Public Listing</h3>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Controlled Disclosure:</strong> Do NOT disclose serial numbers or money amounts publicly so claimants can be verified!
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Public Description</label>
              <textarea
                rows={3}
                placeholder="e.g. Found on 2nd floor library quiet room desk #14."
                value={publicDescription}
                onChange={(e) => setPublicDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-forest-600 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Optional Photo URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!publicDescription.trim()}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 disabled:opacity-40 shadow-sm flex items-center gap-1.5"
              >
                <span>Finder Verification Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-900">
                Step 3: Sealed Observations (Zero-Knowledge)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-lime-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Sealed
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Private Finder Notes (Only visible to you & Campus Safety Desk)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Has a small green sticker on inner band and orange aux cable in pouch."
                value={finderPrivateNotes}
                onChange={(e) => setFinderPrivateNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-forest-600 resize-none font-medium"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-forest-900">
                Challenge Question for Claimant
              </label>
              <input
                type="text"
                value={secretQuestions[0].prompt}
                onChange={(e) => {
                  const updated = [...secretQuestions];
                  updated[0].prompt = e.target.value;
                  setSecretQuestions(updated);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
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
                placeholder="Expected true answer (e.g. octocat sticker and scratch)"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-forest-400 text-xs text-forest-900 font-bold"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-md flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Publish Found Report</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Done */}
        {step === 4 && createdResult && (
          <div className="space-y-4 text-center animate-fade-in py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-forest-900 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Found Report Registered!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Report ID: <span className="font-mono font-bold text-forest-900">{createdResult.item.id}</span>
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onItemCreated(createdResult.item);
              }}
              className="w-full py-2.5 rounded-full text-xs font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-sm"
            >
              Done & Return to Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
