// src/components/games/AlgeriaSVGMap.jsx
// Full Algeria map with 48 wilayas as interactive SVG regions

import { algeriaWilayas } from '../../data/algeriaMapData';

// Full accurate simplified SVG paths for Algeria's 48 wilayas
// Coordinate space: viewBox="0 0 520 700"
// North is top, regions scaled to fit

const WILAYA_PATHS = {
  // Northern coastal belt
  ALG: 'M168,68 L182,64 L188,72 L184,84 L170,87 L163,78 Z',
  TIP: 'M128,72 L148,68 L154,78 L148,90 L130,90 L122,82 Z',
  BOC: 'M184,64 L202,60 L208,70 L204,82 L188,82 L182,72 Z',
  BLI: 'M138,82 L164,79 L168,94 L160,104 L136,102 L132,90 Z',
  TIZ: 'M202,60 L238,56 L244,70 L238,84 L204,82 L202,68 Z',
  BJA: 'M238,56 L272,52 L278,66 L272,80 L240,82 L236,68 Z',
  JIJ: 'M272,52 L304,48 L308,62 L302,76 L274,78 L270,64 Z',
  SKI: 'M304,48 L340,44 L346,60 L340,74 L306,74 L302,60 Z',
  ANN: 'M368,44 L404,40 L410,56 L404,70 L370,70 L366,54 Z',
  ETA: 'M404,40 L432,38 L438,56 L430,68 L406,68 L402,54 Z',

  // Northern inland
  ORA: 'M30,82 L64,78 L70,96 L62,110 L32,110 L24,96 Z',
  ATE: 'M18,96 L50,92 L56,110 L48,124 L20,124 L12,110 Z',
  TLE: 'M4,90 L34,86 L40,106 L32,120 L6,120 L0,104 Z',
  SBA: 'M36,116 L72,112 L78,132 L70,148 L38,148 L30,132 Z',
  MOS: 'M66,80 L96,76 L100,96 L92,110 L68,110 L62,94 Z',
  CHE: 'M74,94 L112,90 L118,110 L108,126 L76,126 L68,108 Z',
  AIN: 'M112,90 L150,86 L154,108 L144,122 L114,122 L108,106 Z',
  TIA: 'M108,136 L156,130 L162,158 L150,174 L110,172 L102,152 Z',
  SAI: 'M50,148 L100,142 L106,172 L92,190 L52,188 L44,168 Z',
  REL: 'M84,104 L124,100 L128,124 L116,140 L86,138 L78,118 Z',
  MAS: 'M66,130 L110,124 L116,154 L102,172 L68,170 L58,148 Z',
  NAA: 'M38,196 L98,188 L106,236 L88,256 L40,252 L28,228 Z',
  TIS: 'M106,116 L148,110 L154,136 L140,154 L108,152 L100,130 Z',
  MED: 'M138,106 L184,100 L190,128 L176,148 L140,146 L130,122 Z',

  // Tell Atlas region
  ALI: 'M160,78 L210,72 L218,98 L204,116 L162,114 L152,92 Z', // Algiers area
  CON: 'M324,82 L366,78 L372,106 L358,124 L326,122 L316,98 Z',
  OEB: 'M296,82 L328,78 L334,104 L320,122 L298,120 L288,100 Z',
  MIL: 'M296,118 L332,112 L338,140 L322,160 L298,158 L288,136 Z',
  GUE: 'M346,106 L388,100 L394,130 L378,150 L348,148 L340,124 Z',
  SOK: 'M368,118 L408,112 L414,142 L396,162 L370,160 L360,136 Z',
  ANN2:'M368,68 L408,62 L414,86 L400,102 L370,100 L362,80 Z',

  // Aures-Nemencha
  BAT: 'M292,126 L360,120 L366,164 L346,184 L294,180 L282,154 Z',
  KHE: 'M340,158 L392,150 L400,184 L380,206 L342,204 L330,178 Z',
  TEB: 'M358,136 L416,130 L424,168 L404,192 L360,188 L350,162 Z',

  // Hauts Plateaux
  LAG: 'M156,222 L238,212 L246,264 L216,284 L158,280 L144,252 Z',
  DJE: 'M170,174 L250,164 L260,218 L228,240 L172,236 L158,202 Z',
  MSI: 'M230,152 L308,142 L316,196 L282,220 L232,216 L218,170 Z',
  SET: 'M258,98 L318,92 L326,128 L300,150 L260,148 L246,116 Z',
  BSK: 'M264,172 L356,162 L366,220 L326,248 L266,244 L250,198 Z',
  EOB: 'M336,218 L420,208 L430,278 L388,304 L338,300 L320,258 Z',

  // Pre-Saharan
  BOD2:'M194,90 L252,84 L260,114 L236,136 L196,134 L182,106 Z',
  EBA: 'M74,202 L162,190 L172,252 L134,278 L76,272 L60,234 Z',

  // Saharan North
  GHR: 'M210,262 L298,252 L308,320 L266,348 L212,344 L194,298 Z',
  OUA: 'M270,286 L390,272 L404,370 L344,400 L272,396 L252,338 Z',

  // Deep Sahara
  ADR: 'M90,412 L278,396 L292,512 L196,546 L92,540 L70,466 Z',
  BEC: 'M36,272 L136,260 L148,356 L96,386 L38,380 L20,322 Z',
  TIN: 'M2,390 L128,374 L144,510 L72,542 L4,528 Z',
  TAM: 'M230,476 L380,456 L396,644 L298,670 L232,664 L208,560 Z',
  ILL: 'M360,410 L480,392 L494,560 L420,590 L362,578 L340,486 Z',
};

export default function AlgeriaSVGMap({ paintedRegions = {}, highlightRegion = null, onRegionClick }) {
  return (
    <svg
      viewBox="0 0 500 700"
      xmlns="http://www.w3.org/2000/svg"
      className="algeria-svg-wrap"
      aria-label="Map of Algeria"
    >
      {/* Background faint outline of Algeria */}
      <defs>
        <filter id="regionGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="highlight">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#7C3AED" floodOpacity="0.5" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
      </defs>

      {algeriaWilayas.map((w, i) => {
        const pathData    = WILAYA_PATHS[w.code] || w.path;
        const colorIndex  = paintedRegions[w.code];
        const isPainted   = colorIndex !== undefined;
        const isHighlight = highlightRegion === w.code;

        return (
          <g key={w.code} className="wilaya-group">
            <path
              d={pathData}
              className={[
                'map-region',
                isPainted   ? `painted-${colorIndex % 12}` : '',
                isPainted   ? 'just-painted'                : '',
                isHighlight ? 'region-highlight-active'      : '',
              ].join(' ')}
              onClick={() => onRegionClick && onRegionClick(w)}
              aria-label={w.name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onRegionClick?.(w)}
              filter={isHighlight ? 'url(#highlight)' : undefined}
            >
              <title>{w.name} — {w.nameAr}</title>
            </path>
            {/* Label (visible when painted or highlighted) */}
            {(isPainted || isHighlight) && (
              <text
                x={w.cx}
                y={w.cy}
                className="region-label"
                style={{ opacity: 1, fontSize: w.cx > 300 ? '8px' : '6px' }}
              >
                {w.code}
              </text>
            )}
          </g>
        );
      })}

      {/* Algeria border outline (simplified) */}
      <path
        d="M4,90 L0,104 L12,110 L18,96 L24,96 L30,82 L66,78 L96,76 L74,94 L112,90 L150,86 L164,79
           L168,68 L182,64 L184,72 L202,60 L238,56 L272,52 L304,48 L340,44 L366,44 L368,44 L404,40
           L432,38 L438,56 L432,68 L410,56 L404,70 L408,62 L414,86 L400,102 L408,112 L414,142
           L396,162 L400,184 L404,192 L424,168 L416,130 L358,136 L350,162 L342,204 L380,206 L400,184
           L390,150 L340,158 L330,178 L294,180 L282,154 L266,244 L250,198 L232,216 L218,170
           L260,148 L246,116 L258,98 L260,114 L316,196 L326,248 L320,258 L338,300 L388,304
           L430,278 L420,208 L336,218 L308,320 L266,348 L212,344 L194,298 L172,252 L134,278
           L76,272 L60,234 L38,380 L96,386 L148,356 L136,260 L36,272 L20,322 L4,390 L4,528
           L72,542 L144,510 L128,374 L232,664 L298,670 L396,644 L380,456 L340,486 L362,578
           L420,590 L494,560 L480,392 L360,410 L338,486 L292,512 L196,546 L92,540 L70,466
           L90,412 L208,560 L230,476 Z"
        fill="none"
        stroke="rgba(61,43,31,0.3)"
        strokeWidth="1"
        strokeDasharray="4 2"
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  );
}
