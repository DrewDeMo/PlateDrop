import { useEffect } from 'react'

export default function CustomCursor() {
    useEffect(() => {
        const cursor = document.createElement('div')
        cursor.id = 'custom-cursor'
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
      #custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        background: radial-gradient(circle, #C7F000 0%, transparent 80%);
        border-radius: 50%;
        pointer-events: none;
        mix-blend-mode: difference;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
        z-index: 9999;
      }
      #custom-cursor.click {
        transform: translate(-50%, -50%) scale(1.8);
        background: radial-gradient(circle, #C5693D 0%, transparent 80%);
      }
      @media (pointer: coarse) {
        #custom-cursor {
          display: none;
        }
      }
    `}</style>
    )
}
