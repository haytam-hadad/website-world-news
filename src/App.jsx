import React, { useState } from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';
import ScrolleUp from "./components/ScrolleUp";
import { useEffect } from 'react';

const apiKey = "2375d165f5e8447d9334bfd59e44e34e";
const apiUrl = "https://newsapi.org/v2";

function App() {
  const [categState, setCategState] = useState('general');
  const [language, setLanguage] = useState('en');
  const [search, setSearch] = useState('');
  const [dosearch, setDosearch] = useState(false);
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
    <React.Fragment>
      <Header 
        setCategState={setCategState} 
        setLanguage={setLanguage} 
        language={language}
        search={search} 
        setSearch={setSearch} 
        setDosearch={setDosearch}
        showInpBox={showInpBox}
        setShowInpBox={setShowInpBox}
      />

      <Articles 
        apiUrl={apiUrl} 
        apiKey={apiKey} 
        categState={categState} 
        language={language}
        dosearch={dosearch} 
        setDosearch={setDosearch} 
        search={search}
      />
      <Footer />

      { showScrollUp && <ScrolleUp/> }
    
    </React.Fragment>
  );
}

export default App;
