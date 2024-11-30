"use client";
import "./globals.css";
import Header from "../app/components/Header.jsx";
import Footer from "../app/components/Footer.jsx";
import ScrolleUp from "../app/components/ScrolleUp.jsx";
import { useState, useEffect } from "react";


export default function RootLayout({ children }) {

  const [categState, setCategState] = useState('general');
  const [language, setLanguage] = useState('en');
  const [showInpBox, setShowInpBox] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 300 && !showScrollUp) {
        setShowScrollUp(true);
      } else if (scrolled <= 300 && showScrollUp) {
        setShowScrollUp(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollUp]);


  return (
  <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <body>
      <Header
        setCategState={setCategState} 
        setLanguage={setLanguage} 
        language={language}
        showInpBox={showInpBox}
        setShowInpBox={setShowInpBox}
      />
        {children}
      <Footer />
      { showScrollUp && <ScrolleUp/> }
    </body>
  </html>

  );
}
