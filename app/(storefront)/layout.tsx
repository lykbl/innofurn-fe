import '@/styles/global.css';
import React from 'react';
import Header from '@/components/ui/layout/header';
import Chat from '@/components/chat/chat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*<header className="w-full">*/}
      <Header />
      {/*  <Subheader />*/}
      {/*</header>*/}
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col items-center py-4">
        {children}
        <Chat />
      </main>
      {/*<footer className="py-16 bg-neutral-100 w-full">*/}
      {/*  <Footer />*/}
      {/*</footer>*/}
    </>
  );
}
