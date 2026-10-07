import Link from "next/link";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalContent = {
  badge: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updated: string;
  tocLabel: string;
  sections: LegalSection[];
  contactTitle: string;
  contactDesc: string;
  contactCta: string;
  relatedLabel: string;
  relatedHref: string;
};

/**
 * Shared layout for long-form legal documents (Privacy Policy, Terms of Service).
 * Server component — content is passed in already localized.
 */
export function LegalPage({ content }: { content: LegalContent }) {
  const c = content;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-primary/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="container relative mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {c.badge}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{c.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{c.intro}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            {c.updatedLabel}: <span className="font-medium text-foreground">{c.updated}</span>
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[240px_1fr]">
        {/* Table of contents */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label={c.tocLabel} className="rounded-2xl border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {c.tocLabel}
            </p>
            <ol className="space-y-1 text-sm">
              {c.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    id={`toc-${s.id}`}
                    href={`#${s.id}`}
                    className="flex gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span className="tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Sections */}
        <article className="space-y-6">
          {c.sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{s.title}</h2>
              </div>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {s.paragraphs?.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {s.bullets && (
                  <ul className="space-y-2">
                    {s.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {/* Contact callout */}
          <section className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-transparent p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">{c.contactTitle}</h2>
            <p className="mt-2 text-muted-foreground">{c.contactDesc}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                id="legal-contact-link"
                href="/contact"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {c.contactCta}
              </Link>
              <Link
                id="legal-related-link"
                href={c.relatedHref}
                className="inline-flex items-center rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {c.relatedLabel} →
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
