import { useBreakpoint } from '@/hooks/useMediaQuery';

export function usePageStyles() {
  const { isMobile, isCompact } = useBreakpoint();

  return {
    main: {
      flex: 1,
      padding: isMobile ? '16px' : isCompact ? '24px 28px' : '36px 40px',
      overflowY: 'auto',
      minHeight: isCompact ? 'auto' : '100vh',
    },
    topRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: isMobile ? '12px' : '16px',
      marginBottom: isMobile ? '20px' : '28px',
    },
    title: {
      fontSize: isMobile ? '22px' : '26px',
      fontWeight: '700',
      letterSpacing: '-0.03em',
      color: '#1a1a1a',
      marginBottom: '4px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
    },
    cardPadding: isMobile ? '16px' : '24px',
  };
}
