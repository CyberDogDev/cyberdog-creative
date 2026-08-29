import { useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Braces, Database, Globe2, Layers3, Terminal, Zap } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';

const tallyFormUrl = 'https://tally.so/r/vG5lWd?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';

const services = [
  {
    icon: Braces,
    code: 'BUILD.01',
    title: 'Software systems',
    description: 'Product applications, internal tools, automations, and the infrastructure that makes a useful idea operational.',
  },
  {
    icon: Globe2,
    code: 'BUILD.02',
    title: 'Web experiences',
    description: 'Websites and web apps that balance clear information architecture with a point of view people remember.',
  },
  {
    icon: Database,
    code: 'BUILD.03',
    title: 'Data foundations',
    description: 'APIs, databases, dashboards, and resilient workflows for teams that need their systems to stay legible.',
  },
  {
    icon: Layers3,
    code: 'BUILD.04',
    title: 'Digital operations',
    description: 'Technical scope, product direction, integrations, and launch support when the brief is still taking shape.',
  },
];

function useServicePageMeta() {
  useEffect(() => {
    const title = 'Services — CyberDog Creative';
    const description = 'CyberDog Creative builds software, web apps, websites, databases, APIs, and digital systems for ambitious people and organizations.';
    const canonical = `${window.location.origin}${import.meta.env.BASE_URL}services`;

    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector.includes('property=') ? selector.split('"')[1] : selector.split('"')[1]);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', canonical);
    setMeta('meta[property="og:type"]', 'property', 'website');
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
  }, []);
}

export function ServicesPage() {
  useServicePageMeta();

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-10 md:pt-28">
      <section className="grid gap-12 border-b border-primary/20 pb-20 md:grid-cols-[1.2fr_.8fr] md:items-end md:pb-28">
        <div className="cd-animate">
          <SectionLabel>CLIENT.SYSTEMS // OPEN_CHANNEL</SectionLabel>
          <h1 className="max-w-5xl font-display text-[clamp(3.25rem,8vw,8rem)] font-black leading-[0.86] tracking-tight uppercase">
            BRING US<br /><span className="text-primary text-glow">THE HARD</span><br />PART.
          </h1>
        </div>
        <div className="cd-animate cd-delay-1">
          <p className="max-w-md border-l-2 border-primary/50 pl-6 font-mono text-base leading-relaxed text-foreground/75">
            CyberDog Creative is an innovative technology company for people and organizations ready to turn a rough signal into a working system.
          </p>
          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-foreground/45">
            We build applications, web apps, websites, databases, APIs, automations, and the digital infrastructure around them.
          </p>
          <a href="#project-intake" className="clip-button mt-8 inline-flex items-center gap-3 bg-primary px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[.2em] text-black transition-colors hover:bg-white" data-testid="link-services-start">
            START_A_PROJECT <ArrowDownRight size={16} />
          </a>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>CAPABILITY.MATRIX</SectionLabel>
            <h2 className="font-display text-4xl font-bold uppercase tracking-widest md:text-6xl">
              WHAT_WE_<span className="text-primary">BUILD.</span>
            </h2>
          </div>
          <p className="max-w-sm border-l border-primary/30 pl-4 font-mono text-xs uppercase leading-relaxed tracking-[.12em] text-foreground/45">
            From first architecture to final handoff. One channel. Fewer dead ends.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map(({ icon: Icon, code, title, description }, index) => (
            <article key={code} className={`group relative overflow-hidden border border-primary/20 bg-card/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/5 md:p-9 ${index === 0 ? 'md:row-span-2 md:flex md:flex-col md:justify-between' : ''}`} data-testid={`card-service-${code.toLowerCase().replace('.', '-')}`}>
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex items-start justify-between gap-6">
                <span className="grid size-12 place-items-center border border-primary/40 bg-primary/10 text-primary">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="font-mono text-[10px] tracking-[.2em] text-primary/60">{code}</span>
              </div>
              <div className="relative z-10 mt-16">
                <h3 className="font-display text-2xl font-bold uppercase tracking-wider transition-colors group-hover:text-primary md:text-3xl">{title}</h3>
                <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-foreground/55">{description}</p>
              </div>
              <ArrowUpRight size={18} className="absolute bottom-7 right-7 text-primary/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary md:bottom-9 md:right-9" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-primary/20 bg-card/50 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div>
            <SectionLabel>DELIVERY.PROTOCOL</SectionLabel>
            <h2 className="font-display text-4xl font-black uppercase tracking-widest md:text-5xl">
              SIGNAL TO<br /><span className="text-primary">SYSTEM.</span>
            </h2>
          </div>
          <div className="grid gap-px border border-primary/20 bg-primary/20 sm:grid-cols-4">
            {['BRIEF', 'ARCHITECT', 'BUILD', 'HANDOFF'].map((step, index) => (
              <div key={step} className="bg-background/80 p-5">
                <span className="font-mono text-[10px] text-primary/60">0{index + 1}</span>
                <p className="mt-8 font-display text-sm font-bold uppercase tracking-wider">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="project-intake" className="scroll-mt-28 pt-20 md:pt-28">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <SectionLabel>INTAKE.NODE // TALLY.LINK</SectionLabel>
            <h2 className="font-display text-4xl font-black uppercase tracking-widest md:text-6xl">
              START_<br /><span className="text-primary text-glow">HERE.</span>
            </h2>
            <p className="mt-8 max-w-md border-l-2 border-primary/40 pl-5 font-mono text-sm leading-relaxed text-foreground/65">
              Give us the signal. Tell us what needs to exist, what is blocking it, and what “done” looks like. We’ll come back with the clearest next move.
            </p>
            <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em] text-primary/70">
              <Zap size={15} aria-hidden="true" />
              SECURE_HOSTED_SUBMISSION
            </div>
            <p className="mt-3 max-w-sm font-mono text-[10px] leading-relaxed text-foreground/35">
              This intake is hosted by Tally so your submission can include the detail, links, and files a real build brief needs.
            </p>
          </div>

          <div className="overflow-hidden border border-primary/30 bg-card/80 p-2 shadow-[0_0_50px_rgba(255,23,68,.08)] md:p-4">
            <iframe
              src={tallyFormUrl}
              title="CyberDog Creative project intake form"
              className="min-h-[1700px] w-full border-0 bg-transparent"
              data-testid="iframe-tally-project-intake"
              loading="lazy"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary/15 px-3 py-4 md:px-5">
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-foreground/35">FORM_CHANNEL // TALLY</span>
              <a href="https://tally.so/r/vG5lWd" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-primary hover:text-white" data-testid="link-open-tally-form">
                OPEN_FULL_CHANNEL <Terminal size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}