import React from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const [categState, setCategState] = useState('general');

  return (
    <React.Fragment>
      <Header setCategState={setCategState}/>
      <Articles categState={categState} />
      <Footer/>
    </React.Fragment>
  );
}

export default App;
