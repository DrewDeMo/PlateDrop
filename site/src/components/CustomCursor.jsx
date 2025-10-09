import { useEffect } from 'react'

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.id = 'custom-cursor'
    cursor.className = 'fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out z-[9999] hidden md:block'
    cursor.style.background = 'radial-gradient(circle, #C7F000 0%, transparent 80%)'
    document.body.appendChild(cursor)

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const clickEffect = () => {
      cursor.classList.add('click')
      setTimeout(() => cursor.classList.remove('click'), 250)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('click', clickEffect)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('click', clickEffect)
      cursor.remove()
    }
  }, [])

  return (
    <style>{`
      #custom-cursor.click {
        transform: translate(-50%, -50%) scale(1.8);
        background: radial-gradient(circle, #C5693D 0%, transparent 80%);
      }
    `}</style>
  )
}
