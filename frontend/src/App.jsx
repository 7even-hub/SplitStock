import { useState } from 'react'
import './App.css'
//imports your css file so this page's css gets applied 
  
import illustration from './assets/onboarding-illustration.jpg';

function App() {
  return (
    <div className="onboarding-screen">
      <p  className="onboarding-label"></p>
  
      <div className="onboarding-container">
        <div className="onboarding-left">
          <p className="logo-text"><strong>StockSplit</strong></p>
          
          <img 
            src={illustration}
            alt="A mini-mart"
            className="onboarding-image"
            style={{ width: '50%'}}
          />
        </div>
  
        <div className="onboarding-right">
  
          <div className="progress-bar">
            <span className="segment segment-active"></span>
            <span className="segment"></span>
            <span className="segment"></span>
          </div>
  
          <h1 className="onboarding-heading">
             Know what you have.<br /> 
             Know what you earn.
          </h1>
  
          <p className="onboarding-desrcription">
             StockSplit takes the heavy lifting out of retail bookkeeping,
             Easily manage bulk inventory, track repackaged items,
             record sales, and clearly see your profit margins-all in one place.
          </p>
  
          <p className="skip-text">
             SKIP
          </p>

          <button className="next-button">
             Next →
          </button>
        </div>
      </div>
    </div>
  );
}
  
  export default App;
  //This line makes the componenet available to use in other files.



