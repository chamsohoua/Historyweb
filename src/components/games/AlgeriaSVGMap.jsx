import React, { useState } from 'react';
import { algeriaWilayas } from '../../data/algeriaMapData';

export default function AlgeriaSVGMap({ paintedRegions = {}, highlightRegion = null, onRegionClick }) {
  // Initial ViewBox (Adjust these to match your full map coordinates)
  const initialVB = { x: 0, y: 0, w: 1000, h: 1000 };
  const [viewBox, setViewBox] = useState(`${initialVB.x} ${initialVB.y} ${initialVB.w} ${initialVB.h}`);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDoubleClick = (e) => {
    if (isZoomed) {
      // Zoom Out
      setViewBox(`${initialVB.x} ${initialVB.y} ${initialVB.w} ${initialVB.h}`);
      setIsZoomed(false);
    } else {
      // Zoom In to the click point
      const svg = e.currentTarget;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      
      // Convert screen pixels to SVG coordinates
      const coords = point.matrixTransform(svg.getScreenCTM().inverse());
      
      const zoomFactor = 0.4; // 40% of original size
      const newW = initialVB.w * zoomFactor;
      const newH = initialVB.h * zoomFactor;
      const newX = coords.x - newW / 2;
      const newY = coords.y - newH / 2;

      setViewBox(`${newX} ${newY} ${newW} ${newH}`);
      setIsZoomed(true);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={viewBox}
        onDoubleClick={handleDoubleClick}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="algeria-svg-wrap"
        style={{ transition: 'viewBox 0.4s ease-in-out', cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
      >
        <defs>
          <filter id="highlight">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#7C3AED" floodOpacity="0.5" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
          </filter>
        </defs>

        {algeriaWilayas.map((w) => {
          const pathData = typeof w.path === 'string' ? w.path : w.path?.props?.d;
          const colorIndex = paintedRegions[w.code];
          const isPainted = colorIndex !== undefined;
          const isHighlight = highlightRegion === w.code;

          return (
            <g key={w.code} className="wilaya-group">
              <path
                d={pathData}
                className={[
                  'map-region',
                  isPainted ? `painted-${colorIndex % 12}` : '',
                  isHighlight ? 'region-highlight-active' : '',
                ].join(' ')}
                onClick={() => onRegionClick && onRegionClick(w)}
                filter={isHighlight ? 'url(#highlight)' : undefined}
              >
                <title>{w.name}</title>
              </path>
              {(isPainted || isHighlight) && (
                <text
                  x={w.cx}
                  y={w.cy}
                  className="region-label"
                  style={{ 
                    opacity: 1, 
                    fontSize: isZoomed ? '4px' : '8px', 
                    pointerEvents: 'none' 
                  }}
                >
                  {w.code}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {isZoomed && (
        <button 
          onClick={() => { setViewBox(`0 0 1000 1000`); setIsZoomed(false); }}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            padding: '5px 10px', borderRadius: '5px', cursor: 'pointer',
            background: 'white', border: '1px solid #ccc', fontSize: '12px'
          }}
        >
          Reset View
        </button>
      )}
    </div>
  );
}