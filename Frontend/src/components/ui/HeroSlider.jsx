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
  
  // Define styles
  const sliderStyles = {
    container: {
      position: 'relative',
      height: '400px',
      width: '100%',
      '@media (min-width: 640px)': {
        height: '450px',
      },
      '@media (min-width: 768px)': {
        height: '500px',
      },
      '@media (min-width: 1024px)': {
        height: '600px',
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
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    contentContainer: {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 24px',
      color: '#ffffff',
      maxWidth: '1024px',
      margin: '0 auto',
      '@media (min-width: 640px)': {
        padding: '0 48px',
      },
      '@media (min-width: 768px)': {
        padding: '0 64px',
      },
    },
    heading: {
      fontSize: '1.875rem',
      fontWeight: '700',
      marginBottom: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '2.25rem',
        marginBottom: '1rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '3rem',
      },
    },
    description: {
      fontSize: '1rem',
      marginBottom: '1.25rem',
      maxWidth: '32rem',
      '@media (min-width: 640px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width: 768px)': {
        fontSize: '1.25rem',
        marginBottom: '1.5rem',
      },
    },
    button: {
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999px',
      fontWeight: '500',
      display: 'inline-block',
      transition: 'background-color 300ms ease, box-shadow 300ms ease',
    },
    arrowButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      padding: '0.5rem',
      borderRadius: '9999px',
      color: '#ffffff',
      cursor: 'pointer',
      zIndex: '10',
      transition: 'background-color 300ms ease',
    },
    leftArrow: {
      left: '1rem',
    },
    rightArrow: {
      right: '1rem',
    },
    dotsContainer: {
      position: 'absolute',
      bottom: '-24px',
      left: '0',
      right: '0',
    },
    dotsInner: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.75rem',
    },
    dot: (isActive) => ({
      width: isActive ? '1.5rem' : '0.5rem',
      height: '0.5rem',
      borderRadius: '9999px',
      transition: 'all 300ms ease',
      backgroundColor: isActive ? '#000000' : '#9ca3af',
    }),
  };

  return (
    <div style={sliderStyles.container}>
      {/* Slide container */}
      <div style={sliderStyles.slideContainer}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            style={sliderStyles.slide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div style={sliderStyles.slideBackground(slides[currentIndex].image)}>
              <div style={sliderStyles.overlay}></div>
              <div style={{...sliderStyles.contentContainer}}>
                <motion.h1 
                  style={sliderStyles.heading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slides[currentIndex].title}
                </motion.h1>
                <motion.p 
                  style={sliderStyles.description}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {slides[currentIndex].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <a 
                    href={slides[currentIndex].buttonLink} 
                    style={sliderStyles.button}
                    className="hover:bg-gray-100 hover:shadow-md"
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
        className="hover:bg-opacity-60"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        style={{...sliderStyles.arrowButton, ...sliderStyles.rightArrow}}
        className="hover:bg-opacity-60"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
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
