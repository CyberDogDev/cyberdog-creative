import { useParams, Link } from 'wouter';
import { projects } from '@/data/projects';
import { SectionLabel } from '@/components/SectionLabel';
import { AlertTriangle, ArrowUpRight, ArrowLeft, Check, Copy, Download, Hexagon, Linkedin, Mail, Printer, Share2, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotFound from '@/pages/not-found';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const defaultPageTitle = 'CyberDog Creative — Identity, Digital & Cultural Systems';
const defaultDescription = 'CyberDog Creative is a high-precision creative studio building identity, digital, and cultural systems with signal.';

function absoluteUrl(path: string) {
  return new URL(`${basePath}${path.startsWith('/') ? path : `/${path}`}`, window.location.origin).href;
}

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    const [name, rawValue] = selector
      .replace(/^meta\[/, '')
      .replace(/\]$/, '')
      .split('=');
    element.setAttribute(name, rawValue.replaceAll('"', ''));
    document.head.append(element);
  }
  element.setAttribute(attribute, value);
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function copyText(text: string) {
  const legacyCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.append(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    if (!copied) throw new Error('Clipboard copy was not available.');
  };

  if (!navigator.clipboard?.writeText) {
    legacyCopy();
    return Promise.resolve();
  }

  return navigator.clipboard.writeText(text).catch(() => {
    legacyCopy();
  });
}

function buildCaseStudyBrief(project: typeof projects[number], url: string) {
  return `# ${project.name}

${project.summary}

## Project details

- Client: ${project.client}
- Sector: ${project.type}
- Year: ${project.year}
- Deliverables: ${project.deliverables.join(', ')}
- Case study: ${url}

## The challenge

${project.challenge}

## Our point of view

${project.pov}

## Process

${project.process}

## Outcome

${project.result}

---

CyberDog Creative — Identity, digital, and cultural systems with signal.
`;
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);
  const relatedProjects = projects.filter(p => p.slug !== slug).slice(0, 2);
  const imageSrc = project ? `${import.meta.env.BASE_URL}${project.image.replace(/^\//, '')}` : '';
  const canonicalUrl = project ? absoluteUrl(`/work/${project.slug}`) : '';
  const shareCopy = project ? `${project.name} — ${project.summary}` : '';
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const [nativeShareState, setNativeShareState] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');
  const [exportState, setExportState] = useState<'idle' | 'downloaded' | 'printed'>('idle');
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  const inquiryHref = project
    ? `mailto:hello@cyberdogcreative.com?subject=${encodeURIComponent(`Project inquiry — ${project.name}`)}`
    : 'mailto:hello@cyberdogcreative.com';

  useEffect(() => {
    window.scrollTo(0, 0);
    setCopyState('idle');
    setNativeShareState('idle');
    setExportState('idle');
  }, [slug]);

  useEffect(() => {
    setNativeShareAvailable(Boolean(navigator.share));
  }, []);

  useEffect(() => {
    if (copyState !== 'copied') return;
    const timeout = window.setTimeout(() => setCopyState('idle'), 3600);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  useEffect(() => {
    if (!project) return;

    const title = `${project.name} | CyberDog Creative`;
    const imageUrl = absoluteUrl(project.image);

    document.title = title;
    setMeta('meta[name="description"]', 'content', project.summary);
    setMeta('meta[property="og:title"]', 'content', project.name);
    setMeta('meta[property="og:description"]', 'content', project.summary);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', imageUrl);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', project.name);
    setMeta('meta[name="twitter:description"]', 'content', project.summary);
    setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:image"]', 'content', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;

    return () => {
      document.title = defaultPageTitle;
      setMeta('meta[name="description"]', 'content', defaultDescription);
      setMeta('meta[property="og:title"]', 'content', 'CyberDog Creative');
      setMeta('meta[property="og:description"]', 'content', 'Identity, digital, and cultural systems with signal.');
      setMeta('meta[property="og:type"]', 'content', 'website');
      removeMeta('meta[property="og:url"]');
      removeMeta('meta[property="og:image"]');
      setMeta('meta[name="twitter:title"]', 'content', 'CyberDog Creative');
      setMeta('meta[name="twitter:description"]', 'content', 'Identity, digital, and cultural systems with signal.');
      setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
      removeMeta('meta[name="twitter:url"]');
      removeMeta('meta[name="twitter:image"]');
      canonical?.remove();
    };
  }, [project]);

  const copyLink = async () => {
    if (!project) return;
    setCopyState('copying');

    try {
      await copyText(canonicalUrl);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const shareNative = async () => {
    if (!project || !navigator.share) return;
    setNativeShareState('sharing');

    try {
      await navigator.share({ title: project.name, text: shareCopy, url: canonicalUrl });
      setNativeShareState('shared');
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') {
        setNativeShareState('idle');
        return;
      }
      setNativeShareState('error');
    }
  };

  const exportBrief = () => {
    if (!project) return;
    const blob = new Blob([buildCaseStudyBrief(project, canonicalUrl)], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `${project.slug}-case-study.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
    setExportState('downloaded');
  };

  const printBrief = () => {
    setExportState('printed');
    window.print();
  };

  const shareTargets = project ? [
    {
      label: 'X_POST',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCopy)}&url=${encodeURIComponent(canonicalUrl)}`,
    },
    {
      label: 'LINKEDIN',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
    },
    {
      label: 'EMAIL',
      href: `mailto:?subject=${encodeURIComponent(`${project.name} — CyberDog Creative`)}&body=${encodeURIComponent(`${shareCopy}\n\n${canonicalUrl}`)}`,
    },
  ] : [];

  const copyButtonLabel = copyState === 'copying'
    ? 'COPYING_SIGNAL'
    : copyState === 'copied'
      ? 'CLIPBOARD_COPIED'
      : copyState === 'error'
        ? 'RETRY_COPY'
        : 'COPY_CASE_STUDY_LINK';

  const nativeShareLabel = nativeShareState === 'sharing'
    ? 'OPENING_SHARE_SHEET'
    : nativeShareState === 'shared'
      ? 'SIGNAL_SHARED'
      : nativeShareState === 'error'
        ? 'SHARE_FAILED'
        : 'SHARE_FROM_DEVICE';

  const exportStatus = exportState === 'downloaded'
    ? 'BRIEF_DOWNLOADED'
    : exportState === 'printed'
      ? 'PRINT_DIALOG_OPENED'
      : '';

  if (!project) return <NotFound />;

  return (
    <div className="cd-page bg-background text-foreground pb-32">
      {/* Hero Header */}
      <section className="relative min-h-[85vh] flex flex-col justify-end pt-32 pb-20 border-b border-primary/20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-muted/20">
          <picture>
            <source srcSet={imageSrc} type="image/jpeg" />
            <img 
              src={imageSrc}
              alt={`${project.name} cinematic artwork`} 
              className="w-full h-full object-cover opacity-50 mix-blend-overlay scale-105 animate-[zoom-in-slow_20s_ease-out_forwards]"
              data-testid={`img-case-study-hero-${project.id}`}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
          <div className="absolute inset-0 cd-circuit-bg opacity-30" />
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <div className="mb-8 cd-animate case-study-print-hide">
            <Link href="/work" data-testid="link-case-study-back" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-foreground/50 hover:text-primary transition-colors cd-line-link w-fit">
              <ArrowLeft size={14} /> BACK_TO_ARCHIVE
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 cd-animate cd-delay-1">
             <span className="clip-button bg-primary/20 border border-primary text-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[.2em]">
               {project.type}
             </span>
             <span className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/50">
               {project.year} // {project.id.toUpperCase()}
             </span>
          </div>

           <h1 data-testid={`text-case-study-title-${project.id}`} className="font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.85] tracking-tight uppercase text-glow text-foreground cd-animate cd-delay-2">
            {project.name}
          </h1>

           <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)] lg:items-end">
             <p data-testid={`text-case-study-summary-${project.id}`} className="max-w-2xl border-l-2 border-primary/50 pl-5 font-mono text-base leading-relaxed text-foreground/75 md:text-lg">
               {project.summary}
             </p>
             <div className="case-study-print-hide border border-primary/35 bg-background/70 p-5 backdrop-blur-sm" aria-labelledby={`share-case-study-heading-${project.id}`}>
               <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
                 <Share2 size={15} aria-hidden="true" /> <span id={`share-case-study-heading-${project.id}`}>TRANSMIT_THIS_WORK</span>
               </div>
               <p className="mt-3 font-mono text-xs leading-relaxed text-foreground/55">
                 Copy the link, send it to another resource, or export a portable project brief.
               </p>
               <div className="mt-5 grid gap-2 sm:grid-cols-2">
                 <button
                   type="button"
                   onClick={() => void copyLink()}
                   disabled={copyState === 'copying'}
                   data-testid={`button-copy-case-study-${project.id}`}
                   aria-label={`Copy ${project.name} case study link`}
                   className={`inline-flex min-h-11 items-center justify-center gap-3 border px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-black transition-colors disabled:cursor-wait disabled:opacity-60 ${copyState === 'copied' ? 'cd-copy-success border-primary bg-primary' : 'border-primary bg-primary hover:bg-white'}`}
                 >
                   {copyState === 'copied' ? <Check size={15} aria-hidden="true" /> : copyState === 'error' ? <AlertTriangle size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                   {copyButtonLabel}
                 </button>
                 {nativeShareAvailable && (
                   <button
                     type="button"
                     onClick={() => void shareNative()}
                     disabled={nativeShareState === 'sharing'}
                     data-testid={`button-native-share-case-study-${project.id}`}
                     aria-label={`Share ${project.name} case study from this device`}
                     className="inline-flex min-h-11 items-center justify-center gap-3 border border-primary/45 bg-background/60 px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-primary transition-colors hover:bg-primary hover:text-black disabled:cursor-wait disabled:opacity-60"
                   >
                     <Share2 size={15} aria-hidden="true" />
                     {nativeShareLabel}
                   </button>
                 )}
               </div>
               {copyState === 'copied' && (
                 <div className="cd-clipboard-success mt-3" data-testid={`animation-clipboard-copied-${project.id}`}>
                   <span className="cd-clipboard-success-mark"><Check size={14} aria-hidden="true" /></span>
                   <span><strong>CLIPBOARD_COPIED</strong><small>LINK_READY_FOR_PASTE</small></span>
                 </div>
               )}
               <p role="status" aria-live="polite" data-testid={`status-share-case-study-${project.id}`} className={`mt-3 min-h-4 font-mono text-[10px] uppercase tracking-[.12em] ${copyState === 'error' || nativeShareState === 'error' ? 'text-red-400' : 'text-primary/80'}`}>
                 {copyState === 'error' && 'COPY_UNAVAILABLE — TRY AGAIN'}
                 {nativeShareState === 'shared' && 'SHARE_SHEET_COMPLETE'}
                 {nativeShareState === 'error' && 'SHARE_FAILED — USE ANOTHER CHANNEL'}
               </p>
               <div className="mt-4 border-t border-primary/15 pt-4">
                 <p className="font-mono text-[9px] uppercase tracking-[.18em] text-foreground/40">SEND_TO_RESOURCE</p>
                 <div className="mt-2 flex flex-wrap gap-2">
                   {shareTargets.map((target) => (
                     <a
                       key={target.label}
                       href={target.href}
                       target="_blank"
                       rel="noreferrer"
                       data-testid={`link-share-case-study-${target.label.toLowerCase()}`}
                       className="cd-social-preview inline-flex items-center gap-2 border border-primary/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] text-primary"
                     >
                       {target.label}
                       {target.label === 'LINKEDIN' ? <Linkedin size={13} aria-hidden="true" /> : target.label === 'EMAIL' ? <Mail size={13} aria-hidden="true" /> : <ArrowUpRight size={13} aria-hidden="true" />}
                     </a>
                   ))}
                 </div>
               </div>
               <div className="mt-4 grid gap-2 sm:grid-cols-2">
                 <button type="button" onClick={exportBrief} data-testid={`button-export-case-study-${project.id}`} className="inline-flex min-h-10 items-center justify-center gap-2 border border-primary/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] text-foreground/70 transition-colors hover:border-primary hover:text-primary">
                   <Download size={13} aria-hidden="true" /> {exportState === 'downloaded' ? 'BRIEF_DOWNLOADED' : 'EXPORT_BRIEF'}
                 </button>
                 <button type="button" onClick={printBrief} data-testid={`button-print-case-study-${project.id}`} className="inline-flex min-h-10 items-center justify-center gap-2 border border-primary/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] text-foreground/70 transition-colors hover:border-primary hover:text-primary">
                   <Printer size={13} aria-hidden="true" /> PRINT_OR_SAVE_PDF
                 </button>
               </div>
               {exportStatus && <p className="mt-3 font-mono text-[9px] uppercase tracking-[.12em] text-primary/70">{exportStatus}</p>}
             </div>
           </div>
          
           <div className="mt-12 grid grid-cols-2 gap-8 border-t border-primary/20 pt-8 font-mono cd-animate cd-delay-3 md:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-[.2em] text-foreground/40 mb-2">CLIENT</div>
              <div className="text-sm text-foreground/90">{project.client}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[.2em] text-foreground/40 mb-2">SECTOR</div>
              <div className="text-sm text-foreground/90">{project.type}</div>
            </div>
            <div className="col-span-2 md:col-span-2">
              <div className="text-[10px] uppercase tracking-[.2em] text-foreground/40 mb-2">DELIVERABLES</div>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map(d => (
                  <span key={d} data-testid={`text-deliverable-${d.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-xs border border-primary/20 px-2 py-1 bg-background/50">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="grid md:grid-cols-[1fr_2.5fr] gap-12 lg:gap-24">
          <div className="hidden md:block">
            <div className="sticky top-32 flex flex-col gap-8 border-l border-primary/20 pl-6">
              <div className="flex items-center gap-3 text-primary">
                <Hexagon size={16} className="animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[.2em]">SYS.ANALYSIS</span>
              </div>
              <div className="font-mono text-xs text-foreground/50 leading-relaxed uppercase tracking-widest">
                File: {project.slug}.dat<br/>
                Status: Declassified<br/>
                Clearance: Level 4
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-24 cd-animate">
            {/* Challenge */}
            <div className="group">
              <SectionLabel>THE_CHALLENGE</SectionLabel>
              <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-wide leading-snug mt-6 mb-8 text-foreground group-hover:text-glow transition-all">
                The parameters of the mission.
              </h2>
               <p data-testid={`text-case-study-challenge-${project.id}`} className="font-mono text-base md:text-lg leading-relaxed text-foreground/80 border-l-2 border-primary/30 pl-6">
                {project.challenge}
              </p>
            </div>

            {/* Cinematic Break */}
            <div className="relative h-[40vh] md:h-[60vh] w-full clip-edge border border-primary/20 bg-muted/10 overflow-hidden group">
              <div className="absolute inset-0 cd-grid opacity-20" />
                <picture>
                <source srcSet={imageSrc} type="image/jpeg" />
                <img 
                  src={imageSrc} 
                  alt={`${project.name} process evidence`} 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                  data-testid={`img-case-study-process-${project.id}`}
                />
              </picture>
              <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-widest text-primary/70 bg-black/50 px-3 py-1 border border-primary/30">
                VISUAL_EVIDENCE // 01
              </div>
              <p className="sr-only">Accessible visual fallback: {project.name} case study process evidence.</p>
            </div>

            {/* POV */}
            <div>
              <SectionLabel>OUR_POV</SectionLabel>
              <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-wide leading-snug mt-6 mb-8 text-foreground text-glow">
                Refusing the default setting.
              </h2>
               <p data-testid={`text-case-study-pov-${project.id}`} className="font-mono text-base md:text-lg leading-relaxed text-foreground/80">
                {project.pov}
              </p>
            </div>

            {/* Process & Result */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-8 pt-12 border-t border-primary/20">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[.2em] text-primary mb-6">/ PROCESS /</div>
                 <p data-testid={`text-case-study-process-${project.id}`} className="font-mono text-sm leading-relaxed text-foreground/70">
                  {project.process}
                </p>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[.2em] text-primary mb-6">/ OUTCOME /</div>
                 <p data-testid={`text-case-study-result-${project.id}`} className="font-mono text-sm leading-relaxed text-foreground/70">
                  {project.result}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Inquiry CTA */}
      <section className="case-study-print-hide mx-auto max-w-[1440px] px-5 py-12 md:px-10">
        <div className="border border-primary/30 bg-primary/5 p-8 md:p-16 text-center clip-edge relative overflow-hidden group">
          <div className="absolute inset-0 cd-circuit-bg opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-widest mb-6">
              READY TO <span className="text-primary text-glow">INITIATE?</span>
            </h2>
            <p className="font-mono text-sm text-foreground/70 mb-10">
              We take on a limited number of operations per quarter. If your project requires high-precision creative engineering, open a channel.
            </p>
             <a href={inquiryHref} data-testid={`link-case-study-inquiry-${project.id}`} className="clip-button inline-flex items-center gap-3 bg-primary px-8 py-4 font-mono text-sm font-bold uppercase tracking-[.2em] text-black hover:bg-white hover:text-black transition-colors">
              OPEN_COMMS_CHANNEL <Terminal size={18} />
             </a>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="case-study-print-hide mx-auto max-w-[1440px] px-5 py-24 md:px-10 border-t border-primary/20 mt-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>ADJACENT_FILES</SectionLabel>
            <h2 className="font-display text-3xl font-bold tracking-widest uppercase mt-4">
              RELATED_WORK
            </h2>
          </div>
           <Link href="/work" data-testid="link-case-study-related-all" className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-primary hover:text-white transition-colors">
            [ VIEW_ALL_ARCHIVES ] <ArrowUpRight size={14} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {relatedProjects.map((p) => (
            <Link key={p.id} href={`/work/${p.slug}`} data-testid={`card-related-project-${p.id}`} className="cd-project-card group block p-4">
              <div className="relative h-48 md:h-64 mb-6 overflow-hidden clip-edge border border-primary/20 bg-muted/30">
                <div className="absolute inset-0 cd-grid opacity-10" />
                <picture>
                  <source srcSet={`${import.meta.env.BASE_URL}images/${p.slug}.jpg`} type="image/jpeg" />
                  <img src={`${import.meta.env.BASE_URL}${p.image.replace(/^\//, '')}`} alt={`${p.name} project preview`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 mix-blend-overlay" data-testid={`img-related-project-${p.id}`} />
                </picture>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary/70">[{p.type}]</div>
                  <h3 className="font-display text-2xl font-bold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                </div>
                <span className="grid size-10 shrink-0 place-items-center border border-primary/30 clip-edge-reverse bg-primary/5 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                  <ArrowUpRight size={18} className="cd-project-arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
           <Link href="/work" data-testid="link-case-study-related-all-mobile" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-primary hover:text-white transition-colors">
            [ VIEW_ALL_ARCHIVES ] <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}