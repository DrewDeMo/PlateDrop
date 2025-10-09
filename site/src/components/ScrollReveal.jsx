import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function ScrollReveal({ children, delay = 0, y = 40 }) {
    const controls = useAnimation()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        controls.start({ opacity: 1, y: 0, transition: { duration: 0.6, delay } })
                        observer.disconnect()
                    }
                })
            },
            { threshold: 0.15 }
        )

        const target = document.querySelector(`[data-scroll-id="${delay}-${y}"]`)
        if (target) observer.observe(target)

        return () => observer.disconnect()
    }, [controls, delay, y])

    return (
        <motion.div
            data-scroll-id={`${delay}-${y}`}
            initial={{ opacity: 0, y }}
            animate={controls}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    )
}
