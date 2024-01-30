import "@/styles/global.css";
import React from "react";
import Header from "@/components/ui/layout/header";
import Chat from "@/components/chat/chat";

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
      <main className="max-w-screen-2xl w-full py-4 mx-auto flex flex-col items-center">
        {children}
        <Chat />
      </main>
      {/*<footer className="py-16 bg-neutral-100 w-full">*/}
      {/*  <Footer />*/}
      {/*</footer>*/}
    </>
  );
}
