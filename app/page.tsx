export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dev&apos;R
          </span>
          <span
            className="text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "var(--color-accent-light, #F5EBD8)",
              color: "var(--color-accent-dark, #8B5E2B)",
            }}
          >
            Beta
          </span>
        </div>
        <p
          className="text-sm hidden sm:block"
          style={{ color: "var(--color-text-secondary, #6B6560)", fontFamily: "var(--font-body)" }}
        >
          Veille GitHub + Dev.to
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full">
        {/* Hero */}
        <section className="mb-16">
          <p
            className="text-[11px] font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent-val, #D97B4F)", fontFamily: "var(--font-body)" }}
          >
            Dashboard
          </p>
          <h1
            className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] mb-4 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            La tech qui monte,
            <br />
            chaque matin.
          </h1>
          <p
            className="text-base leading-[1.7] max-w-lg"
            style={{ color: "var(--color-text-secondary, #6B6560)", fontFamily: "var(--font-body)" }}
          >
            GitHub trending + Dev.to agrégés, scorés, filtrés. Un dashboard pour ne rien manquer des tendances tech.
          </p>
        </section>

        {/* Placeholder sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HypeChart placeholder */}
          <div
            className="lg:col-span-2 rounded-[16px] p-6 border"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-2"
              style={{ color: "var(--color-accent-val, #D97B4F)", fontFamily: "var(--font-body)" }}
            >
              HypeScore
            </p>
            <h2
              className="text-xl font-bold tracking-[-0.01em] mb-6 text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tendances agrégées
            </h2>
            <div
              className="h-40 rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(60,55,50,0.05)" }}
            >
              <span
                className="text-sm"
                style={{ color: "var(--color-text-tertiary, #9E9890)", fontFamily: "var(--font-body)" }}
              >
                Graphique à venir
              </span>
            </div>
          </div>

          {/* Filters placeholder */}
          <div
            className="rounded-[16px] p-6 border"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-2"
              style={{ color: "var(--color-accent-val, #D97B4F)", fontFamily: "var(--font-body)" }}
            >
              Filtres
            </p>
            <h2
              className="text-xl font-bold tracking-[-0.01em] mb-6 text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Langages
            </h2>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "Python", "Go", "Rust"].map((lang) => (
                <span
                  key={lang}
                  className="text-[11px] font-medium uppercase tracking-[0.08em] px-3 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-70"
                  style={{
                    background: "var(--color-accent-light, #F5EBD8)",
                    color: "var(--color-accent-dark, #8B5E2B)",
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cards grid placeholder */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-[16px] p-5 border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-[11px] font-medium uppercase tracking-widest mb-3"
                style={{ color: "var(--color-accent-val, #D97B4F)", fontFamily: "var(--font-body)" }}
              >
                GitHub
              </p>
              <div
                className="h-4 rounded-full mb-2"
                style={{ background: "rgba(60,55,50,0.08)", width: "70%" }}
              />
              <div
                className="h-3 rounded-full mb-2"
                style={{ background: "rgba(60,55,50,0.05)", width: "90%" }}
              />
              <div
                className="h-3 rounded-full mb-5"
                style={{ background: "rgba(60,55,50,0.05)", width: "60%" }}
              />
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="h-3 rounded-full"
                  style={{ background: "rgba(60,55,50,0.05)", width: "40%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border text-center">
        <p
          className="text-xs"
          style={{ color: "var(--color-text-tertiary, #9E9890)", fontFamily: "var(--font-body)" }}
        >
          Dev&apos;R · GitHub API + Dev.to API · 2026
        </p>
      </footer>
    </div>
  );
}
