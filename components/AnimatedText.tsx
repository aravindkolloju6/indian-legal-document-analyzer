import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delayOffset?: number;
  letterDelay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delayOffset = 0,
  letterDelay = 0.03
}) => {
  return (
    <span className={`inline-flex ${className}`}>
      {text.split('').map((char, index) => (
        <span key={index} className="overflow-hidden inline-flex">
          <span
            className="inline-block animate-slide-down-clip"
            style={{ animationDelay: `${delayOffset + index * letterDelay}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
};
