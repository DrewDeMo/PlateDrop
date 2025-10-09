import { useEffect, useState } from 'react'

export default function ScrollProgress() {
    const [scrolled, setScrolled] = useState(0)

    useEffect(() => {
        const updateScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.body.scrollHeight - window.innerHeight
            const scrollPercent = (scrollTop / docHeight) * 100
            setScrolled(scrollPercent)
        }

        window.addEventListener('scroll', updateScroll)
        return () => window.removeEventListener('scroll', updateScroll)
    }, [])

    return (
        <div
            id="scroll-progress"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '4px',
                width: `${scrolled}%`,
                background: 'linear-gradient(90deg, #C5693D 0%, #C7F000 100%)',
                zIndex: 5000,
                transition: 'width 0.1s linear',
            }}
        />
    )
}
