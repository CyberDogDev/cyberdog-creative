import { useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, GitBranch, Radio, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';

const updates = [
  {
    date: 'AUG 28, 2026',
    version: 'NAV // 01',
    title: 'Wayfinding is now part of the signal',
    summary: 'Nested Journal, Community, Studio, and Portal routes now keep their place in the site hierarchy with active states, context trails, clear return actions, and an accessible mobile menu.',
    tags: ['NAVIGATION', 'ACCESSIBILITY', 'UX'],
  },
  {
    date: 'AUG 28, 2026',
    version: 'WORK // 01',
    title: 'Case studies are built to carry the work',
    summary: 'Selected project stories now have more room for strategy, process, outcomes, and a direct path from the archive into the work.',
    tags: ['CASE STUDIES', 'PORTFOLIO'],
  },
  {
    date: 'AUG 28, 2026',
    version: 'SYS // 01',
    title: 'Publishing and community systems are online',
    summary: 'The Journal and Community now run on authenticated, database-backed flows with public reading, editorial controls, profiles, rooms, and persistent conversations.',
    tags: ['JOURNAL', 'COMMUNITY', 'PLATFORM'],
  },
];

function useDeveloperMeta() {
  useEffect(() => {
    document.title = 'Developer // CyberDog Creative';
    const description = 'Public updates, release notes, and contribution protocol for CyberDog Creative.';
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.append(meta);
    }
    meta.content = description;
  }, []);
}

export function DeveloperPage() {
  useDeveloperMeta();

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-10 md:pt-28">
      <section className="grid gap-12 border-b border-primary/20 pb-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div className="cd-animate">
          <p className="font-mono text-[10px] uppercase tracking-[.3em] text-primary">DEVELOPER // PUBLIC CHANGELOG</p>
          <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[.86] tracking-tight">
            SEE_THE<br /><span className="text-primary text-glow">SYSTEM</span><br />MOVE.
          </h1>
          <p className="mt-9 max-w-2xl border-l-2 border-primary/50 pl-6 font-mono text-base leading-relaxed text-foreground/70">
            A readable record of what changed, why it changed, and where the signal is headed next. Product updates stay visible here instead of disappearing into the noise.
          </p>
        </div>

        <aside className="border border-primary/30 bg-card/70 p-7 clip-edge" aria-label="Update log status">
          <div className="flex items-center justify-between border-b border-primary/20 pb-4 font-mono text-[10px] uppercase tracking-[.2em] text-foreground/50">
            <span>CHANGELOG_STATUS</span>
            <span className="flex items-center gap-2 text-primary"><span className="size-2 rounded-full bg-primary animate-pulse" /> LIVE</span>
          </div>
          <p className="mt-8 font-display text-3xl font-bold uppercase leading-tight">One source of truth for every transmission.</p>
          <Link href="#release-protocol" className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary hover:text-white">
            READ_RELEASE_PROTOCOL <ArrowDownRight size={14} />
          </Link>
        </aside>
      </section>

      <section className="py-20" aria-labelledby="updates-heading">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-primary">TRANSMISSION_INDEX</p>
            <h2 id="updates-heading" className="mt-4 font-display text-4xl font-black uppercase tracking-widest md:text-6xl">LATEST_UPDATES</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/40">PUBLIC // VERSIONED // HUMAN_READABLE</span>
        </div>

        <div className="divide-y divide-primary/15 border-y border-primary/20">
          {updates.map((update, index) => (
            <article key={update.version} className="grid gap-7 px-4 py-10 transition-colors hover:bg-primary/5 md:grid-cols-[150px_1fr_auto] md:px-6">
              <div className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/45">
                <span className="block text-primary">{update.version}</span>
                <time className="mt-3 block" dateTime="2026-08-28">{update.date}</time>
                <span className="mt-6 block text-foreground/25">{String(index + 1).padStart(2, '0')} / {String(updates.length).padStart(2, '0')}</span>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {update.tags.map((tag) => <span key={tag} className="border border-primary/25 bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[.15em] text-primary">{tag}</span>)}
                </div>
                <h3 className="mt-5 max-w-3xl font-display text-2xl font-bold uppercase leading-tight tracking-wider md:text-4xl">{update.title}</h3>
                <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-foreground/60">{update.summary}</p>
              </div>
              <div className="flex items-start md:justify-end">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-primary"><Check size={14} /> LOGGED</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="release-protocol" className="scroll-mt-32 border border-primary/30 bg-card/60 p-7 clip-edge md:p-12" aria-labelledby="protocol-heading">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-primary">RELEASE_PROTOCOL</p>
            <h2 id="protocol-heading" className="mt-5 font-display text-4xl font-black uppercase leading-none tracking-widest md:text-6xl">NO_UPDATE<br />WITHOUT<br /><span className="text-primary">A_TRACE.</span></h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              [Radio, '01 // LOG', 'Every approved information update gets a dated, human-readable entry in this public log and the repository CHANGELOG.'],
              [GitBranch, '02 // SYNC', 'The repository README is updated when the change affects product behavior, setup, or the public project story.'],
              [ShieldCheck, '03 // REVIEW', 'GitHub changes are prepared as a commit and pull request for review, with release notes when the update is substantial.'],
            ].map(([Icon, title, copy]) => (
              <div key={title as string} className="border-t border-primary/30 pt-5">
                <Icon className="text-primary" size={21} aria-hidden="true" />
                <h3 className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[.15em]">{title as string}</h3>
                <p className="mt-4 font-mono text-xs leading-relaxed text-foreground/55">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-primary/20 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/40">REPOSITORY_ACTIONS REQUIRE APPROVAL BEFORE PUBLISHING</p>
          <Link href="/about" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-primary hover:text-white">MEET_THE_OPERATORS <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </div>
  );
}