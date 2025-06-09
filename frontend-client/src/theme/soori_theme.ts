export const SOORITheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#EFF6FF',
    tertiary: '#0E4A84',
    background: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#8E8E93',
    outline: '#C7C7CC',
    outlineVariant: '#E7E7E7',
    surfaceContainer: '#F5F5F5',
    error: '#FF382B',
  },
  typography: {
    titleLarge: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 700, // Bold
      fontSize: '20px',
      lineHeight: '30px',
      letterSpacing: '0px',
    },
    subtitleLarge: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 600, // Semibold
      fontSize: '20px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
    subtitleMedium: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 500, // Medium
      fontSize: '17px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
    bodyLarge: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 500, // Medium
      fontSize: '20px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
    bodyMedium: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 400, // Regular
      fontSize: '15px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
    bodySmall: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 300, // Regular
      fontSize: '13px',
      lineHeight: '18px',
      letterSpacing: '-0.08px',
    },
    labelMedium: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 500, // Medium
      fontSize: '13px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
    labelSmall: {
      fontFamily: 'Pretendard Variable',
      fontWeight: 400, // Regular
      fontSize: '12px',
      lineHeight: '22px',
      letterSpacing: '-0.41px',
    },
  },
}

export type SOORITheme = typeof SOORITheme
