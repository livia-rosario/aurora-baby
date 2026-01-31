import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INSTAGRAM_URL = "https://www.instagram.com/aurorababyboutique_/"; // Substitua pelo seu usuário real

const IMAGES = Array.from({ length: 15 }, (_, i) => `/images/instagram/ig-${i + 1}.png`);

const InstagramFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= IMAGES.length ? 0 : prev + 4));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentImages = IMAGES.slice(currentIndex, currentIndex + 4);
  
  // Caso chegue no fim e não tenha 4 imagens, completa com as primeiras
  if (currentImages.length < 4) {
    const needed = 4 - currentImages.length;
    currentImages.push(...IMAGES.slice(0, needed));
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4 col-span-2"
          >
            {currentImages.map((src, index) => (
              <a
                key={`${currentIndex}-${index}`}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden rounded-[16px] shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <motion.img
                  src={src}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InstagramFeed;
