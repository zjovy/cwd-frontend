import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
};

export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);
  const isTablet = useMediaQuery(
    `(max-width: ${BREAKPOINTS.tablet}px) and (min-width: ${BREAKPOINTS.mobile + 1}px)`
  );
  const isCompact = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);

  return { isMobile, isTablet, isCompact, isDesktop: !isCompact };
}
