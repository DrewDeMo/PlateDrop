import { defineConfig } from 'tailwindcss/helpers'

export default defineConfig({
    darkMode: 'class',
    content: [
        './src/**/*.{astro,html,js,jsx,ts,tsx,mdx}',
        './components/**/*.{astro,html,js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                base: {
                    DEFAULT: '#121316', // charcoal
                    elevated: '#1A1B1E',
                    contrast: '#202226',
                },
                accent: {
                    mocha: '#8B6A58',
                    copper: '#C5693D',
                    lime: '#C7F000',
                },
                neutral: {
                    bone: '#D9D6CF',
                    ash: '#A0A3A8',
                },
            },
            backgroundImage: {
                'gradient-warm':
                    'linear-gradient(135deg, rgba(139,106,88,0.15) 0%, rgba(31,32,36,0.9) 100%)',
                'gradient-copper':
                    'linear-gradient(135deg, #8B6A58 0%, #C5693D 100%)',
            },
            fontFamily: {
                display: ['"Fraunces Variable"', 'serif'],
                sans: ['"Space Grotesk"', '"Inter Variable"', 'sans-serif'],
            },
            fontSize: {
                'hero-h1': ['clamp(4rem, 8vw, 4.5rem)', { lineHeight: '1.1' }],
                'hero-h2': ['clamp(2.625rem, 4vw, 3.5rem)', { lineHeight: '1.2' }],
                body: ['clamp(1rem, 1.1vw, 1.125rem)', { lineHeight: '1.75' }],
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },
            boxShadow: {
                glow: '0 0 15px rgba(199, 240, 0, 0.3)',
                subtle: '0 10px 30px rgba(18, 19, 22, 0.5)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
                28: '7rem',
            },
        },
    },
    plugins: [],
})
