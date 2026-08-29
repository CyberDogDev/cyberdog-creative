import { SectionLabel } from '@/components/SectionLabel';
import { lazy, Suspense, type ReactNode, useState, useEffect, useRef } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { projects } from '@/data/projects';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Check, 
  Clock3, 
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  Menu, 
  X, 
  Radio, 
  Zap,
  Terminal,
  Crosshair,
  Hexagon,
  Cpu,
  ScanLine
} from 'lucide-react';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const JournalIndex = lazy(() => import('@/journal').then((module) => ({ default: module.JournalIndex })));
const JournalPostPage = lazy(() => import('@/journal').then((module) => ({ default: module.JournalPostPage })));
const StudioPage = lazy(() => import('@/journal').then((module) => ({ default: module.StudioPage })));
const DeveloperPage = lazy(() => import('@/developer').then((module) => ({ default: module.DeveloperPage })));
const ServicesPage = lazy(() => import('@/services').then((module) => ({ default: module.ServicesPage })));
const TermsPage = lazy(() => import('@/pages/legal').then((module) => ({ default: module.TermsPage })));
const AcceptableUsePage = lazy(() => import('@/pages/legal').then((module) => ({ default: module.AcceptableUsePage })));
const PrivacyPage = lazy(() => import('@/pages/legal').then((module) => ({ default: module.PrivacyPage })));

const CaseStudyPage = lazy(() => import('@/pages/case-study'));
const CommunityIndex = lazy(() => import('@/community').then((module) => ({ default: module.CommunityIndex })));
const CommunityRoomPage = lazy(() => import('@/community').then((module) => ({ default: module.CommunityRoomPage })));
const CommunityProfilePage = lazy(() => import('@/community').then((module) => ({ default: module.CommunityProfilePage })));
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#ff1744',
    colorForeground: '#f1f3f7',
    colorMutedForeground: '#a0a8b8',
    colorDanger: '#ff5b70',
    colorBackground: '#0b0d12',
    colorInput: '#151922',
    colorInputForeground: '#f1f3f7',
    colorNeutral: '#3a414f',
    fontFamily: 'Rajdhani, sans-serif',
    borderRadius: '0.15rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#0b0d12] border border-[#3a414f] rounded-none w-[440px] max-w-full overflow-hidden shadow-[0_0_50px_rgba(255,23,68,.12)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: '!text-[#f1f3f7] font-display uppercase tracking-[.08em]',
    headerSubtitle: '!text-[#a0a8b8]',
    socialButtonsBlockButtonText: '!text-[#f1f3f7]',
    formFieldLabel: '!text-[#a0a8b8] uppercase tracking-[.12em] text-[11px]',
    footerActionLink: '!text-[#ff1744]',
    footerActionText: '!text-[#a0a8b8]',
    dividerText: '!text-[#a0a8b8]',
    identityPreviewEditButton: '!text-[#ff1744]',
    formFieldSuccessText: '!text-[#72e6a2]',
    alertText: '!text-[#ffb7c1]',
    logoBox: 'mb-5',
    logoImage: 'max-h-9',
    socialButtonsBlockButton: '!bg-[#151922] !border-[#3a414f] hover:!bg-[#202631]',
    formButtonPrimary: '!bg-[#ff1744] !text-[#0b0d12] uppercase tracking-[.14em] font-mono hover:!bg-[#ff4065]',
    formFieldInput: '!bg-[#151922] !border-[#3a414f] !text-[#f1f3f7] focus:!border-[#ff1744]',
    footerAction: 'border-t border-[#3a414f] mt-6 pt-6',
    dividerLine: '!bg-[#3a414f]',
    alert: '!bg-[#2a151a] !border-[#ff1744]',
    otpCodeFieldInput: '!bg-[#151922] !border-[#3a414f] !text-[#f1f3f7]',
    formFieldRow: 'mb-4',
    main: 'gap-5',
  },
};
const journal = [
  { id: 'j01', tag: 'SYS.LOG', title: 'A small case for making things harder to ignore', date: '06.18.24', read: '6 min' },
  { id: 'j02', tag: 'NET.TRAFFIC', title: 'Five records for an internet-free afternoon', date: '05.29.24', read: '3 min' },
  { id: 'j03', tag: 'DAT.DUMP', title: 'What a good community actually asks of you', date: '05.07.24', read: '8 min' },
];

function Mark() {
  return (
    <span className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-[0.15em] text-foreground uppercase group">
      <Zap className="text-primary group-hover:animate-pulse" size={20} />
      <span>CYBER<span className="text-primary">DOG</span></span>
    </span>
  );
}

type RouteContext = {
  sectionHref: string;
  sectionLabel: string;
  currentLabel: string;
  actionHref?: string;
  actionLabel?: string;
};

function getRouteContext(location: string): RouteContext | null {
  if (location === '/') return null;
  if (location === '/user-portal') {
    return { sectionHref: '/user-portal', sectionLabel: 'Portal', currentLabel: 'Overview' };
  }
  if (location.startsWith('/journal/')) {
    return {
      sectionHref: '/journal',
      sectionLabel: 'Journal',
      currentLabel: 'Transmission',
      actionHref: '/journal',
      actionLabel: 'Back to archive',
    };
  }
  if (location === '/studio') {
    return {
      sectionHref: '/journal',
      sectionLabel: 'Journal',
      currentLabel: 'Studio',
      actionHref: '/journal',
      actionLabel: 'Exit studio',
    };
  }
  if (location.startsWith('/community/rooms/')) {
    return {
      sectionHref: '/community',
      sectionLabel: 'Community',
      currentLabel: 'Room',
      actionHref: '/community',
      actionLabel: 'Back to community',
    };
  }
  if (location === '/community/profile') {
    return {
      sectionHref: '/community',
      sectionLabel: 'Community',
      currentLabel: 'Identity',
      actionHref: '/community',
      actionLabel: 'Back to community',
    };
  }
  if (location === '/work') return { sectionHref: '/work', sectionLabel: 'Work', currentLabel: 'Archive' };
  if (location === '/journal') {
    return {
      sectionHref: '/journal',
      sectionLabel: 'Journal',
      currentLabel: 'Archive',
      actionHref: '/studio',
      actionLabel: 'Studio editor',
    };
  }
  if (location === '/community') {
    return {
      sectionHref: '/community',
      sectionLabel: 'Community',
      currentLabel: 'Mainframe',
      actionHref: '/community/profile',
      actionLabel: 'Member profile',
    };
  }
  if (location === '/about') return { sectionHref: '/about', sectionLabel: 'About', currentLabel: 'Core ops' };
  if (location === '/services') return { sectionHref: '/services', sectionLabel: 'Services', currentLabel: 'Project intake' };
  if (location === '/developer') return { sectionHref: '/developer', sectionLabel: 'Developer', currentLabel: 'Update log' };
  return { sectionHref: '/', sectionLabel: 'CyberDog', currentLabel: 'Page' };
}

function RouteContextBar({ location }: { location: string }) {
  const context = getRouteContext(location);
  if (!context) return null;

  return (
    <div className="border-y border-primary/15 bg-card/60" data-testid="navigation-context">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-10">
        <nav aria-label="Page location" className="flex min-w-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[.16em]">
          <Link href="/" className="shrink-0 px-2 py-2 text-foreground/45 transition-colors hover:text-primary">Home</Link>
          <ChevronRight size={13} className="shrink-0 text-primary/50" aria-hidden="true" />
          <Link href={context.sectionHref} className="shrink-0 px-2 py-2 text-foreground/60 transition-colors hover:text-primary">{context.sectionLabel}</Link>
          <ChevronRight size={13} className="shrink-0 text-primary/50" aria-hidden="true" />
          <span aria-current="page" className="truncate px-2 py-2 text-primary">{context.currentLabel}</span>
        </nav>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em]">
          {context.actionHref && context.actionLabel && (
            <Link href={context.actionHref} className="inline-flex min-h-10 items-center gap-2 border border-primary/25 px-3 py-2 text-primary transition-colors hover:border-primary hover:bg-primary/10">
              {context.actionLabel}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          )}
          {context.sectionHref === '/community' && (
            <Show when="signed-in">
              <Link href="/community/profile" className="hidden min-h-10 items-center border border-primary/15 px-3 py-2 text-foreground/50 transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex">
                Identity
              </Link>
            </Show>
          )}
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement | null>(null);
  const links = [
    ['/work', 'Work'],
    ['/journal', 'Journal'],
    ['/community', 'Community'],
    ['/about', 'About'],
    ['/services', 'Services'],
    ['/developer', 'Developer'],
  ] as const;
  
  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstMenuLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => location === href || location.startsWith(`${href}/`);

  return (
    <div className="cd-page cd-noise dark">
      <div className="cd-circuit-bg" />
      <a href="#main-content" data-testid="link-skip-to-content" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-primary/15 bg-background/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 md:py-6">
        <Link href="/" data-testid="link-logo"><Mark /></Link>
        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
          {links.map(([href, label]) => (
            <Link 
              key={href} 
              href={href} 
              data-testid={`link-nav-${label.toLowerCase()}`} 
              aria-current={isActive(href) ? 'page' : undefined}
              className={`cd-line-link rounded-sm px-1 py-2 font-mono text-xs uppercase tracking-[.2em] transition-colors ${isActive(href) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-6 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/40 hidden lg:inline-block">SYS.ONLINE // 100%</span>
          <Show when="signed-out">
            <Link href="/sign-in" data-testid="link-header-sign-in" className="cd-line-link font-mono text-[11px] uppercase tracking-[.2em] text-foreground/70">
              SIGN_IN
            </Link>
            <Link href="/sign-up" data-testid="link-header-join" className="clip-button group inline-flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-foreground transition-all duration-300">
              INITIATE <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-primary" />
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/user-portal" data-testid="link-header-portal" className="cd-line-link font-mono text-[11px] uppercase tracking-[.2em] text-foreground/70">
              PORTAL
            </Link>
            <button type="button" onClick={() => signOut({ redirectUrl: basePath || '/' })} data-testid="button-header-sign-out" className="clip-button inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-foreground transition-all hover:border-primary hover:bg-primary/20">
              SIGN_OUT <ArrowUpRight size={14} className="text-primary" />
            </button>
          </Show>
        </div>
        <button 
          ref={triggerRef}
          type="button" 
          onClick={() => setOpen(!open)} 
          aria-label={open ? 'Close menu' : 'Open menu'} 
          aria-expanded={open}
          aria-controls="mobile-navigation"
          data-testid="button-mobile-menu" 
          className="grid size-12 place-items-center bg-secondary/50 border border-primary/20 clip-edge md:hidden text-primary"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile site navigation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
          className="fixed inset-0 top-[81px] z-30 overflow-y-auto bg-background/95 px-5 py-10 backdrop-blur-md md:hidden border-t border-primary/20 cd-animate"
        >
          <nav className="grid gap-3" aria-label="Mobile navigation">
            {links.map(([href, label], i) => (
              <Link 
                ref={i === 0 ? firstMenuLinkRef : undefined}
                key={href} 
                href={href} 
                aria-current={isActive(href) ? 'page' : undefined}
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                data-testid={`link-mobile-${label.toLowerCase()}`} 
                className={`flex min-h-16 items-center justify-between border-b border-primary/10 px-2 pb-4 pt-3 font-display text-4xl tracking-widest uppercase transition-colors ${isActive(href) ? 'text-primary' : 'text-foreground'} cd-delay-${(i % 3) + 1}`}
              >
                <span className="flex items-center gap-3">{isActive(href) && <span className="size-2 rounded-full bg-primary" aria-hidden="true" />}{label}</span><ArrowUpRight size={24} className="text-primary" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="mt-12 cd-delay-3">
            <Show when="signed-out">
              <div className="grid gap-3">
                <Link href="/sign-in" onClick={() => setOpen(false)} data-testid="link-mobile-sign-in" className="flex min-h-14 w-full items-center justify-between border border-primary/30 px-5 py-4 font-mono text-sm uppercase tracking-widest text-foreground">
                  <span>SIGN_IN</span><Terminal size={18} className="text-primary" />
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} data-testid="link-mobile-join" className="clip-button flex min-h-14 w-full items-center justify-between border border-primary bg-primary/10 px-5 py-4 font-mono text-sm uppercase tracking-widest text-primary">
                  <span>CONNECT.NOW</span><ScanLine size={18} />
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="grid gap-3">
                <Link href="/user-portal" data-testid="link-mobile-portal" className="clip-button flex w-full items-center justify-between border border-primary bg-primary/10 px-5 py-4 font-mono text-sm uppercase tracking-widest text-primary">
                  <span>OPEN_PORTAL</span><Terminal size={18} />
                </Link>
                <button type="button" onClick={() => signOut({ redirectUrl: basePath || '/' })} data-testid="button-mobile-sign-out" className="flex w-full items-center justify-between border border-primary/30 px-5 py-4 font-mono text-sm uppercase tracking-widest text-foreground">
                  <span>SIGN_OUT</span><ArrowUpRight size={18} className="text-primary" />
                </button>
              </div>
            </Show>
          </div>
        </div>
      )}
      
      <RouteContextBar location={location} />
      <main id="main-content" data-testid="main-content" tabIndex={-1} className="relative z-10 outline-none">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  const socialPreviews = [
    { name: 'Instagram', icon: Instagram, signal: 'VISUAL_FEED', status: 'PROFILE_PENDING' },
    { name: 'LinkedIn', icon: Linkedin, signal: 'NETWORK_NODE', status: 'PROFILE_PENDING' },
  ];

  return (
    <footer className="cd-footer-signal mt-24 border-t border-primary/20 bg-card px-5 py-16 text-foreground md:px-10 md:py-24 relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Hexagon size={200} />
      </div>
      <div className="mx-auto max-w-[1440px] relative z-10">
        <div className="grid gap-12 md:grid-cols-[1.1fr_.9fr_1.1fr] md:items-end">
          <div>
            <Mark />
            <p className="mt-6 max-w-sm font-mono text-[11px] uppercase tracking-wider leading-relaxed text-foreground/50">
              A high-precision creative network operating across identity, digital, and cultural systems. 
              <br/><br/>
              NO SIGNAL LOST.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:gap-6">
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[.2em] text-foreground/70">
              <span className="mb-1 text-[9px] tracking-[.24em] text-primary/60">NAVIGATION // OPEN</span>
              <Link href="/work" data-testid="link-footer-work" className="cd-line-link w-fit hover:text-primary">PROJECT.FILES</Link>
              <Link href="/journal" data-testid="link-footer-journal" className="cd-line-link w-fit hover:text-primary">SYS.LOGS</Link>
              <Link href="/about" data-testid="link-footer-about" className="cd-line-link w-fit hover:text-primary">CORE.OPS</Link>
              <Link href="/services" data-testid="link-footer-services" className="cd-line-link w-fit hover:text-primary">START_A_PROJECT</Link>
              <Link href="/developer" data-testid="link-footer-developer" className="cd-line-link w-fit hover:text-primary">DEV.LOG</Link>
            </div>
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[.2em] text-foreground/70">
              <span className="mb-1 text-[9px] tracking-[.24em] text-primary/60">LEGAL // READ</span>
              <Link href="/legal/terms" data-testid="link-footer-terms" className="cd-line-link w-fit hover:text-primary">TERMS.OF.SERVICE</Link>
              <Link href="/legal/acceptable-use" data-testid="link-footer-acceptable-use" className="cd-line-link w-fit hover:text-primary">ACCEPTABLE.USE</Link>
              <Link href="/legal/privacy" data-testid="link-footer-privacy" className="cd-line-link w-fit hover:text-primary">PRIVACY.POLICY</Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[.24em] text-primary/60">SOCIAL_CHANNELS // PREVIEW</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {socialPreviews.map(({ name, icon: Icon, signal, status }) => (
                <div key={name} className="cd-social-preview group border border-primary/20 bg-background/40 p-4" aria-label={`${name} social profile preview`} data-testid={`preview-footer-social-${name.toLowerCase()}`}>
                  <div className="flex items-center justify-between gap-3 text-primary">
                    <Icon size={17} aria-hidden="true" />
                    <span className="font-mono text-[8px] tracking-[.16em] opacity-60">{status}</span>
                  </div>
                  <p className="mt-4 font-display text-sm font-bold uppercase tracking-[.12em]">{name}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-foreground/40">{signal} // SOON</p>
                </div>
              ))}
            </div>
            <a href="mailto:hello@cyberdogcreative.com" data-testid="link-footer-email" className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-primary transition-colors hover:text-white">
              <Mail size={14} aria-hidden="true" /> OPEN_COMMS
            </a>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-primary/20 pt-8 font-mono text-[10px] uppercase tracking-[.2em] text-foreground/40 md:flex-row">
          <span>© 2024 CYBERDOG CREATIVE, LLC.</span>
          <span className="text-primary/60">END OF TRANSMISSION.</span>
        </div>
      </div>
    </footer>
  );
}
function ProjectArt({ art, className }: { art: string; className: string }) {
  return (
    <div className={`cd-project-art relative h-64 overflow-hidden clip-edge bg-muted/30 border border-primary/20 group-hover:border-primary/50 transition-colors duration-500 ${className}`}>
      <div className="absolute inset-0 opacity-10 cd-grid" />
      
      {art === 'radio' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
           <div className="w-32 h-32 border border-primary/40 rounded-full animate-[spin_10s_linear_infinite] border-dashed"></div>
           <div className="absolute w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
           </div>
           <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest text-primary/70">FREQ // 88.4 MHz</span>
        </div>
      )}
      {art === 'sport' && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full h-[1px] bg-primary/20 absolute top-1/2 -translate-y-1/2"></div>
            <div className="h-full w-[1px] bg-primary/20 absolute left-1/2 -translate-x-1/2"></div>
            <div className="w-24 h-24 border border-primary/60 rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
            <div className="absolute w-12 h-12 bg-primary/10 border border-primary rotate-45"></div>
            <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-primary/70">TRGT // ACQUIRED</span>
         </div>
      )}
      {art === 'school' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="grid grid-cols-3 gap-2 w-32 h-32 opacity-40">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`border border-primary/40 ${i % 2 === 0 ? 'bg-primary/20' : ''}`}></div>
            ))}
          </div>
          <div className="absolute font-display text-3xl font-bold text-foreground text-glow tracking-widest uppercase">SYS.OP</div>
        </div>
      )}
      {art === 'objects' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-40 h-40 border border-primary/30 clip-edge flex items-center justify-center bg-primary/5">
            <div className="w-20 h-20 border border-primary clip-edge-reverse flex items-center justify-center">
               <Zap size={24} className="text-primary opacity-50" />
            </div>
          </div>
          <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-primary/70">OBJ // 0XF3A</span>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: typeof projects[number]; featured?: boolean }) {
  return (
    <Link href={`/work/${project.slug}`} data-testid={`card-project-${project.id}`} className={`cd-project-card group block p-4 ${featured ? 'md:col-span-2' : ''}`}>
      <ProjectArt art={project.art} className="mb-6" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary/70">[{project.type}]</div>
          <h3 className="font-display text-2xl font-bold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
          <span className="mt-2 block font-mono text-[10px] tracking-[.15em] text-foreground/40">{project.year} // ENCRYPTED.FILE</span>
        </div>
        <span className="grid size-10 shrink-0 place-items-center border border-primary/30 clip-edge-reverse bg-primary/5 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
          <ArrowUpRight size={18} className="cd-project-arrow" />
        </span>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center pt-20 border-b border-primary/20 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster={`${import.meta.env.BASE_URL}cyberdog-brand-poster.jpg`}
            className="object-cover w-full h-full opacity-[0.35] mix-blend-screen"
          >
            <source src={`${import.meta.env.BASE_URL}cyberdog-brand-loop.mp4`} type="video/mp4" />
          </video>
          {/* Gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-20 md:px-10">
          <div className="max-w-4xl cd-animate">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="clip-button bg-primary/20 border border-primary text-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[.2em]">
                V 2.0.4 ONLINE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/50 flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                SIGNAL DETECTED
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.85] tracking-tight uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">HACK</span><br/>
              <span className="text-primary text-glow">THE</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">NOISE.</span>
            </h1>
            
            <p className="mt-10 max-w-xl text-lg font-mono tracking-wide leading-relaxed text-foreground/70 border-l-2 border-primary pl-6">
              CyberDog is a creative syndicate for brands and entities ready to break the algorithm. Precision engineering meets raw energy.
            </p>
            
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/work" data-testid="link-hero-work" className="clip-button group inline-flex items-center gap-3 bg-primary px-6 py-4 font-mono text-xs uppercase tracking-[.2em] text-black font-bold transition-all hover:bg-white hover:text-black">
                INITIALIZE_WORK <ArrowDownRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </Link>
              <Link href="/about" data-testid="link-hero-about" className="cd-line-link font-mono text-[11px] uppercase tracking-[.2em] text-foreground/80">
                DECRYPT_PROTOCOL
              </Link>
              <Link href="/services" data-testid="link-hero-services" className="cd-line-link font-mono text-[11px] uppercase tracking-[.2em] text-primary">
                START_A_PROJECT
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="font-mono text-[9px] uppercase tracking-[.3em] text-primary/70">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b border-primary/20 bg-primary/5 py-4">
        <div className="marquee-container">
          <div className="marquee-content font-display text-2xl font-bold uppercase tracking-widest text-primary/80">
            <span className="flex items-center gap-8 px-4">
              <span>CULTURE IS MATERIAL</span><Hexagon size={16} />
              <span>ATTENTION IS A PRACTICE</span><Hexagon size={16} />
              <span>IDEAS NEED BODIES</span><Hexagon size={16} />
              <span>CULTURE IS MATERIAL</span><Hexagon size={16} />
              <span>ATTENTION IS A PRACTICE</span><Hexagon size={16} />
              <span>IDEAS NEED BODIES</span><Hexagon size={16} />
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>EXEC_SUMMARY</SectionLabel>
            <p className="font-display text-4xl font-bold leading-[1.1] tracking-wide uppercase md:text-5xl lg:text-6xl text-foreground">
              WE MAKE THE <span className="text-primary text-glow">IN-BETWEEN</span> FEEL POSSIBLE.
            </p>
          </div>
          <div className="max-w-xl md:pt-12 font-mono">
            <p className="text-lg leading-relaxed text-foreground/80 mb-6">
              The best work lives somewhere between a sharp strategy and a gut feeling. Between the screen and the street. Between the firewall and the mainframe.
            </p>
            <p className="text-sm leading-relaxed text-foreground/50">
              We help rogue elements find that place, then build something with enough edge to cut through the static.
            </p>
            <Link href="/about" data-testid="link-manifesto-about" className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-primary hover:text-white transition-colors border border-primary/30 px-4 py-2 clip-edge-reverse">
              READ_FULL_THESIS <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/20 bg-card/50 px-5 py-24 md:px-10 md:py-32 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-[1440px] relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <SectionLabel>LATEST_TRANSMISSIONS</SectionLabel>
              <h2 className="font-display text-4xl font-bold tracking-widest uppercase md:text-6xl text-foreground">
                RECENT_<span className="text-primary">WORK</span>
              </h2>
            </div>
            <Link href="/work" data-testid="link-home-all-work" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-primary hover:text-white transition-colors">
              [ VIEW_ALL_ARCHIVES ] <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.id} project={project} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionLabel>DISPATCHES</SectionLabel>
            <h2 className="font-display text-5xl font-black leading-none tracking-widest uppercase md:text-7xl">
              SYS.<br/><span className="text-primary text-glow">LOGS</span>
            </h2>
            <p className="mt-8 max-w-sm font-mono text-sm leading-relaxed text-foreground/60 border-l border-primary/30 pl-4">
              Unfiltered thoughts on culture, tech, aesthetics, and the artifacts we can't ignore.
            </p>
            <Link href="/journal" data-testid="link-home-journal" className="clip-button mt-10 inline-flex items-center gap-3 bg-primary/10 border border-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[.2em] text-primary hover:bg-primary hover:text-black transition-all">
              MOUNT_ARCHIVE <Terminal size={14} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {journal.map((item, i) => (
              <Link href={`/journal/${['make-things-harder-to-ignore', 'five-records-internet-free-afternoon', 'what-good-community-asks-of-you'][i]}`} data-testid={`link-journal-preview-${item.id}`} key={item.id} className="group relative border border-primary/20 bg-card/40 p-6 clip-edge hover:border-primary/60 hover:bg-primary/5 transition-all">
                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowUpRight size={24} className="text-primary" />
                </div>
                <div className="mb-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[.2em]">
                  <span className="bg-primary/20 text-primary px-2 py-1">[{item.tag}]</span>
                  <span className="text-foreground/40">{item.date}</span>
                </div>
                <h3 className="max-w-lg font-display text-xl font-bold leading-snug uppercase tracking-wide group-hover:text-primary transition-colors md:text-2xl">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px] rounded-none border border-primary/30 bg-card relative overflow-hidden clip-edge p-8 md:p-16 lg:p-24">
          <div className="absolute inset-0 bg-primary/5 cd-grid opacity-50"></div>
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <ScanLine size={300} className="text-primary" />
          </div>
          
          <div className="relative z-10 grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <SectionLabel>NETWORK_SYNC</SectionLabel>
              <h2 className="max-w-3xl font-display text-5xl font-black leading-none tracking-widest uppercase md:text-7xl lg:text-8xl">
                JOIN_THE<br/><span className="text-primary text-glow">COLLECTIVE.</span>
              </h2>
              <p className="mt-8 max-w-md font-mono text-sm leading-relaxed text-foreground/70">
                A secure channel for high-signal references, encrypted drops, and underground experiments.
              </p>
            </div>
            <Link href="/community" data-testid="link-home-community" className="clip-button group inline-flex items-center justify-center gap-3 bg-primary px-8 py-5 font-mono text-sm font-bold uppercase tracking-[.2em] text-black hover:bg-white hover:text-black transition-colors w-full md:w-auto">
              ENTER_MAINFRAME <Zap size={18} className="animate-pulse" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Work() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Identity', 'Digital', 'Campaign', 'Editorial'];
  const visible = filter === 'All' ? projects : projects.filter(p => p.type.toLowerCase().includes(filter.toLowerCase()));
  
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 md:px-10 md:pt-32">
      <div className="max-w-4xl cd-animate">
        <SectionLabel>PORTFOLIO // 2019-24</SectionLabel>
        <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.85] tracking-tight uppercase">
          THINGS_WE<br/><span className="text-primary text-glow">EXECUTED.</span>
        </h1>
        <p className="mt-10 max-w-xl font-mono text-base leading-relaxed text-foreground/70 border-l-2 border-primary/50 pl-6">
          System architectures, digital environments, and aesthetic weaponry for entities that refuse the default setting.
        </p>
      </div>
      
      <div className="mt-20 flex gap-3 overflow-x-auto pb-4 cd-scrollbar mask-fade-right">
        {filters.map(item => (
          <button 
            type="button" 
            key={item} 
            onClick={() => setFilter(item)} 
            data-testid={`button-filter-${item.toLowerCase()}`} 
            className={`shrink-0 border px-6 py-2.5 font-mono text-[11px] uppercase tracking-[.2em] transition-all clip-edge-reverse ${
              filter === item 
                ? 'border-primary bg-primary/10 text-primary box-glow' 
                : 'border-primary/20 bg-card hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {visible.map((project, index) => (
          <div key={project.id} className="cd-animate" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProjectCard project={project} featured={index === 0 && filter === 'All'} />
          </div>
        ))}
      </div>
      
      <div className="mt-32 grid gap-12 border-t border-primary/20 pt-16 md:grid-cols-[1fr_2fr]">
        <SectionLabel>CAPABILITIES_MAP</SectionLabel>
        <p className="max-w-2xl font-display text-2xl font-bold leading-snug uppercase tracking-wider md:text-4xl text-foreground/90">
          IDENTITY SYSTEMS, UI/UX ENGINEERING, BRAND NARRATIVE, EXPERIENTIAL SURFACES, AND THE DARK MATTER THAT CONNECTS THEM.
        </p>
      </div>
    </div>
  );
}

function Journal() {
  const [active, setActive] = useState('All dispatches');
  const tags = ['All dispatches', 'SYS.LOG', 'NET.TRAFFIC', 'DAT.DUMP'];
  
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 md:px-10 md:pt-32">
      <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div className="cd-animate">
          <SectionLabel>ARCHIVE // IRREGULAR INTERVALS</SectionLabel>
          <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.85] tracking-tight uppercase">
            RAW<br/><span className="text-primary text-glow">DATA.</span>
          </h1>
        </div>
        
        <div className="relative p-8 border border-primary/30 bg-primary/5 clip-edge cd-animate cd-delay-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-primary/70">CURRENT_OBSESSION</span>
          <p className="mt-6 font-display text-2xl font-bold leading-snug uppercase">
            "THE SYSTEM IS NOT BROKEN. IT WAS BUILT THIS WAY."
          </p>
          <div className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/50">
            <span>— UNKNOWN ADMIN</span>
            <Cpu size={16} className="text-primary" />
          </div>
        </div>
      </div>
      
      <div className="mt-20 flex gap-3 overflow-x-auto border-b border-primary/20 pb-6 cd-scrollbar">
        {tags.map(tag => (
          <button 
            type="button" 
            key={tag} 
            onClick={() => setActive(tag)} 
            data-testid={`button-journal-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} 
            className={`shrink-0 px-4 py-2 font-mono text-[11px] uppercase tracking-[.2em] transition-colors ${
              active === tag ? 'text-primary border-b-2 border-primary' : 'text-foreground/50 hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="divide-y divide-primary/15 mt-8">
        {journal.map((item, index) => (
          <article key={item.id} className="group grid gap-6 py-10 md:grid-cols-[.25fr_1fr_.25fr] md:items-start hover:bg-primary/5 px-4 -mx-4 transition-colors">
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[.2em] text-foreground/40">
              <span className="text-primary font-bold">0{index + 1}</span>
              <span>{item.date}</span>
            </div>
            <div>
              <span className="inline-block border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[.2em] text-primary mb-4">
                {item.tag}
              </span>
              <h2 className="max-w-2xl font-display text-2xl font-bold leading-tight uppercase tracking-wider transition-colors group-hover:text-primary md:text-4xl">
                {item.title}
              </h2>
              <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-foreground/60">
                Encrypted thoughts extracted from the studio servers. Notes on attention, aesthetics, and building resilient systems.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-end mt-4 md:mt-0">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                <Clock3 size={14} className="text-primary/70" />
                {item.read}
              </span>
              <button 
                type="button" 
                onClick={() => setActive(item.tag)} 
                data-testid={`button-read-${item.id}`} 
                aria-label={`Read ${item.title}`} 
                className="grid size-12 place-items-center border border-primary/30 bg-card text-primary transition-all group-hover:bg-primary group-hover:text-black clip-edge-reverse"
              >
                <ArrowUpRight size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
      
      <div className="mt-16 flex items-center gap-4 border border-dashed border-primary/30 bg-primary/5 p-6 font-mono text-[11px] uppercase tracking-[.2em] text-foreground/60 justify-center">
        <Zap size={16} className="text-primary" /> 
        END OF FILE. WAITING FOR NEW TRANSMISSION...
      </div>
    </div>
  );
}
function About() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 md:px-10 md:pt-32">
      <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div className="cd-animate">
          <SectionLabel>THE_SYNDICATE // EST_2016</SectionLabel>
          <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.85] tracking-tight uppercase">
            CALCULATED<br/><span className="text-primary text-glow">ANOMALIES.</span>
          </h1>
        </div>
        <p className="max-w-md font-mono text-base leading-relaxed text-foreground/70 border-l-2 border-primary/50 pl-6 md:pb-4 cd-animate cd-delay-1">
          CyberDog is an independent engineering unit operating across brand identity, digital architecture, and the underground culture fueling it all.
        </p>
      </div>

      <div className="my-24 grid gap-6 md:grid-cols-3 md:gap-8 cd-animate cd-delay-2">
        <div className="md:col-span-2 border border-primary/20 bg-card p-10 md:p-16 relative overflow-hidden clip-edge">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl"></div>
          <SectionLabel>CORE_OS</SectionLabel>
          <p className="max-w-3xl font-display text-3xl font-bold leading-tight uppercase tracking-wider md:text-5xl mt-8">
            WE BELIEVE THE OUTPUT SHOULD FEEL LIKE SOMEONE <span className="text-primary">FOUGHT FOR IT.</span>
          </p>
        </div>
        <div className="flex min-h-[300px] flex-col justify-between border border-primary bg-primary/10 p-8 clip-edge-reverse box-glow">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">ADMIN_NOTE</span>
          <p className="font-display text-3xl font-black leading-none uppercase tracking-widest text-foreground">
            TASTE IS A WEAPON. USE IT.
          </p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70">CD // ROOT_ACCESS</span>
        </div>
      </div>

      <section className="grid gap-16 border-t border-primary/20 pt-24 pb-20 md:grid-cols-[.6fr_1.4fr] md:py-32">
        <SectionLabel>METHODOLOGY</SectionLabel>
        <div className="grid gap-12 md:grid-cols-2">
          {[
            ['01 // INITIATE', 'Before moodboards and templates: what is the core function? We find the hard truth hiding in the corrupted data.'],
            ['02 // EXPOSE EDGES', 'Safe is invisible. We use high contrast, system constraints, and productive friction to make concepts undeniable.'],
            ['03 // DEPLOY SYSTEM', 'A brand should survive the wild, not just a presentation. We build robust frameworks for hostile environments.'],
            ['04 // OPEN SOURCE', 'The studio is a lab, but also a terminal. Our logs and network keep the backdoors open for allies.']
          ].map(([title, desc]) => (
            <div key={title} className="group">
              <h2 className="font-display text-2xl font-bold tracking-widest uppercase group-hover:text-primary transition-colors text-foreground">{title}</h2>
              <p className="mt-5 font-mono text-sm leading-relaxed text-foreground/60 border-l border-primary/20 pl-4 group-hover:border-primary transition-colors">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/20 py-20 md:py-32">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div>
            <SectionLabel>SITE_MAP</SectionLabel>
            <h2 className="font-display text-4xl font-black leading-none uppercase tracking-widest md:text-6xl">
              SELECT<br/>YOUR_NODE<span className="text-primary">_</span>
            </h2>
          </div>
          <div className="grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {[
              ['/work', 'PORTFOLIO', 'VIEW_PROJECTS'], 
              ['/journal', 'SYS.LOGS', 'READ_RECORDS'], 
              ['/community', 'NETWORK', 'JOIN_MAINFRAME'], 
              ['/', 'HOME.DIR', 'RETURN_BASE']
            ].map(([href, title, desc]) => (
              <Link href={href} data-testid={`link-ecosystem-${title.toLowerCase()}`} key={title} className="group flex items-center justify-between border border-primary/20 bg-card p-6 transition-all hover:border-primary hover:bg-primary/10 clip-edge">
                <div>
                  <span className="font-display text-xl font-bold uppercase tracking-widest text-foreground group-hover:text-primary">{title}</span>
                  <span className="mt-3 block font-mono text-[9px] uppercase tracking-[.2em] text-foreground/40 group-hover:text-primary/70">{desc}</span>
                </div>
                <ArrowUpRight size={20} className="text-primary/50 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeRedirect() {
  return <>
    <Show when="signed-in"><Redirect to="/user-portal" /></Show>
    <Show when="signed-out"><Home /></Show>
  </>;
}

function UserPortal() {
  const { user } = useUser();
  const displayName = user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'operator';
  return <Show when="signed-in">
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-14 md:px-10 md:pt-24">
      <div className="cd-portal-frame cd-grid relative overflow-hidden border border-[#ff1744]/40 bg-[#0b0d12] p-6 text-[#f1f3f7] md:p-12">
        <div className="absolute right-8 top-8 size-24 rounded-full border border-[#ff1744]/30 md:size-40" />
        <div className="absolute right-14 top-14 size-12 rounded-full border border-[#ff1744]/60 md:right-20 md:top-20 md:size-24" />
        <SectionLabel>Authenticated channel / CD—{user?.id.slice(-4).toUpperCase()}</SectionLabel>
        <h1 className="max-w-4xl font-display text-[clamp(3.5rem,9vw,8rem)] font-extrabold uppercase leading-[.85] tracking-[-.07em]">Welcome<br /><span className="text-[#ff1744]">{displayName}.</span></h1>
        <p className="mt-8 max-w-xl font-mono text-sm leading-relaxed text-[#a0a8b8]">Your access key is active. The member layer is coming online — start with the latest transmissions, then find the signal that feels like yours.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/community" data-testid="link-portal-community" className="inline-flex items-center gap-3 bg-[#ff1744] px-5 py-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#0b0d12]">Enter community <ArrowUpRight size={15} /></Link>
          <Link href="/community/profile" data-testid="link-portal-profile" className="inline-flex items-center gap-3 border border-[#3a414f] px-5 py-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#f1f3f7]">Manage identity <ArrowUpRight size={15} /></Link>
          <Link href="/journal" data-testid="link-portal-journal" className="inline-flex items-center gap-3 border border-[#3a414f] px-5 py-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#f1f3f7]">Read transmissions <ArrowUpRight size={15} /></Link>
        </div>
        <div className="mt-16 grid gap-4 border-t border-[#3a414f] pt-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#a0a8b8] sm:grid-cols-3">
          <span><b className="block text-[#ff1744]">01</b>Signal access / granted</span>
          <span><b className="block text-[#ff1744]">02</b>Community layer / standby</span>
          <span><b className="block text-[#ff1744]">03</b>Next transmission / soon</span>
        </div>
      </div>
    </div>
  </Show>;
}

function ProtectedCommunityProfile() {
  return <>
    <Show when="signed-in"><CommunityProfilePage /></Show>
    <Show when="signed-out"><Redirect to="/sign-in" /></Show>
  </>;
}
function Router() {
  return (
    <RoutedErrorBoundary>
      <Shell>
        <Suspense fallback={<div className="mx-auto max-w-xl px-5 py-32 text-center font-mono text-xs uppercase tracking-[.2em] text-foreground/60">LOADING_CHANNEL...</div>}>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/user-portal" component={UserPortal} />
            <Route path="/work" component={Work} />
            <Route path="/work/:slug" component={CaseStudyPage} />
            <Route path="/legal/terms" component={TermsPage} />
            <Route path="/legal/acceptable-use" component={AcceptableUsePage} />
            <Route path="/legal/privacy" component={PrivacyPage} />
            <Route path="/journal" component={JournalIndex} />
            <Route path="/journal/:slug" component={JournalPostPage} />
            <Route path="/studio" component={StudioPage} />
            <Route path="/community" component={CommunityIndex} />
            <Route path="/community/rooms/:slug" component={CommunityRoomPage} />
            <Route path="/community/profile" component={ProtectedCommunityProfile} />
            <Route path="/about" component={About} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/developer" component={DeveloperPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Shell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-[#07090d] px-4 py-10">
    <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
  </div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-[#07090d] px-4 py-10">
    <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
  </div>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const previousUserId = useRef<string | null | undefined>(undefined);
  const client = queryClient;

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        client.clear();
      }
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return <ClerkProvider
    publishableKey={clerkPubKey}
    proxyUrl={clerkProxyUrl}
    appearance={clerkAppearance}
    signInUrl={`${basePath}/sign-in`}
    signUpUrl={`${basePath}/sign-up`}
    localization={{
      signIn: { start: { title: 'Welcome back, operator', subtitle: 'Resume your CyberDog channel' } },
      signUp: { start: { title: 'Open a channel', subtitle: 'Join the CyberDog signal' } },
    }}
    routerPush={(to) => setLocation(stripBase(to))}
    routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
  >
    <ClerkQueryClientCacheInvalidator />
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route component={Router} />
    </Switch>
  </ClerkProvider>;
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkProviderWithRoutes />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
