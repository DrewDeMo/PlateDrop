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
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-[5000] transition-[width] duration-100"
            style={{
                width: `${scrolled}%`,
            }}
        />
    )
}
