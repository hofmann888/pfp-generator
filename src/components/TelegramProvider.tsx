'use client'

import { init } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      init();
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return (
    <>{children}</>
  )
}