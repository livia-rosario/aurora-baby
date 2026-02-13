import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const INSTAGRAM_URL = "https://www.instagram.com/aurorababyloja";

const InstagramFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const instagramImages = useQuery(api.aurora.getInstagramFeed) as any[] | undefined;

  useEffect(() => {
    if (!instagramImages || instagramImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= instagramImages.length ? 0 : prev + 4));
    }, 8000);

    return () => clearInterval(interval);
  }, [instagramImages]);

  if (!instagramImages || instagramImages.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 px-4 text-center text-gray-400 italic">
        Nenhuma foto no feed do Instagram ainda. Adicione algumas no painel Admin!
      </div>
    );
  }

  const currentImages = instagramImages.slice(currentIndex, currentIndex + 4);
  
  // Caso chegue no fim e não tenha 4 imagens, completa com as primeiras
  if (currentImages.length < 4) {
    const needed = 4 - currentImages.length;
    currentImages.push(...instagramImages.slice(0, needed));
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
            {currentImages.map((item, index) => (
              <a
                key={`${currentIndex}-${index}`}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden rounded-[16px] shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <motion.img
                  src={item.imageUrl}
                  alt={item.caption || `Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop";
                  }}
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
