import React, { useState } from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import TopSearchBar from './components/TopSearchBar';
import MainTitle from './components/MainTitle';
import { app } from './firebaseConfig';

const apiKey = "2375d165f5e8447d9334bfd59e44e34e";
const apiUrl = "https://newsapi.org/v2/";

const TopSearshsArray = ["russia and ukraine", "isreal and gaza", "morocco news", "USA election"];

function App() {
  const [categState, setCategState] = useState('general');
  const [language, setLanguage] = useState('en');
  const [search, setSearch] = useState('');
  const [dosearch, setDosearch] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showInpBox, setShowInpBox] = useState(false);

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
        showInpBox={showInpBox}
        setShowInpBox={setShowInpBox}
      />
      <TopSearchBar 
        TopSearshsArray={TopSearshsArray} 
        setSearch={setSearch} 
        setDosearch={setDosearch} 
        setShowInpBox={setShowInpBox}  
      />
      <MainTitle title={"Today's Top News Headlines"} />
      { showSideMenu ? <SideMenu setCategState={setCategState}/> : null }
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
    </React.Fragment>
  );
}

export default App;
