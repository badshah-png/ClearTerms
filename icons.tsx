/**
 * icons.tsx — hand-drawn inline SVG icon set (single stroke style).
 * No icon font, no external requests: keeps the CSP tight and the bundle lean.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export function LogoMark(props: P) {
  return (
    <svg {...base(props)} viewBox="0 0 32 32" fill="none" stroke="none">
      <rect x="4" y="3" width="24" height="26" rx="3.5" fill="currentColor" />
      <rect x="9" y="9" width="14" height="2.4" rx="1.2" fill="#8a93a6" />
      <rect x="8" y="14.4" width="16" height="5" rx="1" fill="#ffde4d" />
      <rect x="9.5" y="16.1" width="11" height="1.7" rx="0.85" fill="#1b2433" />
      <rect x="9" y="22.6" width="10" height="2.4" rx="1.2" fill="#8a93a6" />
      <circle cx="24" cy="24" r="6" fill="#2e7d5b" stroke="#f6f5f0" strokeWidth="1.6" />
      <path
        d="M21.6 24.1l1.7 1.7 3-3.4"
        fill="none"
        stroke="#f6f5f0"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const IconPaste = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M9 10h6M9 13.5h6M9 17h3.5" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l7 2.8v5.4c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.8L12 3z" />
    <path d="M9 11.5l2.2 2.2L15.5 9" />
  </svg>
);

export const IconMask = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M4.5 19.5l15-15" />
    <path d="M8.5 12h.01M12 12h.01" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11.5" rx="2" />
    <path d="M15 5.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconFlag = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 21V4" />
    <path d="M6 4.5c3-1.8 6 1.8 9 0v8c-3 1.8-6-1.8-9 0" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" />
    <path d="M8 14h2.5M13.5 14H16M8 17h2.5" />
  </svg>
);

export const IconCoins = (p: P) => (
  <svg {...base(p)}>
    <ellipse cx="10" cy="7" rx="6" ry="3" />
    <path d="M4 7v5c0 1.6 2.7 3 6 3s6-1.4 6-3V7" />
    <path d="M4 12v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5" />
    <path d="M20 10.5v6c0 1.2-1.6 2.3-3.8 2.7" />
    <path d="M16.2 4.6c2.3.4 3.8 1.5 3.8 2.7 0 1.2-1.6 2.3-3.8 2.7" />
  </svg>
);

export const IconPen = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20l1.2-4.2L16.5 4.5a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20z" />
    <path d="M14.5 6.5l3 3" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.5V12l3 2.2" />
  </svg>
);

export const IconQuestion = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.6c-.8.35-1 .9-1 1.7" />
    <path d="M12 16.6h.01" />
  </svg>
);

export const IconScale = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v16M7 20h10" />
    <path d="M5 7h14" />
    <path d="M6.5 7l-2.8 6a3 3 0 0 0 5.6 0L6.5 7zM17.5 7l-2.8 6a3 3 0 0 0 5.6 0L17.5 7z" />
  </svg>
);

export const IconShred = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 10V5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5V10" />
    <rect x="3.5" y="10" width="17" height="4" rx="1" />
    <path d="M7 14v6M10.3 14v4.5M13.7 14v6M17 14v4.5" />
  </svg>
);

export const IconCpu = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="10" y="10" width="4" height="4" />
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13.5 5.5L20 12l-6.5 6.5" />
  </svg>
);

export const IconDoc = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h8l4 4V20.5H6V3.5z" />
    <path d="M14 3.5v4h4" />
    <path d="M9 12h6M9 15.5h6" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const IconEraser = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 20h13" />
    <path d="M9.5 19.5l-5-5a1.8 1.8 0 0 1 0-2.6l7.4-7.4a1.8 1.8 0 0 1 2.6 0l4.6 4.6a1.8 1.8 0 0 1 0 2.6l-7.5 7.8H9.5z" />
    <path d="M6.2 9.3l8 8" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconEye = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </svg>
);
