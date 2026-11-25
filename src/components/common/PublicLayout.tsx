import React, { useState, ReactNode } from 'react';
import { TopEmergencyBar, MainNavbar, MobileStickyBottomBar } from './Header';
import { SiteFooter } from './Footer';
import { SearchOverlay } from '@/components/home/SearchOverlay';

interface PublicLayoutProps {
  children: ReactNode;
  showHeroNav?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-navy-deep text-foreground">
      <TopEmergencyBar />
      <MainNavbar onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <SiteFooter />
      <MobileStickyBottomBar />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};
