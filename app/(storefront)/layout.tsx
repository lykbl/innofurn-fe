import '@/styles/global.css';
import React from 'react';
import Header from '@/components/ui/layout/header/header';
import Chat from '@/components/chat/chat';
import Footer from '@/components/ui/layout/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col py-4">
        {children}
        <Chat />
      </main>
      <Footer />
    </>
  );
}
