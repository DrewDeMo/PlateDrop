/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // 2026 Premium Color System with HSL for dark mode
                primary: {
                    50: '#fff5f2',
                    100: '#ffe8e0',
                    200: '#ffd1c2',
                    300: '#ffb199',
                    400: '#ff8555',
                    500: '#ff6b35', // DEFAULT
                    600: '#f55520',
                    700: '#e03f15',
                    800: '#b83316',
                    900: '#962d19',
                    950: '#52140a',
                    DEFAULT: '#ff6b35',
                    dark: '#e03f15',
                    light: '#ff8555',
                },
                secondary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#b9e6fe',
                    300: '#7cd4fd',
                    400: '#36bffa',
                    500: '#0ba5e9',
                    600: '#004e89', // DEFAULT
                    700: '#036aa3',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                    DEFAULT: '#004e89',
                    dark: '#036aa3',
                },
                accent: {
                    50: '#fffbeb',
                    100: '#fff4c6',
                    200: '#ffe888',
                    300: '#ffd23f', // DEFAULT
                    400: '#ffc107',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                    DEFAULT: '#ffd23f',
                    dark: '#f59e0b',
                },
                // Dark-first background system
                bg: {
                    DEFAULT: '#0a0d1a',
                    secondary: '#111827',
                    tertiary: '#1f2937',
                    elevated: '#374151',
                },
                surface: {
                    DEFAULT: 'rgba(17, 24, 39, 0.8)',
                    elevated: 'rgba(31, 41, 55, 0.9)',
                    glass: 'rgba(17, 24, 39, 0.6)',
                },
                // Refined text hierarchy
                text: {
                    DEFAULT: '#f9fafb',
                    secondary: '#d1d5db',
                    tertiary: '#9ca3af',
                    muted: '#6b7280',
                },
                // Sophisticated borders
                border: {
                    DEFAULT: 'rgba(255, 255, 255, 0.08)',
                    light: 'rgba(255, 255, 255, 0.12)',
                    strong: 'rgba(255, 255, 255, 0.16)',
                },
                // Semantic colors with dark mode support
                success: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                error: {
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
                info: {
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                },
            },
            fontFamily: {
                sans: [
                    'Inter var',
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
                display: [
                    'Inter var',
                    'Inter',
                    'system-ui',
                    'sans-serif',
                ],
                mono: [
                    'JetBrains Mono',
                    'Fira Code',
                    'Consolas',
                    'monospace',
                ],
            },
            // Fluid typography with optical sizing
            fontSize: {
                xs: ['clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)', {
                    lineHeight: '1.5',
                    letterSpacing: '0.01em',
                }],
                sm: ['clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem)', {
                    lineHeight: '1.6',
                    letterSpacing: '0.005em',
                }],
                base: ['clamp(1rem, 0.975rem + 0.15vw, 1.0625rem)', {
                    lineHeight: '1.7',
                    letterSpacing: '0',
                }],
                lg: ['clamp(1.125rem, 1.075rem + 0.25vw, 1.25rem)', {
                    lineHeight: '1.6',
                    letterSpacing: '-0.01em',
                }],
                xl: ['clamp(1.25rem, 1.175rem + 0.375vw, 1.5rem)', {
                    lineHeight: '1.5',
                    letterSpacing: '-0.015em',
                }],
                '2xl': ['clamp(1.5rem, 1.375rem + 0.625vw, 1.875rem)', {
                    lineHeight: '1.4',
                    letterSpacing: '-0.02em',
                }],
                '3xl': ['clamp(1.875rem, 1.675rem + 1vw, 2.5rem)', {
                    lineHeight: '1.3',
                    letterSpacing: '-0.025em',
                }],
                '4xl': ['clamp(2.25rem, 1.875rem + 1.875vw, 3.5rem)', {
                    lineHeight: '1.2',
                    letterSpacing: '-0.03em',
                }],
                '5xl': ['clamp(3rem, 2.25rem + 3.75vw, 5.5rem)', {
                    lineHeight: '1.1',
                    letterSpacing: '-0.035em',
                }],
                '6xl': ['clamp(3.75rem, 2.75rem + 5vw, 7rem)', {
                    lineHeight: '1',
                    letterSpacing: '-0.04em',
                }],
            },
            // Refined 4px spacing system
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
                26: '6.5rem',
                28: '7rem',
                30: '7.5rem',
                34: '8.5rem',
                38: '9.5rem',
                42: '10.5rem',
                128: '32rem',
                144: '36rem',
            },
            maxWidth: {
                container: '1440px',
                content: '65ch',
                prose: '75ch',
            },
            // Softer, more refined border radius
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.75rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
            },
            // Elevation-based shadow system
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                sm: '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
                DEFAULT: '0 4px 16px -4px rgba(0, 0, 0, 0.15), 0 8px 24px -8px rgba(0, 0, 0, 0.15)',
                md: '0 8px 24px -6px rgba(0, 0, 0, 0.2), 0 12px 32px -8px rgba(0, 0, 0, 0.2)',
                lg: '0 12px 32px -8px rgba(0, 0, 0, 0.25), 0 16px 48px -12px rgba(0, 0, 0, 0.25)',
                xl: '0 16px 48px -12px rgba(0, 0, 0, 0.3), 0 24px 64px -16px rgba(0, 0, 0, 0.3)',
                '2xl': '0 24px 64px -16px rgba(0, 0, 0, 0.4), 0 32px 96px -24px rgba(0, 0, 0, 0.4)',
                // Premium glow effects
                glow: '0 0 32px rgba(255, 107, 53, 0.25), 0 8px 24px rgba(255, 107, 53, 0.15)',
                'glow-lg': '0 0 48px rgba(255, 107, 53, 0.3), 0 12px 32px rgba(255, 107, 53, 0.2)',
                'glow-accent': '0 0 24px rgba(255, 210, 63, 0.3), 0 8px 20px rgba(255, 210, 63, 0.2)',
                // Soft depth
                soft: '0 8px 32px rgba(0, 0, 0, 0.12)',
                'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',
                // Inner shadows for depth
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
            },
            // Modern gradient system
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)',
                'gradient-primary-soft': 'linear-gradient(135deg, rgba(255, 107, 53, 0.8) 0%, rgba(255, 133, 85, 0.6) 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #004e89 0%, #036aa3 100%)',
                'gradient-accent': 'linear-gradient(135deg, #ffd23f 0%, #f59e0b 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)',
                'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.15) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.15) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.1) 0px, transparent 50%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            },
            backdropBlur: {
                xs: '2px',
                glass: '24px',
                strong: '40px',
            },
            // Premium easing curves
            transitionTimingFunction: {
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
                'snappy': 'cubic-bezier(0.4, 0, 0.1, 1)',
                'gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            transitionDuration: {
                'fast': '150ms',
                'base': '250ms',
                'smooth': '350ms',
                'slow': '500ms',
                'slower': '700ms',
            },
            opacity: {
                2: '0.02',
                3: '0.03',
                15: '0.15',
            },
            // Modern animation system
            animation: {
                'fade-in': 'fadeIn 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                'fade-in-up': 'fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-in': 'slideIn 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-in-right': 'slideInRight 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient': 'gradient 8s ease infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-32px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(32px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(255, 107, 53, 0.5)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
}
