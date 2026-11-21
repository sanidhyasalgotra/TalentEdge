import { Children } from 'react'
import { LEGAL, hasPlaceholders } from '../lib/legal'

export const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function LegalLayout({ title, children }) {
  // The table of contents is built from the sections passed in, so it can never go out of date.
  const items = Children.toArray(children)
    .filter((c) => c?.props?.title)
    .map((c) => ({ title: c.props.title, id: slug(c.props.title) }))

  return (
    <article className="mx-auto max-w-3xl">
      {hasPlaceholders() && (
        <p role="alert" className="mb-6 rounded-lg border border-warn/30 bg-amber-soft p-3 text-sm">
          Draft: fill in your details in <code>frontend/src/lib/legal.js</code> before publishing this page.
        </p>
      )}
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LEGAL.effectiveDate}</p>

      <nav aria-label="Contents" className="mt-8 rounded-xl border border-ink/10 bg-white p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Contents</p>
        <ol className="space-y-1.5 text-sm sm:columns-2 sm:gap-8">
          {items.map((i) => (
            <li key={i.id} className="break-inside-avoid">
              <a href={`#${i.id}`} className="text-edge hover:underline">{i.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">{children}</div>
    </article>
  )
}

export const Sec = ({ title, children }) => (
  <section id={slug(title)} className="scroll-mt-6">
    <h2 className="font-display text-xl font-bold">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
  </section>
)

export const Sub = ({ children }) => <h3 className="pt-1 font-semibold text-ink">{children}</h3>

export const List = ({ items }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((i) => <li key={i}>{i}</li>)}
  </ul>
)
