import React from 'react';
import { Compass, Search, Plus, FolderCheck, Shield } from 'lucide-react';
import { useAppState } from '../../services/stateContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openReportModal: (type: 'lost' | 'found') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, openReportModal }) => {
  const { matches, currentUser, switchUserRole } = useAppState();
  const [showReportPicker, setShowReportPicker] = React.useState(false);

  const activeMatchesCount = matches.filter((m) => m.status === 'open').length;

  return (
    <>
      {showReportPicker && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowReportPicker(false)}
        >
          <div
            className="w-full max-w-sm glass-panel rounded-3xl p-5 border border-emerald-500/30 text-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-emerald-500/30 rounded-full mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-white mb-1">Create Campus Report</h3>
            <p className="text-xs text-slate-300 mb-5">
              Select the appropriate recovery workflow
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => {
                  setShowReportPicker(false);
                  openReportModal('lost');
                }}
                className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all hover:scale-[1.02]"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2 font-bold">
                  🔍
                </div>
                <div className="font-bold text-sm text-white">Lost Item</div>
                <div className="text-[11px] text-emerald-400/80 mt-0.5">I misplaced something</div>
              </button>

              <button
                onClick={() => {
                  setShowReportPicker(false);
                  openReportModal('found');
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-lime-400/40 hover:border-lime-400 text-left transition-all hover:scale-[1.02] shadow-glow-lime"
              >
                <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center mb-2 font-bold">
                  📦
                </div>
                <div className="font-bold text-sm text-white">Found Item</div>
                <div className="text-[11px] text-lime-300/90 mt-0.5">I found someone's item</div>
              </button>
            </div>

            <button
              onClick={() => setShowReportPicker(false)}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-emerald-500/20 px-3 py-2">
        <div className="flex items-center justify-around relative">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              currentTab === 'home' ? 'text-lime-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Explore</span>
          </button>

          <button
            onClick={() => setCurrentTab('search')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              currentTab === 'search' ? 'text-lime-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {/* Center Floating Plus Button */}
          <div className="relative -top-5">
            <button
              onClick={() => setShowReportPicker(true)}
              className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 flex items-center justify-center shadow-glow-lime hover:scale-105 active:scale-95 transition-all"
              aria-label="Report Item"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={() => setCurrentTab('cases')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl relative transition-colors ${
              currentTab === 'cases' ? 'text-lime-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderCheck className="w-5 h-5" />
            <span className="text-[10px] font-medium">My Cases</span>
            {activeMatchesCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-lime-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {activeMatchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (currentUser.role !== 'moderator') {
                switchUserRole('moderator');
              }
              setCurrentTab('moderator');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              currentTab === 'moderator' ? 'text-rose-300' : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-medium">Desk</span>
          </button>
        </div>
      </div>
    </>
  );
};
