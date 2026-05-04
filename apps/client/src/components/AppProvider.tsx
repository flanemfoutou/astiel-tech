'use client';

import { ReactNode } from 'react';
import { ClientProvider } from './ClientProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return <ClientProvider>{children}</ClientProvider>;
}
