import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { CAMPUS_LOCATIONS } from '../../services/mockData';
import { ItemCategory, RiskTier, Item } from '../../types';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Camera,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  Tag,
  Plus,
  Trash2,
  FileCheck
} from 'lucide-react';
import { MatchBadge } from '../../components/common/Badge';

interface ReportLostScreenProps {
  onClose: () => void;
  onItemCreated: (item: Item) => void;
}

export const ReportLostScreen: React.FC<ReportLostScreenProps> = ({ onClose, onItemCreated }) => {
  const { reportItem, items } = useAppState();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [locationId, setLocationId] = useState(CAMPUS_LOCATIONS[0].id);
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('14:00');
  const [publicDescription, setPublicDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [riskTier, setRiskTier] = useState<RiskTier>(2);

  // Zero-Knowledge Proof State
  const [serialNumber, setSerialNumber] = useState('');
  const [secretQuestions, setSecretQuestions] = useState<Array<{ prompt: string; expectedAnswer: string }>>([
    {
      prompt: 'What distinctive sticker, scratch, or lock screen is present?',
      expectedAnswer: '',
    },
  ]);

  // Submission Results
  const [createdResult, setCreatedResult] = useState<{ item: Item; matches: any[] } | null>(null);

  const handleAddQuestion = () => {
    setSecretQuestions([
      ...secretQuestions,
      { prompt: 'What unique item/accessory is attached or inside?', expectedAnswer: '' },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setSecretQuestions(secretQuestions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = CAMPUS_LOCATIONS.find((l) => l.id === locationId) || CAMPUS_LOCATIONS[0];

    const result = reportItem({
      type: 'lost',
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
      serialNumber: serialNumber.trim() || undefined,
      secretQuestions: secretQuestions.filter((q) => q.prompt.trim() && q.expectedAnswer.trim()),
    });

    setCreatedResult(result);
    setStep(5); // Completion / Match screen
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative my-8">
        {/* Header with Step Progress */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              🔍
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">Report a Lost Item</h2>
              <p className="text-xs text-emerald-400 font-medium">Campus Zero-Knowledge Recovery</p>
            </div>
          </div>

          {step < 5 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="text-lime-400">Step {step}</span>
              <span className="text-slate-600">/</span>
              <span>4</span>
            </div>
          )}
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-semibold text-base text-white">Step 1: Item Category & Basics</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              >
                <option value="electronics">Electronics (Laptop, Phone, Headphones, Charger)</option>
                <option value="id_cards">IDs & Campus Passes</option>
                <option value="keys">Keys & Fobs</option>
                <option value="bags_wallets">Bags, Wallets & Backpacks</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="books_stationery">Books, Calculators & Stationery</option>
                <option value="accessories">Jewelry, Watches, Glasses & Bottles</option>
                <option value="other">Other Campus Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Title / Model</label>
              <input
                type="text"
                placeholder="e.g. Sony WH-1000XM4 Noise Cancelling Headphones"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand / Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Sony, Apple, Dell"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Color</label>
                <input
                  type="text"
                  placeholder="e.g. Matte Black, Silver"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Risk Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { tier: 1 as RiskTier, label: 'Tier 1: Low-Risk', desc: 'Bottle, Umbrella, Book' },
                  { tier: 2 as RiskTier, label: 'Tier 2: Personal', desc: 'Headphones, Watch, Bag' },
                  { tier: 3 as RiskTier, label: 'Tier 3: High-Value', desc: 'Phone, Laptop, ID' },
                ].map((t) => (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => setRiskTier(t.tier)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      riskTier === t.tier
                        ? 'bg-emerald-500/20 border-lime-400 text-white shadow-glow-lime'
                        : 'bg-emerald-950/40 border-emerald-500/20 text-slate-400 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="font-bold text-xs">{t.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
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
            <h3 className="font-display font-semibold text-base text-white">Step 2: Campus Location & Timing</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Known Campus Zone</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date Misplaced</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Approximate Time</label>
                <input
                  type="time"
                  value={approximateTime}
                  onChange={(e) => setApproximateTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>
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
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 flex items-center gap-1.5 shadow-glow-lime"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-semibold text-base text-white">Step 3: Public Description</h3>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Tip:</strong> Only include general visible features. Keep distinguishing marks, damage, and serial numbers for Step 4!
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Public Description</label>
              <textarea
                rows={3}
                placeholder="e.g. Left on the study table next to the window on the 2nd floor library."
                value={publicDescription}
                onChange={(e) => setPublicDescription(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Optional Public Image URL</label>
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
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!publicDescription.trim()}
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 disabled:opacity-50 flex items-center gap-1.5 shadow-glow-lime"
              >
                <span>Setup Private Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-white">
                Step 4: Zero-Knowledge Ownership Proof
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-purple-400" />
                Never Publicly Shown
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Provide answers to challenges that only the true owner would know. When someone finds your item, they will be challenged against this evidence without seeing your answers.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Serial Number / IMEI / Student ID Hash (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. S01-9982412-B or C02G99XYMD6M"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-sm text-white focus:outline-none focus:border-lime-400 font-mono text-xs"
              />
            </div>

            {/* Secret Challenge Questions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Ownership Challenge Questions</label>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="text-xs text-lime-400 hover:text-lime-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              {secretQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Challenge #{idx + 1}</span>
                    {secretQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.prompt}
                    onChange={(e) => {
                      const updated = [...secretQuestions];
                      updated[idx].prompt = e.target.value;
                      setSecretQuestions(updated);
                    }}
                    placeholder="Challenge prompt for claimant"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-emerald-500/20 text-xs text-white"
                  />

                  <input
                    type="text"
                    value={q.expectedAnswer}
                    onChange={(e) => {
                      const updated = [...secretQuestions];
                      updated[idx].expectedAnswer = e.target.value;
                      setSecretQuestions(updated);
                    }}
                    required
                    placeholder="Secret expected answer (stored encrypted)"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-lime-400/30 text-xs text-lime-300 font-medium"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setStep(3)}
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
                <span>Submit Lost Report</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 5: Submission Success & Instant Matching Result */}
        {step === 5 && createdResult && (
          <div className="space-y-5 text-center animate-fade-in py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-lime-400 flex items-center justify-center mx-auto shadow-glow-lime">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">Report Registered Successfully!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your report <span className="font-mono text-lime-400">{createdResult.item.id}</span> is now active.
              </p>
            </div>

            {createdResult.matches.length > 0 ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-lime-950/80 border border-lime-400/40 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Potential Match Detected!
                  </span>
                  <MatchBadge score={createdResult.matches[0].score} />
                </div>

                <p className="text-xs text-slate-200 leading-snug">
                  FYND matching engine detected a compatible found report at the same campus zone.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onItemCreated(createdResult.item);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 transition-colors shadow-md"
                  >
                    View Match & Begin Verification
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl glass-card text-xs text-slate-300 border border-emerald-500/20">
                No immediate matches found yet. We will automatically notify you the moment a compatible found item is reported!
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onItemCreated(createdResult.item);
              }}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close and return to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
