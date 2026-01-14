import React from "react";
import { useTranslation } from "react-i18next";

function useInView(options = { threshold: 0.15 }) {
  const ref = React.useRef(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect(); // animate once
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}

function Reveal({ children, className = "" }) {
  const [ref, show] = useInView();

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Container({ children }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function NavLink({ children, href = "#", active, onClick }) {
  const scrollToId = (id) => (e) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 88; // 88px offset
  window.scrollTo({ top: y, behavior: "smooth" });
  setActive(id);
};

  return (
    <a
      href={href}
      onClick={onClick}
      className={[
        "text-sm font-medium transition-colors",
        active ? "text-zinc-950" : "text-zinc-700 hover:text-zinc-950",
      ].join(" ")}
    >
      {children}
      <span
        className={[
          "mt-1 block h-0.5 rounded-full transition-all",
          active ? "w-full bg-zinc-900" : "w-0 bg-transparent",
        ].join(" ")}
      />
    </a>
  );
}


function PrimaryButton({ children, href = "#" }) {
  return (
    <a
      href={href}
      className="cta-emoji relative inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ children, href = "#" }) {
  return (
    <a
      href={href}
      className="cta-emoji inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
    >
      {children}
    </a>
  );
}

function Navbar() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = React.useState("features");

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'mn' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  React.useEffect(() => {
    const ids = ["features", "how", "portfolio", "pricing", "faq", "contact"];

    const onScroll = () => {
      const scrollY = window.scrollY + 120; // offset for sticky navbar
      let current = "features";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.offsetTop;
        if (scrollY >= top) current = id;
      }

      setActive(current);
    };

    onScroll(); // set initial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88; // 88px offset
    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Photos/dalatech-logo.png" alt="DalaTech" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              {t('nav.brand')}
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="#features" active={active === "features"} onClick={scrollToId("features")}>
              {t('nav.features')}
            </NavLink>
            <NavLink href="#how" active={active === "how"} onClick={scrollToId("how")}>
              {t('nav.howItWorks')}
            </NavLink>
            <NavLink href="#portfolio" active={active === "portfolio"} onClick={scrollToId("portfolio")}>
              {t('nav.portfolio')}
            </NavLink>
            <NavLink href="#pricing" active={active === "pricing"} onClick={scrollToId("pricing")}>
              {t('nav.pricing')}
            </NavLink>
            <NavLink href="#faq" active={active === "faq"} onClick={scrollToId("faq")}>
              {t('nav.faq')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className={[
                "hidden text-sm font-medium sm:inline transition-colors",
                active === "contact" ? "text-zinc-950" : "text-zinc-700 hover:text-zinc-950",
              ].join(" ")}
              onClick={scrollToId("contact")}
            >
              {t('nav.contact')}
            </a>
            <button
              onClick={toggleLanguage}
              className="hidden sm:inline px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
              title="Toggle language"
            >
              {i18n.language === 'en' ? 'MN' : 'EN'}
            </button>
            <PrimaryButton href="#contact">{t('nav.getDemo')}</PrimaryButton>
          </div>
        </div>
      </Container>
    </header>
  );
}

function DemoChatCard() {
  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState([
    { role: "user", text: "Do you have brake pads for a 2016 Corolla?" },
    { role: "bot", text: "Yes — we have several options. What brand do you prefer (Akebono, Bosch, OEM)?" },
  ]);

  const send = () => {
    const t = value.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "bot", text: "Got it — I can help. What's your budget range?" }]);
    setValue("");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold text-zinc-900">Live demo (preview)</p>

      <div className="mt-3 space-y-2">
        {messages.slice(-4).map((m, i) => (
          <div
            key={i}
            className={[
              "max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed",
              m.role === "user"
                ? "ml-auto bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-900",
            ].join(" ")}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-zinc-900"
          placeholder="Ask something..."
        />
        <button
          type="button"
          onClick={send}
          className="cta-emoji rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99]"
        >
          Send
        </button>
      </div>
    </div>
  );
}


function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-zinc-100 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-zinc-100 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-10 py-16 md:grid-cols-[35%_65%] md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              <span className="h-2 w-2 rounded-full bg-zinc-900" />
              {t('hero.badge')}
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {t('hero.title')}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
              {t('hero.description')}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="#contact">{t('hero.buttons.getDemo')}</PrimaryButton>
              <SecondaryButton href="#portfolio">{t('hero.buttons.seeWork')}</SecondaryButton>
            </div>

            <div className="mt-8">
              <p className="text-xs font-medium text-zinc-500">
                {t('hero.tech')}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2">
                  <span className="text-sm font-semibold text-zinc-900">React</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2">
                  <span className="text-sm font-semibold text-zinc-900">Tailwind CSS</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2">
                  <span className="text-sm font-semibold text-zinc-900">OpenAI</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2">
                  <span className="text-sm font-semibold text-zinc-900">Vite</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video w-full rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
              <video 
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/Videos/JapanTOK_VIdeo.MOV" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="absolute -bottom-6 left-6 hidden w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:block transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold text-zinc-900">Example</p>
              <p className="mt-1 text-xs text-zinc-600">
                “Do you have brake pads for a 2016 Corolla?”
              </p>
              <div className="mt-3 rounded-xl bg-zinc-900 px-3 py-2 text-xs text-white">
                Yes — we have multiple options. What brand do you prefer?
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ title, subtitle, bullets, badge, image }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{title}</p>
          <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
            {badge}
          </span>
        ) : null}
      </div>

      <ul className="mt-5 space-y-2 text-sm text-zinc-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {image ? (
        <div className="mt-6 h-48 rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="mt-6 h-28 rounded-xl border border-zinc-200 bg-white">
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            Image / UI preview placeholder
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}

function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20">
      <Container>
        <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-700">{t('features.section')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600">
            {t('features.description')}
          </p>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            title={t('features.chatbot.title')}
            badge={t('features.chatbot.badge')}
            subtitle={t('features.chatbot.subtitle')}
            bullets={[
              t('features.chatbot.bullets.0'),
              t('features.chatbot.bullets.1'),
              t('features.chatbot.bullets.2'),
            ]}
            image="/Photos/chatbot-feature.png"
          />
          <FeatureCard
            title={t('features.voiceAgent.title')}
            badge={t('features.voiceAgent.badge')}
            subtitle={t('features.voiceAgent.subtitle')}
            bullets={[
              t('features.voiceAgent.bullets.0'),
              t('features.voiceAgent.bullets.1'),
              t('features.voiceAgent.bullets.2'),
            ]}
            image="/Photos/voice-agent-feature.png"
          />
          <FeatureCard
            title={t('features.fullIntegration.title')}
            badge={t('features.fullIntegration.badge')}
            subtitle={t('features.fullIntegration.subtitle')}
            bullets={[
              t('features.fullIntegration.bullets.0'),
              t('features.fullIntegration.bullets.1'),
              t('features.fullIntegration.bullets.2'),
            ]}
            image="/Photos/full-integration-feature.png"
          />
        </div>
        </Reveal>
        
        <Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label={t('features.stats.fasterResponses')} value={t('features.stats.fasterResponsesValue')} />
          <MiniStat label={t('features.stats.lessRepetitiveWork')} value={t('features.stats.lessRepetitiveWorkValue')} />
          <MiniStat label={t('features.stats.betterExperience')} value={t('features.stats.betterExperienceValue')} />
          <MiniStat label={t('features.stats.setupTime')} value={t('features.stats.setupTimeValue')} />
        </div>
        </Reveal>
      </Container>
    </section>
  );
}

function StepCard({ step, title, desc, image }) {
  return (
    <Reveal>
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
          {step}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-950">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{desc}</p>
        </div>
      </div>

      {image ? (
        <div className="mt-6 h-48 rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="mt-6 h-24 rounded-xl border border-zinc-200 bg-white">
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            Diagram / screenshot placeholder
          </div>
        </div>
      )}
    </div>
    </Reveal>
  );
}

function Deliverable({ title, desc }) {
  return (
    <Reveal>
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-zinc-950">{title}</p>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
    </Reveal>
  );
}

function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="py-20">
      <Container>
        <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-700">{t('howItWorks.section')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {t('howItWorks.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600">
            {t('howItWorks.description')}
          </p>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <StepCard
            step={t('howItWorks.discovery.step')}
            title={t('howItWorks.discovery.title')}
            desc={t('howItWorks.discovery.description')}
            image="/Photos/discovery-step.png"
          />
          <StepCard
            step={t('howItWorks.buildTrain.step')}
            title={t('howItWorks.buildTrain.title')}
            desc={t('howItWorks.buildTrain.description')}
            image="/Photos/train-step.png"
          />
          <StepCard
            step={t('howItWorks.launchImprove.step')}
            title={t('howItWorks.launchImprove.title')}
            desc={t('howItWorks.launchImprove.description')}
            image="/Photos/launch-step.png"
          />
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{t('howItWorks.deliverables')}</h3>
          <p className="mt-2 text-sm text-zinc-600">
            {t('howItWorks.deliverablesDesc')}
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Deliverable
              title={t('howItWorks.website.title')}
              desc={t('howItWorks.website.description')}
            />
            <Deliverable
              title={t('howItWorks.aiAssistant.title')}
              desc={t('howItWorks.aiAssistant.description')}
            />
            <Deliverable
              title={t('howItWorks.monthlySupport.title')}
              desc={t('howItWorks.monthlySupport.description')}
            />
          </div>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-zinc-950">
                {t('howItWorks.cta')}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {t('howItWorks.ctaDesc')}
              </p>
            </div>
            <PrimaryButton href="#contact">{t('pricing.paymentTerms.cta')}</PrimaryButton>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function Portfolio() {
  const { t } = useTranslation();

  return (
    <section id="portfolio" className="py-20">
      <Container>
        <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-700">{t('portfolio.section')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {t('portfolio.title')}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-zinc-600">
              {t('portfolio.description')}
            </p>
          </div>

          <div className="flex gap-3">
            <SecondaryButton href="https://japantokmongolia.com/">{t('portfolio.visitWebsite')}</SecondaryButton>
            <PrimaryButton href="#contact">{t('portfolio.getDemo')}</PrimaryButton>
          </div>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <img
              src="/Photos/japantok-preview.png"
              alt="JapanTok Mongolia website preview"
              className="h-full w-full object-cover"
            />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>{t('portfolio.japantok.pills.website')}</Pill>
              <Pill>{t('portfolio.japantok.pills.chatbot')}</Pill>
              <Pill>{t('portfolio.japantok.pills.productQA')}</Pill>
              <Pill>{t('portfolio.japantok.pills.availability')}</Pill>
            </div>

            <p className="mt-4 text-sm text-zinc-600">
              {t('portfolio.japantok.link')}{" "}
              <a
                className="font-semibold text-zinc-900 hover:underline"
                href="https://japantokmongolia.com/"
                target="_blank"
                rel="noreferrer"
              >
                japantokmongolia.com
              </a>
            </p>
          </div>
          </Reveal>
          <Reveal>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
              {t('portfolio.japantok.title')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              {t('portfolio.japantok.description')}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold text-zinc-700">{t('portfolio.japantok.whatWeBuilt')}</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.features.0')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.features.1')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.features.2')}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold text-zinc-700">{t('portfolio.japantok.idealOutcomes')}</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.outcomes.0')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.outcomes.1')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span>{t('portfolio.japantok.outcomes.2')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="#contact">{t('portfolio.japantok.buttons.requestDemo')}</PrimaryButton>
              <SecondaryButton href="https://japantokmongolia.com/">{t('portfolio.japantok.buttons.viewLive')}</SecondaryButton>
            </div>
          </div>
          </Reveal>
        </div>
        </Reveal>
      </Container>
    </section>
  );

}

function PriceCard({
  title,
  badge,
  priceLine,
  subLine,
  desc,
  bullets,
  cta,
  primary,
  footnote,
}) {
  return (
    <Reveal>
    <div
      className={[
        "rounded-2xl border bg-white p-6   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        primary ? "border-zinc-900" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{title}</p>
          {desc ? <p className="mt-1 text-sm text-zinc-600">{desc}</p> : null}
        </div>

        {badge ? (
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-3xl font-semibold tracking-tight text-zinc-950">
          {priceLine}
        </p>
        {subLine ? (
          <p className="mt-2 text-sm text-zinc-600">{subLine}</p>
        ) : null}
      </div>

      <ul className="mt-6 space-y-2 text-sm text-zinc-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {primary ? (
          <PrimaryButton href="#contact">{cta}</PrimaryButton>
        ) : (
          <SecondaryButton href="#contact">{cta}</SecondaryButton>
        )}
      </div>

      {footnote ? (
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          {footnote}
        </p>
      ) : null}
    </div>
    </Reveal>
  );
}

function Pricing() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-20">
      <Container>
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold text-zinc-700">{t('pricing.section')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {t('pricing.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600">
              {t('pricing.description')}
            </p>
          </div>
        </Reveal>

        {/* One-time setup */}
        <Reveal>
          <div className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                {t('pricing.oneTimeSetup')}
              </h3>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                {t('pricing.promoBadge')}
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-4">
              <PriceCard
                title={t('pricing.cards.website.title')}
                badge={t('pricing.cards.website.badge')}
                priceLine={t('pricing.cards.website.price')}
                subLine={t('pricing.cards.website.subLine')}
                desc={t('pricing.cards.website.description')}
                bullets={[
                  t('pricing.cards.website.bullets.0'),
                  t('pricing.cards.website.bullets.1'),
                  t('pricing.cards.website.bullets.2'),
                  t('pricing.cards.website.bullets.3'),
                ]}
                cta={t('pricing.cards.website.cta')}
              />

              <PriceCard
                title={t('pricing.cards.chatbot.title')}
                badge={t('pricing.cards.chatbot.badge')}
                priceLine={
                  <span>
                    <span className="text-zinc-400 line-through">390,000₮</span>{" "}
                    <span>195,000₮</span>
                  </span>
                }
                subLine={t('pricing.cards.chatbot.subLine')}
                desc={t('pricing.cards.chatbot.description')}
                bullets={[
                  t('pricing.cards.chatbot.bullets.0'),
                  t('pricing.cards.chatbot.bullets.1'),
                  t('pricing.cards.chatbot.bullets.2'),
                ]}
                cta={t('pricing.cards.chatbot.cta')}
                primary
              />

              <PriceCard
                title={t('pricing.cards.voice.title')}
                badge={t('pricing.cards.voice.badge')}
                priceLine={t('pricing.cards.voice.price')}
                subLine={t('pricing.cards.voice.subLine')}
                desc={t('pricing.cards.voice.description')}
                bullets={[
                  t('pricing.cards.voice.bullets.0'),
                  t('pricing.cards.voice.bullets.1'),
                  t('pricing.cards.voice.bullets.2'),
                ]}
                cta={t('pricing.cards.voice.cta')}
              />

              <PriceCard
                title={t('pricing.cards.combo.title')}
                badge={t('pricing.cards.combo.badge')}
                priceLine={t('pricing.cards.combo.price')}
                subLine={t('pricing.cards.combo.subLine')}
                desc={t('pricing.cards.combo.description')}
                bullets={[
                  t('pricing.cards.combo.bullets.0'),
                  t('pricing.cards.combo.bullets.1'),
                  t('pricing.cards.combo.bullets.2'),
                ]}
                cta={t('pricing.cards.combo.cta')}
              />
            </div>
          </div>
        </Reveal>

        {/* Monthly packages */}
        <Reveal>
          <div className="mt-14">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
              {t('pricing.monthly.title')}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              {t('pricing.monthly.description')}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Chatbot monthly */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">
                      {t('pricing.monthly.chatbot.title')}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {t('pricing.monthly.chatbot.description')}
                    </p>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-zinc-700">
                          {t('pricing.monthly.chatbot.table.headers.feature')}
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-700">
                          {t('pricing.monthly.chatbot.table.headers.basic')}
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-700">
                          {t('pricing.monthly.chatbot.table.headers.growth')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      <tr>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.server.feature')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.server.basic')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.server.growth')}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.dataUpdates.feature')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.dataUpdates.basic')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.dataUpdates.growth')}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.support.feature')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.support.basic')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.support.growth')}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.monitoring.feature')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.monitoring.basic')}</td>
                        <td className="px-4 py-3 text-zinc-700">{t('pricing.monthly.chatbot.table.rows.monitoring.growth')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-zinc-500">
                    {t('pricing.monthly.chatbot.tip')}
                  </p>
                  <PrimaryButton href="#contact">{t('pricing.monthly.chatbot.cta')}</PrimaryButton>
                </div>
              </div>

              {/* Receptionist monthly */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">
                      {t('pricing.monthly.receptionist.title')}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {t('pricing.monthly.receptionist.description')}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-950">{t('pricing.monthly.receptionist.standard.title')}</p>
                      <span className="text-sm font-semibold text-zinc-950">{t('pricing.monthly.receptionist.standard.price')}</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.standard.features.0')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.standard.features.1')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.standard.features.2')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.standard.features.3')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-zinc-900 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-950">{t('pricing.monthly.receptionist.premium.title')}</p>
                      <span className="text-sm font-semibold text-zinc-950">{t('pricing.monthly.receptionist.premium.price')}</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.premium.features.0')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.premium.features.1')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.premium.features.2')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t('pricing.monthly.receptionist.premium.features.3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <PrimaryButton href="#contact">{t('pricing.monthly.receptionist.cta')}</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Payment terms */}
        <Reveal>
          <div className="mt-14 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-semibold text-zinc-950">{t('pricing.paymentTerms.title')}</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>{t('pricing.paymentTerms.terms.0')}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>{t('pricing.paymentTerms.terms.1')}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>{t('pricing.paymentTerms.terms.2')}</span>
              </li>
            </ul>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500">
                {t('pricing.paymentTerms.note')}
              </p>
              <PrimaryButton href="#contact">{t('contact.title')}</PrimaryButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="cta-emoji w-full rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-zinc-950">{question}</p>
        <span
          className={[
            "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-xs font-bold text-zinc-700 transition-transform",
            open ? "rotate-45" : "rotate-0",
          ].join(" ")}
        >
          +
        </span>
      </div>

      {open ? (
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">{answer}</p>
      ) : null}
    </button>
  );
}

function FAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-20">
      <Container>
        <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-700">{t('faq.section')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {t('faq.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600">
            {t('faq.description')}
          </p>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FAQItem
            question={t('faq.q1.question')}
            answer={t('faq.q1.answer')}
          />
          <FAQItem
            question={t('faq.q2.question')}
            answer={t('faq.q2.answer')}
          />
          <FAQItem
            question={t('faq.q3.question')}
            answer={t('faq.q3.answer')}
          />
          <FAQItem
            question={t('faq.q4.question')}
            answer={t('faq.q4.answer')}
          />
          <FAQItem
            question={t('faq.q5.question')}
            answer={t('faq.q5.answer')}
          />
          <FAQItem
            question={t('faq.q6.question')}
            answer={t('faq.q6.answer')}
          />
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-semibold text-zinc-950">
            {t('faq.stillHaveQuestions')}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {t('faq.contactPrompt')}
          </p>
          <div className="mt-4">
            <PrimaryButton href="#contact">{t('faq.talkToUs')}</PrimaryButton>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}

function ContactCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-zinc-950">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{desc}</p>
    </div>
  );
}

function Contact() {
  const { t } = useTranslation();
  
  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = form.get("name")?.toString().trim();
    const business = form.get("business")?.toString().trim();
    const phone = form.get("phone")?.toString().trim();
    const service = form.get("service")?.toString().trim();
    const message = form.get("message")?.toString().trim();

    const data = {
      name: name || "-",
      business: business || "-",
      phone: phone || "-",
      service: service || "-",
      message: message || "-",
    };

    // Send to Formspree
    fetch("https://formspree.io/f/xqeekjap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert(t('contact.form.successMessage'));
          e.currentTarget.reset();
          return; // Exit promise chain on success
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Form submission failed');
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(t('contact.form.errorMessage'));
      });
  }

  return (
    <section id="contact" className="py-20">
      <Container>
        <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-700">{t('contact.sectionLabel')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {t('contact.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600">
            {t('contact.description')}
          </p>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-semibold text-zinc-950">{t('contact.form.title')}</p>
            <p className="mt-2 text-sm text-zinc-600">
              {t('contact.form.description')}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">
                    {t('contact.form.nameLabel')}
                  </label>
                  <input
                    name="name"
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700">
                    {t('contact.form.businessLabel')}
                  </label>
                  <input
                    name="business"
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder={t('contact.form.businessPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">
                    {t('contact.form.phoneLabel')}
                  </label>
                  <input
                    name="phone"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700">
                    {t('contact.form.serviceLabel')}
                  </label>
                  <select
                    name="service"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    defaultValue="Website + AI Chatbot"
                  >
                    <option>{t('contact.form.serviceOptions.websiteOnly')}</option>
                    <option>{t('contact.form.serviceOptions.websiteChatbot')}</option>
                    <option>{t('contact.form.serviceOptions.chatbotOnly')}</option>
                    <option>{t('contact.form.serviceOptions.websiteVoice')}</option>
                    <option>{t('contact.form.serviceOptions.websiteBoth')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  {t('contact.form.messageLabel')}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
  type="submit"
  className="cta-emoji inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
>
  {t('contact.form.submitButton')}
</button>


                <p className="text-xs text-zinc-500">
                  {t('contact.form.consentText')}
                </p>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href="https://www.facebook.com/profile.php?id=61586065058744"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {t('contact.form.facebookButton')}
              </a>
              <a
                href="mailto:dalatech.team@gmail.com"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {t('contact.form.emailButton')}
              </a>
            </div>
          </div>

          {/* What happens next */}
          <div className="space-y-6">
            <ContactCard
              title={t('contact.steps.step1.title')}
              desc={t('contact.steps.step1.description')}
            />
            <ContactCard
              title={t('contact.steps.step2.title')}
              desc={t('contact.steps.step2.description')}
            />
            <ContactCard
              title={t('contact.steps.step3.title')}
              desc={t('contact.steps.step3.description')}
            />

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-semibold text-zinc-950">{t('contact.responseTime.title')}</p>
              <p className="mt-2 text-sm text-zinc-600">
                {t('contact.responseTime.description')}
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}

function SectionPlaceholder({ id, title, hint }) {
  return (
    <section id={id} className="py-20">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
          {hint ? <p className="mt-2 text-zinc-600">{hint}</p> : null}
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-500">
          {title} section placeholder
        </div>
      </Container>
    </section>
  );
}

function Chatbot() {
  React.useEffect(() => {
    const container = document.getElementById('dalatech-chatbot-container');
    const btn = document.getElementById('dalatech-chat-toggle');

    if (!container || !btn) {
      return;
    }

    const handleToggle = () => {
      const isHidden = container.style.display === 'none' || container.style.display === '';
      container.style.display = isHidden ? 'block' : 'none';
      btn.style.transform = isHidden ? 'scale(1.1) rotate(45deg)' : 'scale(1) rotate(0deg)';
    };

    btn.addEventListener('click', handleToggle);

    return () => {
      btn.removeEventListener('click', handleToggle);
    };
  }, []);

  return (
    <>
      <button id="dalatech-chat-toggle" aria-label="Open chat"
        style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999, width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #2B2B2B 0%, #1F1F1F 100%)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0}}>
        <img src="/Photos/dalatech-logo.png" alt="DalaTech Chat" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </button>
      <div id="dalatech-chatbot-container"
        style={{display: 'none', position: 'fixed', bottom: '90px', right: '20px', width: '400px', height: '600px', maxHeight: '80vh', background: '#1F1F1F', borderRadius: '16px', boxShadow: '0 5px 40px rgba(0,0,0,0.5)', zIndex: 99999, overflow: 'hidden', border: '1px solid #333'}}>
        <iframe src="https://dalatech-chatbot.vercel.app"
                width="100%" height="100%" frameBorder="0"
                style={{borderRadius: '16px'}}
                title="DalaTech.ai Chatbot"></iframe>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600">
            © {new Date().getFullYear()} DalaTech. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm text-zinc-600">
            <a className="hover:text-zinc-950" href="#!">Privacy</a>
            <a className="hover:text-zinc-950" href="#!">Terms</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function App() {
  React.useEffect(() => {
  document.documentElement.style.scrollBehavior = "smooth";
  return () => {
    document.documentElement.style.scrollBehavior = "auto";
  };
}, []);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <Hero />

      <main>
        <Features />
        <HowItWorks />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
