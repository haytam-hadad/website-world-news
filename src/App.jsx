import React from 'react';
import Header from "./components/Header";
import Articles from "./components/Articles";
import Footer from './components/Footer';

function App() {
  return (
    <React.Fragment>
      <Header />
      <Articles />
      <Footer/>
    </React.Fragment>
  );
}

export default App;
