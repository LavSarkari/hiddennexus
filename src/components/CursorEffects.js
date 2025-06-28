import { useEffect } from 'react';

const CursorEffects = () => {
  useEffect(() => {
    // Cursor shadow
    const shadow = document.createElement('div');
    shadow.className = 'cursor-shadow';
    document.body.appendChild(shadow);

    const moveShadow = (e) => {
      shadow.style.transform = `translate3d(${e.clientX - 30}px, ${e.clientY - 30}px, 0)`;
    };
    window.addEventListener('mousemove', moveShadow);

    // Glass reflection overlays
    const addReflections = () => {
      document.querySelectorAll('.glass').forEach((el) => {
        if (!el.querySelector('.glass-reflection')) {
          const reflection = document.createElement('div');
          reflection.className = 'glass-reflection';
          el.style.position = 'relative';
          el.appendChild(reflection);
        }
      });
    };
    addReflections();
    // Also add on route/page changes
    const observer = new MutationObserver(addReflections);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveShadow);
      document.body.removeChild(shadow);
      observer.disconnect();
    };
  }, []);
  return null;
};

export default CursorEffects; 