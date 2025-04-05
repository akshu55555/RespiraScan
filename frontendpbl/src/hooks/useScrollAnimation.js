import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const scrollElements = document.querySelectorAll('.fade-in');
    
    const elementInView = (el, dividend = 1) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
      );
    };
    
    const displayScrollElement = (element) => {
      element.classList.add('visible');
    };
    
    const hideScrollElement = (element) => {
      element.classList.remove('visible');
    };
    
    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
          displayScrollElement(el);
        } else {
          hideScrollElement(el);
        }
      });
    };
    
    // Initialize on load
    setTimeout(() => {
      handleScrollAnimation();
    }, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);
};

export default useScrollAnimation;