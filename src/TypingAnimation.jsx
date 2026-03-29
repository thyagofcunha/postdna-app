import React, { useState, useEffect } from 'react';

export default function TypingAnimation({ words, loop = true, speed = 100, delay = 2000, className }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const word = words[currentWordIndex];

    const type = () => {
      setCurrentText(word.substring(0, currentText.length + 1));
    };

    const erase = () => {
      setCurrentText(word.substring(0, currentText.length - 1));
    };

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        if (!loop && currentWordIndex === words.length - 1) return;
        timeout = setTimeout(type, 500); // pause before tying next word
      } else {
        timeout = setTimeout(erase, speed / 2);
      }
    } else {
      if (currentText === word) {
        timeout = setTimeout(() => setIsDeleting(true), delay); // pause before erasing
      } else {
        timeout = setTimeout(type, speed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, loop, speed, delay]);

  return <span className={className}>{currentText}<span className="animate-blink border-r-2 border-accent border-solid pr-1 ml-0.5" /></span>;
}
