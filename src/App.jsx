import React from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';
import { useState } from 'react';

const apiKey = "7050f6e3f12b4a4794b0ab06803e88e5";

function App() {
  const [categState, setCategState] = useState('general');
  const [language, setLanguage] = useState('en');
  const [search, setSearch] = useState('');
  const [dosearch, setDosearch] = useState(false);

  return (
    <React.Fragment>
    <Header 
      setCategState={setCategState} 
      setLanguage={setLanguage} 
      language={language}
      search={search} 
      setSearch={setSearch} 
      setDosearch={setDosearch}
    />
    <Articles apiKey={apiKey} categState={categState} language={language}
      dosearch={dosearch} setDosearch={setDosearch} search={search}/>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
