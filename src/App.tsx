import React, { useState } from 'react';
import { StateProvider, useAppState } from './services/stateContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './features/home/HomeScreen';
import { SearchScreen } from './features/search/SearchScreen';
import { ItemDetailScreen } from './features/item/ItemDetailScreen';
import { ReportLostScreen } from './features/report/ReportLostScreen';
import { ReportFoundScreen } from './features/report/ReportFoundScreen';
import { ClaimChallengeModal } from './features/claim/ClaimChallengeModal';
import { HandoverScreen } from './features/handover/HandoverScreen';
import { ModeratorScreen } from './features/moderator/ModeratorScreen';
import { MyCasesScreen } from './features/cases/MyCasesScreen';
import { Item } from './types';

const MainApp: React.FC = () => {
  const { getItemById } = useAppState();

  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'cases' | 'moderator'>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeHandoverItemId, setActiveHandoverItemId] = useState<string | null>(null);

  // Modals
  const [reportModalType, setReportModalType] = useState<'lost' | 'found' | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setActiveHandoverItemId(null);
  };

  const handleSelectNotificationItem = (itemId: string) => {
    const it = getItemById(itemId);
    if (it) {
      setSelectedItem(it);
      setActiveHandoverItemId(null);
    }
  };

  const handleOpenHandover = (itemId: string) => {
    setActiveHandoverItemId(itemId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05140f] text-slate-100 selection:bg-lime-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab: any) => {
          setCurrentTab(tab);
          setSelectedItem(null);
          setActiveHandoverItemId(null);
        }}
        openReportModal={(type) => setReportModalType(type)}
        onSelectNotificationItem={handleSelectNotificationItem}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeHandoverItemId ? (
          <HandoverScreen
            itemId={activeHandoverItemId}
            onBack={() => setActiveHandoverItemId(null)}
          />
        ) : selectedItem ? (
          <ItemDetailScreen
            item={selectedItem}
            onBack={() => setSelectedItem(null)}
            onOpenClaimChallenge={(foundItem) => setClaimingItem(foundItem)}
            onOpenHandover={handleOpenHandover}
            onSelectCandidateItem={(candidate) => setSelectedItem(candidate)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onSelectItem={handleSelectItem}
                openReportModal={(type) => setReportModalType(type)}
                onNavigateSearch={() => setCurrentTab('search')}
              />
            )}

            {currentTab === 'search' && <SearchScreen onSelectItem={handleSelectItem} />}

            {currentTab === 'cases' && (
              <MyCasesScreen
                onSelectItem={handleSelectItem}
                onOpenHandover={handleOpenHandover}
                openReportModal={(type) => setReportModalType(type)}
              />
            )}

            {currentTab === 'moderator' && (
              <ModeratorScreen
                onSelectItem={handleSelectItem}
                onOpenHandover={handleOpenHandover}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Persistent Bottom Nav */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab: any) => {
          setCurrentTab(tab);
          setSelectedItem(null);
          setActiveHandoverItemId(null);
        }}
        openReportModal={(type) => setReportModalType(type)}
      />

      {/* Report Lost Modal */}
      {reportModalType === 'lost' && (
        <ReportLostScreen
          onClose={() => setReportModalType(null)}
          onItemCreated={(newItem) => {
            setSelectedItem(newItem);
          }}
        />
      )}

      {/* Report Found Modal */}
      {reportModalType === 'found' && (
        <ReportFoundScreen
          onClose={() => setReportModalType(null)}
          onItemCreated={(newItem) => {
            setSelectedItem(newItem);
          }}
        />
      )}

      {/* Ownership Challenge Modal */}
      {claimingItem && (
        <ClaimChallengeModal
          foundItem={claimingItem}
          onClose={() => setClaimingItem(null)}
          onClaimSubmitted={(res) => {
            if (res.passed) {
              setActiveHandoverItemId(claimingItem.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <StateProvider>
      <MainApp />
    </StateProvider>
  );
}
