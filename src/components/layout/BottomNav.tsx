import React, { useState } from 'react';
import { Compass, Search, FolderCheck, Shield, Plus, X } from 'lucide-react';
import { useAppState } from '../../services/stateContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openReportModal: (type: 'lost' | 'found') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, openReportModal }) => {
  const { matches, currentUser, switchUserRole } = useAppState();
  const [showReportPicker, setShowReportPicker] = useState(false);

  const activeMatchesCount = matches.filter((m) => m.status === 'open').length;

  return (
    <>
      {showReportPicker && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 animate-fade-in"
          onClick={() => setShowReportPicker(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl text-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">Create Campus Report</h3>
              <button
                onClick={() => setShowReportPicker(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => {
                  setShowReportPicker(false);
                  openReportModal('lost');
                }}
                className="p-4 rounded-2xl bg-forest-50 border border-forest-200 hover:border-forest-600 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-lime-400 flex items-center justify-center mb-2 font-bold shadow-sm">
                  🔍
                </div>
                <div className="font-bold text-sm text-forest-900">Report Lost</div>
                <div className="text-[11px] text-slate-500 mt-0.5">I misplaced an item</div>
              </button>

              <button
                onClick={() => {
                  setShowReportPicker(false);
                  openReportModal('found');
                }}
                className="p-4 rounded-2xl bg-lime-50 border border-lime-300 hover:border-lime-500 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-lime-400 flex items-center justify-center mb-2 font-bold shadow-sm">
                  📦
                </div>
                <div className="font-bold text-sm text-forest-900">Report Found</div>
                <div className="text-[11px] text-slate-600 mt-0.5">I found something</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean White Bottom Nav Bar matching the "After" mockup */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 px-4 py-2 shadow-card">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
              currentTab === 'home' ? 'text-forest-900 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('search')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
              currentTab === 'search' ? 'text-forest-900 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className={`w-5 h-5 ${currentTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Search</span>
          </button>

          {/* Plus Report Action Button in Center */}
          <div className="px-2">
            <button
              onClick={() => setShowReportPicker(true)}
              className="w-11 h-11 rounded-full bg-forest-900 text-lime-400 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              aria-label="Report"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={() => setCurrentTab('cases')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 relative transition-colors ${
              currentTab === 'cases' ? 'text-forest-900 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FolderCheck className={`w-5 h-5 ${currentTab === 'cases' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">My Cases</span>
            {activeMatchesCount > 0 && (
              <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-lime-500 text-forest-950 font-bold text-[9px] flex items-center justify-center">
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
            className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
              currentTab === 'moderator' ? 'text-rose-700 font-bold' : 'text-slate-400 hover:text-rose-600'
            }`}
          >
            <Shield className={`w-5 h-5 ${currentTab === 'moderator' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px]">Desk</span>
          </button>
        </div>
      </div>
    </>
  );
};
