import React from 'react';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png';
import hero_image from '../Assets/hero_image.webp';

const Hero = () => {
  const scrollToCollections = () => {
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className='hero' id='home'>
      <div className="hero-left">
        <div>
          <div className="hero-hand-icon">
            <p>New</p>
            <img src={hand_icon} alt="Hand icon" />
          </div>
          <p>Collections</p>
          <p>For Everyone</p>
        </div>
        <div 
          className="hero-latest-button" 
          onClick={scrollToCollections}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && scrollToCollections()}
        >
          <div>Latest Collections</div>
          <img src={arrow_icon} alt="Arrow icon" />
        </div>
      </div>

      <div className="hero-right">
        <img src={hero_image} alt="Hero" loading="lazy" />
      </div>
    </div>
  );
};

export default Hero;