import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const isLastSlide = currentIndex === slides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
    // Define styles - updated for QuickCart-like minimalist design
  const sliderStyles = {
    container: {
      position: 'relative',
      height: '320px',
      width: '100%',
      '@media (min-width: 640px)': {
        height: '360px',
      },
      '@media (min-width: 768px)': {
        height: '400px',
      },
      '@media (min-width: 1024px)': {
        height: '480px',
      },
    },
    slideContainer: {
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    },
    slide: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    slideBackground: (imageUrl) => ({
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: `url(${imageUrl})`,
    }),
    overlay: {
      position: 'absolute',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },    contentContainer: {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 1.5rem',
      color: '#ffffff',
      maxWidth: '90rem',
      margin: '0 auto',
      '@media (min-width: 640px)': {
        padding: '0 2rem',
      },
      '@media (min-width: 768px)': {
        padding: '0 3rem',
      },
    },
    heading: {
      fontSize: '1.75rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      maxWidth: '28rem',
      '@media (min-width: 640px)': {
        fontSize: '2rem',
        marginBottom: '0.75rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '2.5rem',
      },
    },
    description: {
      fontSize: '0.95rem',
      marginBottom: '1rem',
      maxWidth: '26rem',
      opacity: '0.9',
      '@media (min-width: 640px)': {
        fontSize: '1rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '1.1rem',
        marginBottom: '1.25rem',
      },
    },
    button: {
      backgroundColor: '#ffffff',
      color: '#111',
      padding: '0.6rem 1.25rem',
      borderRadius: '4px',
      fontWeight: '500',
      fontSize: '0.9rem',
      display: 'inline-block',
      transition: 'all 200ms ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },    arrowButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '0.4rem',
      borderRadius: '50%',
      color: '#ffffff',
      cursor: 'pointer',
      zIndex: '10',
      transition: 'all 200ms ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    leftArrow: {
      left: '1rem',
    },
    rightArrow: {
      right: '1rem',
    },
    dotsContainer: {
      position: 'absolute',
      bottom: '1rem',
      left: '0',
      right: '0',
    },
    dotsInner: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    dot: (isActive) => ({
      width: isActive ? '1.5rem' : '0.5rem',
      height: '0.25rem',
      transition: 'all 200ms ease',
      backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
    }),
  };

  return (
    <div style={sliderStyles.container}>
      {/* Slide container */}      <div style={sliderStyles.slideContainer}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            style={sliderStyles.slide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div style={sliderStyles.slideBackground(slides[currentIndex].image)}>
              <div style={sliderStyles.overlay}></div>
              <div style={{...sliderStyles.contentContainer}}>
                <motion.h1 
                  style={sliderStyles.heading}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {slides[currentIndex].title}
                </motion.h1>
                <motion.p 
                  style={sliderStyles.description}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {slides[currentIndex].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <a 
                    href={slides[currentIndex].buttonLink} 
                    style={sliderStyles.button}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    {slides[currentIndex].buttonText}
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Arrow */}
      <button
        style={{...sliderStyles.arrowButton, ...sliderStyles.leftArrow}}
        onClick={goToPrevious}
        aria-label="Previous slide"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-50%)';
        }}
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        style={{...sliderStyles.arrowButton, ...sliderStyles.rightArrow}}
        onClick={goToNext}
        aria-label="Next slide"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-50%)';
        }}
      >
        <FiChevronRight size={20} />
      </button>

      {/* Dots */}
      <div style={sliderStyles.dotsContainer}>
        <div style={sliderStyles.dotsInner}>
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              style={sliderStyles.dot(slideIndex === currentIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
