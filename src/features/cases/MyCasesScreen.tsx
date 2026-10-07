import React, { useState } from 'react';
import { useAppState } from '../../services/stateContext';
import { Item, Claim } from '../../types';
import { StatusBadge, RiskTierBadge } from '../../components/common/Badge';
import {
  ChevronLeft,
  Truck,
  ShieldCheck,
  Tag,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface MyCasesScreenProps {
  onSelectItem: (item: Item) => void;
  onOpenHandover: (itemId: string) => void;
  openReportModal: (type: 'lost' | 'found') => void;
}

export const MyCasesScreen: React.FC<MyCasesScreenProps> = ({
  onSelectItem,
  onOpenHandover,
  openReportModal,
}) => {
  const { currentUser, items, claims, handovers, matches } = useAppState();
  const [activeTab, setActiveTab] = useState<'cart_view' | 'all_cases' | 'recovered'>('cart_view');
  const [promoCode, setPromoCode] = useState('STUDENT-RECOVERY-100');
  const [appliedPromo, setAppliedPromo] = useState(true);

  const myLostItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'lost' && i.status !== 'recovered');
  const myFoundItems = items.filter((i) => i.reporterId === currentUser.uid && i.type === 'found' && i.status !== 'recovered');
  const myClaims = claims.filter((c) => c.claimantId === currentUser.uid);
  const myRecovered = items.filter(
    (i) => i.status === 'recovered' && (i.reporterId === currentUser.uid || claims.some((c) => c.foundItemId === i.id && c.claimantId === currentUser.uid))
  );

  // Active items in "Cart" / active tracking
  const activeCartItems = items.slice(0, 3);
  const totalValue = 291; // $165 (LeBron XXI) + $126 (KD16) as in screenshot mockup

  return (
    <div className="max-w-xl mx-auto pb-32 space-y-6 animate-fade-in">
      {/* 1. Header matching the Right Screen Mockup: Back Button + "MY CART 2 items" */}
      <div className="flex items-center justify-between px-2 pt-2">
        <button
          onClick={() => setActiveTab('cart_view')}
          className="w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-soft transition-transform active:scale-95 border border-slate-200/80"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="font-display font-black text-sm uppercase tracking-widest text-slate-900">
            MY CART / ACTIVE CASES
          </h1>
          <span className="text-[11px] font-bold text-slate-400">
            {activeCartItems.length} items active
          </span>
        </div>

        <div className="w-11 h-11" /> {/* Spacer for symmetry */}
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-[#eef1f4] p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => setActiveTab('cart_view')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'cart_view' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cart View
          </button>
          <button
            onClick={() => setActiveTab('all_cases')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all_cases' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Reports ({myLostItems.length + myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('recovered')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'recovered' ? 'bg-[#22a36b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recovered ({myRecovered.length})
          </button>
        </div>
      </div>

      {/* Cart View matching the Right Screen Screenshot */}
      {activeTab === 'cart_view' && (
        <div className="space-y-4">
          {/* Cart Item Cards */}
          <div className="space-y-3">
            {/* Item 1: LeBron XXI */}
            <div
              onClick={() => onSelectItem(activeCartItems[0] || items[0])}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#f4f5f7] p-2 flex items-center justify-center shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                    alt="LeBron XXI"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-[#22a36b] transition-colors">
                    LeBron XXI
                  </h3>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    QUEEN CONCH
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22a36b]" />
                    <span>In Safe Locker #4B</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-black text-lg text-slate-900">
                  $165
                </div>
                <span className="text-[10px] font-bold text-[#22a36b] bg-[#e8f7ee] px-2 py-0.5 rounded-full mt-1 inline-block">
                  Verified
                </span>
              </div>
            </div>

            {/* Item 2: KD16 */}
            <div
              onClick={() => onSelectItem(activeCartItems[1] || items[1])}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#f4f5f7] p-2 flex items-center justify-center shrink-0 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80"
                    alt="KD16"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-[#22a36b] transition-colors">
                    KD16
                  </h3>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    WANDA
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22a36b]" />
                    <span>Campus Library Desk</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-black text-lg text-slate-900">
                  $126
                </div>
                <span className="text-[10px] font-bold text-[#22a36b] bg-[#e8f7ee] px-2 py-0.5 rounded-full mt-1 inline-block">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* 2. Shipping Card with green outline & Truck Icon matching mockup */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#22a36b]/40 shadow-soft flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#e8f7ee] text-[#22a36b] flex items-center justify-center font-bold shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">Shipping & Pickup</h4>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  5-8 DAYS • CAMPUS SAFE DESK
                </div>
              </div>
            </div>

            <span className="text-xs font-bold text-[#22a36b] bg-[#e8f7ee] px-3 py-1 rounded-full">
              FREE
            </span>
          </div>

          {/* 3. Promo Code Card matching mockup */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">Promo Code</h4>
                <div className="text-xs text-slate-400">Zero-knowledge student pass</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-800 bg-[#f5f6f8] px-3 py-1.5 rounded-xl border border-slate-200">
                GD99X
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#22a36b]" />
            </div>
          </div>
        </div>
      )}

      {/* All Cases Tab */}
      {activeTab === 'all_cases' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-display font-bold text-base text-slate-900">Your Active Reports</h3>
            <button
              onClick={() => openReportModal('lost')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#22a36b] text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Report</span>
            </button>
          </div>

          <div className="space-y-3">
            {myLostItems.concat(myFoundItems).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={item.imageUrls[0]} alt={item.title} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                    <div className="text-xs text-slate-400">{item.locationName}</div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recovered Tab */}
      {activeTab === 'recovered' && (
        <div className="space-y-3">
          {myRecovered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
              <h4 className="font-display font-bold text-base text-slate-800">No completed recoveries yet</h4>
              <p className="text-xs text-slate-400 mt-1">Returned items will be archived here safely.</p>
            </div>
          ) : (
            myRecovered.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <StatusBadge status="recovered" />
                  <span className="text-xs text-[#22a36b] font-bold">Successfully Returned ✓</span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900">{item.title}</h4>
                <div className="text-xs text-slate-500">{item.locationName}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Fixed Bottom Bar matching the Right Screen: `TOTAL $291` & `CHECKOUT >` in emerald green */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 shadow-floating">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL ESTIMATE
            </span>
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900">
              ${totalValue}
            </div>
          </div>

          <button
            onClick={() => {
              if (activeCartItems.length > 0) {
                onSelectItem(activeCartItems[0]);
              }
            }}
            className="btn-emerald-cta py-3.5 px-8 flex-1"
          >
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">CHECKOUT</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

