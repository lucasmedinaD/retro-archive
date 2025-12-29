'use client';

import { useEffect, useState } from 'react';

export function useGyroscope() {
    const [gyroscope, setGyroscope] = useState({ beta: 0, gamma: 0 });
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const state = await (DeviceOrientationEvent as any).requestPermission();
                setPermission(state);
            } catch (error) {
                setPermission('denied');
            }
        } else {
            setPermission('granted');
        }
    };

    useEffect(() => {
        if (permission !== 'granted') return;

        const handle = (e: DeviceOrientationEvent) => {
            setGyroscope({ beta: e.beta || 0, gamma: e.gamma || 0 });
        };

        window.addEventListener('deviceorientation', handle);
        return () => window.removeEventListener('deviceorientation', handle);
    }, [permission]);

    // Map beta (-45 to 45) to 0-100%
    const sliderPosition = Math.max(0, Math.min(100, ((gyroscope.beta + 45) / 90) * 100));

    return { permission, requestPermission, sliderPosition };
}
