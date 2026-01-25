/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0c0c0e',
                    card: '#111113',
                    border: '#27272a',
                    accent: '#22d3ee',
                },
                background: '#0c0c0e',
                foreground: '#d4d4d8',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
}
