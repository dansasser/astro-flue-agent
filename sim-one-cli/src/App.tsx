import React from 'react';
import { ChatLayout } from './components/ChatLayout.js';

export interface AppProps {
  baseUrl: string;
  session: string;
}

export function App({ baseUrl, session }: AppProps) {
  return <ChatLayout baseUrl={baseUrl} session={session} decidedBy={session} />;
}
