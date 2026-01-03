'use client';

import { useState } from 'react';
import MobileBottomNav from './MobileBottomNav';
import DonationModal from '@/components/DonationModal';

interface MobileLayoutWrapperProps {
    lang: 'en' | 'es';
}

export default function MobileLayoutWrapper({ lang }: MobileLayoutWrapperProps) {
    const [showDonation, setShowDonation] = useState(false);

    return (
        <>
            <MobileBottomNav
                lang={lang}
                onDonateClick={() => setShowDonation(true)}
            />
            <DonationModal
                isOpen={showDonation}
                onClose={() => setShowDonation(false)}
                lang={lang}
            />
        </>
    );
}
