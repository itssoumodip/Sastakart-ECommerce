import React from 'react';

// This component provides pattern overlays to enhance the retro aesthetic
const RetroPatterns = () => {
  return (
    <style jsx global>{`
      /* Grid Patterns */
      .pattern-grid-sm {
        background-image: linear-gradient(white 1px, transparent 1px),
                          linear-gradient(90deg, white 1px, transparent 1px);
        background-size: 10px 10px;
      }
      
      .pattern-grid-lg {
        background-image: linear-gradient(white 1px, transparent 1px),
                          linear-gradient(90deg, white 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      /* Stripe Patterns */
      .pattern-stripes {
        background-image: repeating-linear-gradient(
          -45deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.1) 2px,
          transparent 2px,
          transparent 6px
        );
      }
      
      .pattern-stripes-vertical {
        background-image: repeating-linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 2px,
          transparent 2px,
          transparent 10px
        );
      }
      
      .pattern-stripes-horizontal {
        background-image: repeating-linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.05) 2px,
          transparent 2px,
          transparent 10px
        );
      }
      
      /* Dot Pattern */
      .pattern-dots {
        background-image: radial-gradient(
          white 1px,
          transparent 1px
        );
        background-size: 10px 10px;
      }
      
      /* Zigzag Pattern */
      .pattern-zigzag {
        background-image: 
          linear-gradient(135deg, white 25%, transparent 25%) 0 0,
          linear-gradient(225deg, white 25%, transparent 25%) 0 0,
          linear-gradient(315deg, white 25%, transparent 25%) 0 0,
          linear-gradient(45deg, white 25%, transparent 25%) 0 0;
        background-size: 10px 10px;
        background-color: transparent;
        opacity: 0.05;
      }
      
      /* Checkerboard Pattern */
      .pattern-checkerboard {
        background-image: 
          linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      }

      /* Retro CRT Effects */
      .crt-effect {
        position: relative;
        overflow: hidden;
      }
      
      .crt-effect:before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                    linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.06));
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
        z-index: 100;
        animation: flicker 0.15s infinite;
      }
      
      .scanline {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.02) 50%, transparent);
        animation: scanline 10s linear infinite;
        pointer-events: none;
      }
      
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }

      @keyframes flicker {
        0% { opacity: 0.97; }
        5% { opacity: 0.98; }
        10% { opacity: 0.9; }
        15% { opacity: 1; }
        50% { opacity: 0.99; }
        80% { opacity: 0.96; }
        95% { opacity: 0.94; }
        100% { opacity: 0.98; }
      }

      /* Pixel Design Elements */
      .pixel-corners {
        clip-path: 
          polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          );
      }

      /* Vintage Border */
      .vintage-border {
        position: relative;
      }
      
      .vintage-border:after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        border: 1px dashed rgba(255, 255, 255, 0.3);
        pointer-events: none;
      }
      
      /* Noise Overlay */
      .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.05;
        pointer-events: none;
        z-index: 9999;
      }
    `}</style>
  );
};

export default RetroPatterns;
