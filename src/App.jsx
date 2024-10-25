import React from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';
import { useState  } from 'react';
import SideMenu from './components/SideMenu';
import TopSearchBar from './components/TopSearchBar';
import MainTitle from './components/MainTitle';

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;



function App() {
  const [categState, setCategState] = useState('general');
  const [language, setLanguage] = useState('en');
  const [search, setSearch] = useState('');
  const [dosearch, setDosearch] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <React.Fragment>
      <Header 
        setCategState={setCategState} 
        setLanguage={setLanguage} 
        language={language}
        search={search} 
        setSearch={setSearch} 
        setDosearch={setDosearch}
        setShowSideMenu={setShowSideMenu}
      />
      <TopSearchBar/>
      <MainTitle title={"Today's Top News Headlines"}/>
      { showSideMenu ?  <SideMenu setCategState={setCategState}/> : null }
      <Articles apiUrl={apiUrl} apiKey={apiKey} categState={categState} language={language}
        dosearch={dosearch} setDosearch={setDosearch} search={search}/>
        <Footer/>
    </React.Fragment>
  );
}

export default App;
