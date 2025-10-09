import { useEffect, useState } from 'react'

export default function DealsGrid() {
    const [deals, setDeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchDeals() {
            try {
                const res = await fetch('/api/deals.json')
                if (!res.ok) throw new Error('Failed to fetch deals')
                const data = await res.json()
                setDeals(data.products || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDeals()
    }, [])

    if (loading) return <p className="text-center text-[var(--neutral-ash)]">Loading latest deals...</p>
    if (error) return <p className="text-center text-red-400">Error: {error}</p>

    if (!deals.length)
        return <p className="text-center text-[var(--neutral-ash)]">No deals available. Check back soon.</p>

    return (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
                <a
                    key={deal.url}
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 hover:shadow-glow transition-transform hover:-translate-y-1 group"
                >
                    <div className="aspect-square overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] mb-4">
                        <img
                            src={deal.image_url}
                            alt={deal.name}
                            className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                        />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-[var(--neutral-bone)]">{deal.name}</h3>
                    <p className="text-[var(--neutral-ash)] text-sm mb-3 line-clamp-2">{deal.description}</p>
                    <p className="text-[var(--accent-lime)] font-bold">${deal.current_price.toFixed(2)}</p>
                </a>
            ))}
        </div>
    )
}
