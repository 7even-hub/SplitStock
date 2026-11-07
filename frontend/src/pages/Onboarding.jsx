import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//imports your css file so this page's css gets applied 
import illustration from "../assets/chatgpt.png";
import './Onboarding.scss';


function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const stepContent = {
    1: {
      heading: 'Know what you have.\nknow what you earn.',
      description: 'StockSplit takes the heavy lifting out of retail bookkeeping. Easily manage bulk inventory, track repackaged items, record sales, and clearly see your profit margins- all in one place.'
    },
    2: {
      heading: 'Track every repackaged unit.',
      description: 'See exactly how much of your bulk purchases turn  into daily retail sales, repack and split break down bulk items into retail units, and track your profit margin at every step.'
    },
    3: {
      heading: 'Built for the way Nigerian mini marts sell.',
      description: 'Stop struggling with generic inventory systems. We speak your language. Sell in the units your customers actually buy.'
    }
  };

  // const signUp = () => {
  //   <SignUp></SignUp>
  // }

  const handleNext = () => {
    const maxSteps = Object.keys(stepContent).length;
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/signup');
      // You can navigate to another page here if needed
    }
  };
  // total number of steps
  const maxSteps = Object.keys(stepContent).length;

  return (
    <>
      <div className="onboarding-screen">
        <p  className="onboarding-label"></p>
    
        <div className="onboarding-container">
          <div className="onboarding-left">
            <img 
              src={illustration}
              alt="A mini-mart"
              className="onboarding-image"
            />
          </div>
    
          <div className="onboarding-right">
    
            <div className="progress-bar">
              <span className={currentStep >= 1 ? 'segment segment-active' : 'segment'}
              onClick={() => setCurrentStep(1)}></span>
              <span className={currentStep >= 2 ? 'segment segment-active' : 'segment'}
              onClick={() => setCurrentStep(2)}></span>
              <span className={currentStep >= 3 ? 'segment segment-active' : 'segment'}
              onClick={() => setCurrentStep(3)}></span>
            </div>

            <div className="onboarding-content">
             <h1 className="onboarding-heading">
                {stepContent[currentStep].heading}
             </h1>

              <p className="onboarding-description">
                {stepContent[currentStep].description}
              </p>
            </div>
    
              <div className="onboarding-footer">
                <p className="skip-text">
                  Skip
                </p>
                
                {/* to make two pages go back to the previous page instead of three */}
                {currentStep > 1 && (
                  <button className="back-button"
                  onClick={() => setCurrentStep(currentStep - 1)}> 
                    ← Back
                  </button>
                )}
               
                <button className="next-button"
                onClick={handleNext}>
                  {currentStep === maxSteps ? "Get Started" : "Next →"}
                </button>
              </div>
          </div>
        </div>
      </div>

      
    </>
  );
}
  
  export default Onboarding;
  //This line makes the componenet available to use in other files.


