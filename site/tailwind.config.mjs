/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                primary: {
                    DEFAULT: '#ff6b35',
                    dark: '#e85a2a',
                    light: '#ff8555',
                },
                secondary: {
                    DEFAULT: '#004e89',
                    dark: '#003d6b',
                },
                accent: {
                    DEFAULT: '#ffd23f',
                    dark: '#ffb800',
                },
                // Background colors
                bg: {
                    DEFAULT: '#0a0e27',
                    secondary: '#141b3d',
                    tertiary: '#1e2749',
                },
                surface: {
                    DEFAULT: '#1a2142',
                    elevated: '#242d52',
                },
                // Text colors
                text: {
                    DEFAULT: '#ffffff',
                    secondary: '#b8c5d6',
                    tertiary: '#8a9ab0',
                },
                // Border colors
                border: {
                    DEFAULT: '#2a3555',
                    light: '#3a4565',
                },
                // Semantic colors
                success: '#00d9a3',
                warning: '#ffb800',
                error: '#ff4757',
                info: '#4facfe',
                // Glass effect
                glass: {
                    bg: 'rgba(26, 33, 66, 0.7)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            fontSize: {
                xs: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
                sm: ['clamp(0.875rem, 0.825rem + 0.25vw, 1rem)', { lineHeight: '1.6' }],
                base: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.7' }],
                lg: ['clamp(1.125rem, 1.05rem + 0.375vw, 1.375rem)', { lineHeight: '1.6' }],
                xl: ['clamp(1.25rem, 1.15rem + 0.5vw, 1.625rem)', { lineHeight: '1.5' }],
                '2xl': ['clamp(1.5rem, 1.35rem + 0.75vw, 2rem)', { lineHeight: '1.4' }],
                '3xl': ['clamp(1.875rem, 1.65rem + 1.125vw, 2.5rem)', { lineHeight: '1.3' }],
                '4xl': ['clamp(2.5rem, 2rem + 2vw, 4rem)', { lineHeight: '1.2' }],
                '5xl': ['clamp(3rem, 2.5rem + 2.5vw, 5rem)', { lineHeight: '1.1' }],
            },
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
                28: '7rem',
            },
            maxWidth: {
                container: '1400px',
                content: '70ch',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '3rem',
            },
            boxShadow: {
                sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
                DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.2)',
                md: '0 4px 16px rgba(0, 0, 0, 0.2)',
                lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
                xl: '0 16px 48px rgba(0, 0, 0, 0.4)',
                '2xl': '0 24px 64px rgba(0, 0, 0, 0.5)',
                glow: '0 0 32px rgba(255, 107, 53, 0.3)',
                'glow-accent': '0 0 24px rgba(255, 210, 63, 0.4)',
                subtle: '0 10px 30px rgba(18, 19, 22, 0.5)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #ff6b35 0%, #ff8555 50%, #ffa575 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #004e89 0%, #0066b3 100%)',
                'gradient-accent': 'linear-gradient(135deg, #ffd23f 0%, #ffb800 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #141b3d 100%)',
                'gradient-hero': 'linear-gradient(135deg, #ff6b35 0%, #004e89 50%, #0a0e27 100%)',
                'gradient-card': 'linear-gradient(145deg, rgba(26, 33, 66, 0.8) 0%, rgba(20, 27, 61, 0.9) 100%)',
                'gradient-warm': 'linear-gradient(135deg, rgba(139,106,88,0.15) 0%, rgba(31,32,36,0.9) 100%)',
                'gradient-copper': 'linear-gradient(135deg, #8B6A58 0%, #C5693D 100%)',
            },
            backdropBlur: {
                glass: '20px',
            },
            transitionTimingFunction: {
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
            },
            transitionDuration: {
                'fast': '200ms',
                'base': '350ms',
                'slow': '500ms',
            },
            animation: {
                'fade-in': 'fadeIn 500ms ease-out',
                'slide-in': 'slideIn 500ms ease-out',
                'pulse-slow': 'pulse 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
