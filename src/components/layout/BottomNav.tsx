import React, { useState } from 'react';
import { Compass, Search, FolderCheck, Shield, Plus, X, Package } from 'lucide-react';
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
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
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
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mb-2 font-bold shadow-sm">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <div className="font-bold text-sm text-slate-900">Report Lost</div>
                <div className="text-[11px] text-slate-500 mt-0.5">I misplaced an item</div>
              </button>

              <button
                onClick={() => {
                  setShowReportPicker(false);
                  openReportModal('found');
                }}
                className="p-4 rounded-2xl bg-[#e8f7ee] border border-[#22a36b]/30 hover:border-[#22a36b] text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#22a36b] text-white flex items-center justify-center mb-2 font-bold shadow-sm">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-sm text-slate-900">Report Found</div>
                <div className="text-[11px] text-slate-600 mt-0.5">I found something</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Floating Dock Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/60 px-4 pt-2 pb-2 sm:pb-3 shadow-card">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
              currentTab === 'home' ? 'text-[#192b0f] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${currentTab === 'home' ? 'text-[#65a30d] stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('search')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
              currentTab === 'search' ? 'text-[#192b0f] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className={`w-5 h-5 ${currentTab === 'search' ? 'text-[#65a30d] stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold">Search</span>
          </button>

          {/* Floating Elevated iOS Lime Action Button */}
          <div className="px-2 -mt-4">
            <button
              onClick={() => setShowReportPicker(true)}
              className="w-13 h-13 rounded-2xl bg-[#9be528] text-[#132408] flex items-center justify-center shadow-lg shadow-[#9be528]/40 hover:scale-105 active:scale-95 transition-all border-2 border-white"
              aria-label="Create Report"
            >
              <Plus className="w-6 h-6 stroke-[3.5]" />
            </button>
          </div>

          <button
            onClick={() => setCurrentTab('cases')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 relative transition-colors ${
              currentTab === 'cases' ? 'text-[#192b0f] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FolderCheck className={`w-5 h-5 ${currentTab === 'cases' ? 'text-[#65a30d] stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold">My Cases</span>
            {activeMatchesCount > 0 && (
              <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-[#9be528] text-[#132408] font-black text-[9px] flex items-center justify-center shadow-xs">
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
              currentTab === 'moderator' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-rose-600'
            }`}
          >
            <Shield className={`w-5 h-5 ${currentTab === 'moderator' ? 'text-rose-600 stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold">Safety Desk</span>
          </button>
        </div>

        {/* iPhone Home Indicator Bar */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1.5 opacity-60" />
      </div>
    </>
  );
};

