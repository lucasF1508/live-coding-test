export default function ChallengeLoading() {
  return (
    <main className="grid h-screen grid-cols-[38%_62%]">
      <section className="border-r p-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-2)' }}>
        <div className="mb-4 h-5 w-20 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="mb-3 h-8 w-2/3 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-4 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
          ))}
        </div>
      </section>
      <section className="p-4">
        <div className="mb-3 h-12 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="mb-3 h-[40%] animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="h-[45%] animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
      </section>
    </main>
  )
}
