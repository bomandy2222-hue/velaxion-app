import { Fragment, useEffect, useMemo, useRef, useState } from "react";

const mobileCss = `
  * { box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100%; overflow-x: hidden; scroll-behavior: smooth; }
  body { margin: 0; }
  video, img { max-width: 100%; }

  .velaxion-reveal {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    filter: blur(10px);
    transition:
      opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 900ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform, filter;
  }

  .velaxion-reveal.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }

  .velaxion-mega-menu {
    animation: velaxionMenuIn 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top center;
  }

  @keyframes velaxionMenuIn {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.975);
      filter: blur(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .velaxion-reveal,
    .velaxion-mega-menu {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }

  @media (min-width: 1025px) {
    body { background: #dfe6ef; }
    input, textarea { font-size: 15px !important; }
  }

  @media (max-width: 760px) {
    input, textarea { font-size: 16px !important; }

    .velaxion-reveal {
      transform: translateY(22px);
      filter: blur(6px);
    }

    #root > div {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    header {
      position: sticky !important;
      top: 0 !important;
      left: auto !important;
      transform: none !important;
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0 !important;
      padding: 14px 16px !important;
      background: rgba(5, 7, 12, 0.96) !important;
      backdrop-filter: blur(16px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      border-left: none !important;
      border-right: none !important;
    }

    header > div:first-child {
      font-size: 20px !important;
      letter-spacing: 0.18em !important;
      white-space: nowrap !important;
    }

    header > div:last-child {
      display: flex !important;
      gap: 8px !important;
      overflow-x: auto !important;
      justify-content: flex-start !important;
      max-width: 58vw !important;
      padding-bottom: 2px !important;
      scrollbar-width: none !important;
    }

    header > div:last-child::-webkit-scrollbar {
      display: none !important;
    }

    header button {
      writing-mode: horizontal-tb !important;
      white-space: nowrap !important;
      flex: 0 0 auto !important;
      font-size: 12px !important;
      padding: 8px 10px !important;
      border-radius: 999px !important;
      line-height: 1.1 !important;
    }

    section:first-of-type {
      padding: 0 !important;
      min-height: auto !important;
      background: #05070d !important;
    }

    section:first-of-type > div {
      display: block !important;
      height: auto !important;
      min-height: 0 !important;
      padding: 0 !important;
    }

    section:first-of-type > div > div {
      position: relative !important;
      height: auto !important;
      min-height: 0 !important;
      aspect-ratio: auto !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: #05070d !important;
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
    }

    section:first-of-type video {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      height: 58vw !important;
      max-height: 300px !important;
      min-height: 210px !important;
      object-fit: cover !important;
      opacity: 0.95 !important;
      inset: auto !important;
    }

    section:first-of-type > div > div > div:last-child {
      position: relative !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      top: auto !important;
      padding: 26px 22px 38px !important;
      display: block !important;
      background: #05070d !important;
      color: #fff !important;
      overflow: visible !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    }

    section:first-of-type h2 {
      display: block !important;
      font-size: clamp(28px, 8.4vw, 40px) !important;
      line-height: 1.12 !important;
      letter-spacing: -0.055em !important;
      margin: 10px 0 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow: visible !important;
      word-break: keep-all !important;
    }

    section:first-of-type p {
      display: block !important;
      font-size: 17px !important;
      line-height: 1.72 !important;
      margin: 18px 0 0 !important;
      color: rgba(255,255,255,0.82) !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow: visible !important;
      word-break: keep-all !important;
    }

    section:first-of-type > div > div > div:last-child > div:first-child {
      font-size: 15px !important;
      letter-spacing: 0.08em !important;
      opacity: 0.7 !important;
      margin-bottom: 0 !important;
    }

    section#community {
      margin-top: 0 !important;
      padding-top: 42px !important;
      background: linear-gradient(180deg, #05070d 0%, #141a22 4%, #dfe8f2 24%, #e8eef6 100%) !important;
    }

    section#community h2 {
      font-size: clamp(32px, 9vw, 44px) !important;
      line-height: 1.08 !important;
    }

    section#community p {
      font-size: 16px !important;
      line-height: 1.78 !important;
    }

    section, main, article, div {
      max-width: 100% !important;
    }

    div[style*="grid-template-columns"],
    section > div,
    main > section,
    main > section > div {
      grid-template-columns: 1fr !important;
    }

    section {
      min-height: auto !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    button { max-width: 100% !important; }

    h1 {
      font-size: clamp(30px, 10vw, 44px) !important;
      line-height: 1.08 !important;
      letter-spacing: -0.05em !important;
    }

    h2 {
      font-size: clamp(28px, 8vw, 40px) !important;
      line-height: 1.12 !important;
    }

    p { word-break: keep-all; }

    textarea { min-height: 96px; }
  }

  @media (max-width: 420px) {
    header > div:first-child { font-size: 18px !important; }
    header > div:last-child { max-width: 54vw !important; }
    header button {
      font-size: 11px !important;
      padding: 7px 9px !important;
    }

    section:first-of-type video {
      height: 62vw !important;
      min-height: 190px !important;
    }

    section:first-of-type > div > div > div:last-child {
      padding: 24px 20px 34px !important;
    }

    section:first-of-type h2 {
      font-size: clamp(27px, 8vw, 37px) !important;
    }

    section:first-of-type p {
      font-size: 16px !important;
    }
  }
`;

const COMMUNITY_VIDEO_URL = "/videos/community.mp4";

function Reveal({ children, delay = 0, style = {}, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`velaxion-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}





function DetailPage({ type, onBack, onStart }) {
  const detailMap = {
    reviews: {
      eyebrow: "CUSTOMER VOICE",
      title: "실제 사용자들의 변화",
      subtitle: "벨락시온을 먼저 체험한 사람들이 어디서 행동하게 됐는지 더 자세히 보여줍니다.",
      hero: "후기 상세 이미지 / 영상 영역",
      cards: [
        { title: "처음으로 3일을 넘겼어요", desc: "사진 인증이 있으니까 미루기 어려웠고, 완료했다는 느낌이 확실했습니다." },
        { title: "하루 1개라 부담이 적었어요", desc: "복잡한 계획보다 오늘 해야 할 하나에 집중할 수 있었습니다." },
        { title: "기록이 아니라 행동이 됐어요", desc: "체크를 누르기 위해 실제로 움직이게 되는 구조가 좋았습니다." },
      ],
    },
    principle: {
      eyebrow: "FUTURE PLAN",
      title: "미래는 실행으로 완성됩니다",
      subtitle: "생각이 아닌 행동으로 실제 변화를 만듭니다.",
      hero: "앞으로의 계획 영상 영역",
      cards: [
        { title: "AI로 방향을 잡습니다", desc: "막연한 고민을 선명한 다음 행동으로 바꿉니다." },
        { title: "실행을 설계합니다", desc: "하루 하나의 행동이 쌓이도록 만듭니다." },
        { title: "변화를 증명합니다", desc: "사진과 기록으로 성장의 흔적을 남깁니다." },
      ],
    },
    intro: {
      eyebrow: "VELAXION VISION",
      title: "함께 실천하고 경험하고 이끌어나갑니다",
      subtitle: "",
      hero: "VELAXION INTRO",
      cards: [
        { title: "상상이 현실로", desc: "VELAXION은 AI를 통해 더욱더 정교하고 체계적인 넓은 정보를 바탕으로 매번 상상하고 생각만 하던 꿈을 행동으로 실행시켜 조금씩 성장시켜줍니다." },
        { title: "함께 노력하면서 경험", desc: "어떤 일들은 자신만의 힘으로는 힘들거나 부족할 수 있습니다. VELAXION에서는 타인과 같이 노력하고 경험하면 혼자로선 깨달을 수 없는 값진 경험을 하게 됩니다." },
        { title: "서로가 서로를 돕는", desc: "먼저 도움을 줍니다. 그러면 반드시 당신이 어렵고 힘들 때 도움은 꼭 돌아옵니다. 언제든지 VELAXION에서 도울 수 있습니다." },
        { title: "이끄는 힘", desc: "계속 나아가다 보면 힘들고 지치고 눈앞에 거대한 벽이 있는 것처럼 느껴집니다. VELAXION에서는 당신을 아무 대가 없이 돕는 이들과, 넓은 정보와 행동을 실현해주는 당신의 의지와 생각인 AI가 함께합니다. 당신은 그저 VELAXION과 같이 나아가면 됩니다." },
      ],
    },
  };

  const page = detailMap[type] || detailMap.intro;

  const mediaSections = {
    intro: [
      {
        label: "01 · 상상이 현실로",
        title: "상상이 현실로",
        text: "VELAXION은 AI를 통해 더욱더 정교하고 체계적인 넓은 정보를 바탕으로 매번 상상하고 생각만 하던 꿈을 행동으로 실행시켜 조금씩 성장시켜줍니다.",
        media: "/videos/intro1.mp4",
        poster: "/videos/intro1.jpg",
      },
      {
        label: "02 · 함께 노력하면서 경험",
        title: "함께 노력하면서 경험",
        text: "어떤 일들은 자신만의 힘으로는 힘들거나 부족할 수 있습니다. VELAXION에서는 타인과 같이 노력하고 경험하면 혼자로선 깨달을 수 없는 값진 경험을 하게 됩니다.",
        media: "/videos/intro2.mp4",
        poster: "/videos/intro2.jpg",
      },
      {
        label: "03 · 서로가 서로를 돕는",
        title: "서로가 서로를 돕는",
        text: "먼저 도움을 줍니다. 그러면 반드시 당신이 어렵고 힘들 때 도움은 꼭 돌아옵니다. 언제든지 VELAXION에서 도울 수 있습니다.",
        media: "/videos/intro3.mp4",
        poster: "/videos/intro3.jpg",
      },
      {
        label: "04 · 이끄는 힘",
        title: "이끄는 힘",
        text: "계속 나아가다 보면 힘들고 지치고 눈앞에 거대한 벽이 있는 것처럼 느껴집니다. VELAXION에서는 당신을 아무 대가 없이 돕는 이들과, 넓은 정보와 행동을 실현해주는 당신의 의지와 생각인 AI가 함께합니다. 당신은 그저 VELAXION과 같이 나아가면 됩니다.",
        media: "/videos/intro4.mp4",
        poster: "/videos/intro4.jpg",
      },
    ],
    principle: [
      {
        label: "01",
        title: "미래는 실행입니다",
        text: "미래는 누군가 정해주는 것이 아니라, 지금 당신이 움직이는 방향으로 만들어집니다. 수많은 생각과 불안도 결국 행동이 없으면 현실이 되지 못합니다. VELAXION은 막연한 꿈을 오늘 당장 실행 가능한 행동으로 바꿔줍니다. 작은 시작 하나가 쌓여, 결국 당신만의 미래를 현실로 증명하게 됩니다.",
        media: "/videos/future1.mp4",
        poster: "/videos/future1.jpg",
      },
      {
        label: "02",
        title: "하루 하나면 충분합니다",
        text: "거대한 목표를 한 번에 이루려 하면 쉽게 지치고 멈추게 됩니다. 하지만 하루에 단 하나의 행동만 실천해도 사람은 분명히 변하기 시작합니다. VELAXION은 부담스러운 완벽함보다, 꾸준히 이어지는 작은 행동을 더 중요하게 생각합니다. 오늘의 작은 1걸음이 내일의 큰 변화가 됩니다.",
        media: "/videos/future2.mp4",
        poster: "/videos/future2.jpg",
      },
      {
        label: "03",
        title: "변화는 증명됩니다",
        text: "진짜 변화는 말이 아니라 반복된 행동에서 만들어집니다. 생각만 했던 시간은 사라지지만, 직접 행동한 기록은 남게 됩니다. VELAXION은 당신의 실행과 성장 과정을 직접 확인하고 증명할 수 있도록 함께합니다. 계속 쌓인 행동은 결국 스스로도 놀랄 만큼 큰 변화를 만들어냅니다.",
        media: "/videos/future3.mp4",
        poster: "/videos/future3.jpg",
      },
    ],
    reviews: [
      { label: "01 · 사용자 변화", title: "처음으로 며칠을 이어간 경험", text: "사용자들은 사진 인증과 하루 1개 구조 때문에 행동을 미루기 어려웠다고 말합니다.", media: "/videos/review1.mp4", poster: "/videos/review1.jpg" },
      { label: "02 · 실제 기록", title: "행동이 남으니 변화가 보입니다", text: "완료한 행동이 시각적으로 남기 때문에 자신이 무엇을 해냈는지 분명히 확인할 수 있습니다.", media: "/videos/review2.mp4", poster: "/videos/review2.jpg" },
      { label: "03 · 지속", title: "작은 실행이 습관으로 이어집니다", text: "처음에는 하나의 행동이지만, 반복되면 일상의 패턴으로 바뀝니다.", media: "/videos/review3.mp4", poster: "/videos/review3.jpg" },
    ],
  };

  const currentMediaSections = mediaSections[type] || mediaSections.intro;

  const reviewStories = [
    {
      image: "/reviews/review1.jpg",
      title: "사진 인증 때문에 처음으로 실행이 이어졌어요",
      text: "생각만 하던 목표가 매일 하나의 행동으로 바뀌었습니다. 체크하기 전에 사진을 남겨야 해서 스스로에게 더 솔직해졌습니다.",
      meta: "체험 사용자 A · 2026년 4월",
    },
    {
      image: "/reviews/review2.jpg",
      title: "하루 1개라서 부담 없이 시작할 수 있었어요",
      text: "해야 할 일이 너무 많으면 포기했는데, 벨락시온은 오늘 할 일 하나에 집중하게 만들어줘서 끝까지 해볼 수 있었습니다.",
      meta: "체험 사용자 B · 2026년 4월",
    },
    {
      image: "/reviews/review3.jpg",
      title: "기록이 쌓이니까 변화가 보이기 시작했어요",
      text: "단순히 글로 적는 게 아니라 사진으로 남기니까 내가 실제로 움직였다는 게 눈에 보였습니다.",
      meta: "체험 사용자 C · 2026년 4월",
    },
    {
      image: "/reviews/review4.jpg",
      title: "혼자였다면 멈췄을 행동을 계속하게 됐습니다",
      text: "사진을 남기는 과정이 귀찮을 줄 알았는데, 오히려 행동을 끝내는 확실한 기준이 되어줬습니다.",
      meta: "체험 사용자 D · 2026년 4월",
    },
  ];

  if (type === "reviews") {
    return (
      <div style={landingStyles.reviewDetailPage}>
        <style>{mobileCss}</style>
        <header style={landingStyles.detailNav}>
          <button style={landingStyles.detailBackButton} onClick={onBack}>← 홈으로</button>
          <div style={landingStyles.brandDark}>VELAXION</div>
          <button style={landingStyles.detailStartButton} onClick={onStart}>노아 시작하기</button>
        </header>

        <main style={landingStyles.reviewDetailMain}>
          <section style={landingStyles.reviewDetailHeader}>
            <p style={landingStyles.detailEyebrow}>CUSTOMER STORIES</p>
            <h1 style={landingStyles.reviewDetailTitle}>고객 경험담</h1>
          </section>

          <section style={landingStyles.reviewStoryGrid}>
            {reviewStories.map((story) => (
              <article key={story.title} style={landingStyles.reviewStoryCard}>
                <div style={landingStyles.reviewStoryImageWrap}>
                  <img src={story.image} alt={story.title} style={landingStyles.reviewStoryImage} />
                  <div style={landingStyles.reviewStoryImageFallback}>후기 사진 영역</div>
                </div>
                <h2 style={landingStyles.reviewStoryTitle}>{story.title}</h2>
                <p style={landingStyles.reviewStoryMeta}>{story.meta}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div style={landingStyles.detailPage}>
      <style>{mobileCss}</style>
      <header style={landingStyles.detailNav}>
        <button style={landingStyles.detailBackButton} onClick={onBack}>← 홈으로</button>
        <div style={landingStyles.brandDark}>VELAXION</div>
        <button style={landingStyles.detailStartButton} onClick={onStart}>노아 시작하기</button>
      </header>

      <main style={landingStyles.detailMain}>
        <section style={type === "intro" ? landingStyles.detailHeroIntroOnly : landingStyles.detailHero}>
          <div>
            <p style={landingStyles.detailEyebrow}>{page.eyebrow}</p>
            <h1 style={type === "intro" ? landingStyles.detailTitleIntroOnly : landingStyles.detailTitle}>{page.title}</h1>
            {page.subtitle ? <p style={landingStyles.detailSubtitle}>{page.subtitle}</p> : null}
          </div>
          {type !== "intro" ? (
            <div style={landingStyles.detailVideoHero}>
              <video
                style={landingStyles.detailVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={`/videos/${type || "intro"}-hero.jpg`}
              >
                <source src={`/videos/${type || "intro"}-hero.mp4`} type="video/mp4" />
              </video>
              <div style={landingStyles.detailVideoOverlay} />
              <div style={landingStyles.detailVideoText}>{page.hero}</div>
            </div>
          ) : null}
        </section>


        {type === "intro" ? (
          <section style={landingStyles.introVideoBelowSection}>
            <div style={landingStyles.introVideoBelowHero}>
              <video
                style={landingStyles.detailVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/videos/intro-hero.jpg"
              >
                <source src="/videos/intro-hero.mp4" type="video/mp4" />
              </video>
              <div style={landingStyles.detailVideoOverlay} />
              <div style={landingStyles.detailVideoText}>{page.hero}</div>
            </div>
          </section>
        ) : null}

            <section style={landingStyles.detailStoryWrap}>
              {currentMediaSections.map((item, index) => (
                <Reveal key={item.title} delay={index * 90}>
                <div
                  style={{
                    ...(type === "principle"
                      ? landingStyles.futureStorySection
                      : landingStyles.detailStorySection),
                    ...(type !== "principle" && index % 2 === 1 ? landingStyles.detailStoryReverse : null),
                  }}
                >
                  <div style={type === "principle" ? landingStyles.futureStoryTextBox : landingStyles.detailStoryTextBox}>
                    <p style={type === "principle" ? landingStyles.futureStoryLabel : landingStyles.detailStoryLabel}>{item.label}</p>
                    <h2 style={type === "principle" ? landingStyles.futureStoryTitle : landingStyles.detailStoryTitle}>{item.title}</h2>
                    <p style={type === "principle" ? landingStyles.futureStoryText : landingStyles.detailStoryText}>{item.text}</p>
                  </div>
                  <div style={type === "principle" ? landingStyles.futureStoryMedia : landingStyles.detailStoryMedia}>
                    <video
                      style={landingStyles.detailStoryVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={item.poster}
                    >
                      <source src={item.media} type="video/mp4" />
                    </video>
                    <div style={landingStyles.detailStoryFallback}>영상 / 사진 영역</div>
                  </div>
                </div>
                </Reveal>
              ))}
            </section>
      </main>
    </div>
  );
}

function LandingPage({ onStart, onCommunity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailPage, setDetailPage] = useState(null);
  const menuCloseTimerRef = useRef(null);

  const openMegaMenu = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setMenuOpen(true);
  };

  const closeMegaMenuSoon = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
    }
    menuCloseTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      menuCloseTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
      }
    };
  }, []);

  if (detailPage) {
    return (
      <DetailPage
        type={detailPage}
        onBack={() => setDetailPage(null)}
        onStart={onStart}
      />
    );
  }

  const openDetail = (type) => {
    setMenuOpen(false);
    setDetailPage(type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resultVideos = [
    {
      number: "01",
      title: "목표를 정합니다",
      caption: "생각을 화면 밖으로 꺼내는 첫 장면",
      src: "/videos/result1.mp4",
      poster: "/videos/result1.jpg",
    },
    {
      number: "02",
      title: "하루 하나씩 실행합니다",
      caption: "복잡한 계획보다 오늘의 행동 하나",
      src: "/videos/result2.mp4",
      poster: "/videos/result2.jpg",
    },
    {
      number: "03",
      title: "사진으로 증명합니다",
      caption: "말이 아니라 실제 행동의 증거",
      src: "/videos/result3.mp4",
      poster: "/videos/result3.jpg",
    },
    {
      number: "04",
      title: "기록이 쌓입니다",
      caption: "변화가 눈에 보이기 시작합니다",
      src: "/videos/result4.mp4",
      poster: "/videos/result4.jpg",
    },
    {
      number: "05",
      title: "습관이 일상이 됩니다",
      caption: "어제의 내가 오늘을 밀어줍니다",
      src: "/videos/result5.mp4",
      poster: "/videos/result5.jpg",
    },
    {
      number: "06",
      title: "결과가 남습니다",
      caption: "처음과 다른 나를 확인합니다",
      src: "/videos/result6.mp4",
      poster: "/videos/result6.jpg",
    },
  ];

  const testimonials = [
    {
      quote: "사진 인증이 있으니까 미룰 수가 없었어요. 처음으로 3일을 넘겼습니다.",
      name: "체험 사용자 A",
    },
    {
      quote: "해야 할 일이 하루 1개라서 부담이 적었고, 완료했다는 느낌이 확실했어요.",
      name: "체험 사용자 B",
    },
    {
      quote: "기록만 하는 앱이 아니라 실제로 움직이게 만드는 느낌이었습니다.",
      name: "체험 사용자 C",
    },
  ];

  return (
    <div style={landingStyles.page}>
      <style>{mobileCss}</style>
      <header style={landingStyles.nav} onMouseLeave={closeMegaMenuSoon}>
        <div style={landingStyles.brand}>VELAXION</div>
        <div style={landingStyles.navLinks}>
          <button
            type="button"
            style={landingStyles.navTextButton}
            onMouseEnter={openMegaMenu}
            onFocus={openMegaMenu}
            onClick={openMegaMenu}
          >
            살펴보기
          </button>
          <button type="button" style={landingStyles.navTextButton} onClick={onCommunity}>
            커뮤니티
          </button>
          <button type="button" style={landingStyles.navTextButton} onClick={() => openDetail("reviews")}>
            후기
          </button>
          <button type="button" style={landingStyles.navTextButton} onClick={() => openDetail("intro")}>
            소개
          </button>
          <button style={landingStyles.navButton} onClick={onStart}>
            노아 시작하기
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="velaxion-mega-menu"
          style={landingStyles.megaMenu}
          onMouseEnter={openMegaMenu}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <div style={landingStyles.megaMenuInner}>
            <div style={landingStyles.megaColumn}>
              <p style={landingStyles.megaTitle}>회사</p>
              <button style={landingStyles.megaItem} onClick={() => openDetail("intro")}>소개</button>
              <button style={landingStyles.megaItem} onClick={() => openDetail("principle")}>앞으로의 계획</button>
            </div>
            <div style={landingStyles.megaColumn}>
              <p style={landingStyles.megaTitle}>고객 리소스</p>
              <button style={landingStyles.megaItem} onClick={onCommunity}>경험 공유 채팅방</button>
              <button style={landingStyles.megaItem} onClick={() => openDetail("reviews")}>고객 경험담</button>
              <button style={landingStyles.megaItem} onClick={onStart}>노아 시작하기</button>
            </div>
          </div>
        </div>
      ) : null}

      <Reveal>
        <section style={landingStyles.videoWallSection}>
        <div style={landingStyles.videoWallGrid}>
          {resultVideos.map((item) => (
            <div key={item.number} style={landingStyles.videoPanel}>
              <video
                style={landingStyles.panelVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={item.poster}
              >
                <source src={item.src} type="video/mp4" />
              </video>
              <div style={landingStyles.panelFallback} />
              <div style={landingStyles.panelOverlay} />
              <div style={landingStyles.panelText}>
                <div style={landingStyles.panelNumber}>{item.number}</div>
                <h2 style={landingStyles.panelTitle}>{item.title}</h2>
                <p style={landingStyles.panelCaption}>{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>


      <Reveal>
      <section id="community" style={landingStyles.communityIntroSection}>
        <div style={landingStyles.communityIntroInner}>
          <div style={landingStyles.communityIntroTextBox}>
            <p style={landingStyles.kickerDark}>VELAXION COMMUNITY</p>
            <h2 style={landingStyles.communityIntroTitle}>
              함께 성장하는
              <br />
              경험 공유 채팅방
            </h2>
            <p style={landingStyles.communityIntroText}>
              같은 목표를 가진 사람들이 모여 서로의 경험을 나누고,
              조언하고, 함께 성장하는 공간입니다.
            </p>

            <div style={landingStyles.communityIntroList}>
              <div style={landingStyles.communityIntroListItem}>
                <span style={landingStyles.communityIntroIcon}>✦</span>
                <div>
                  <strong>경험을 나누고 동기부여를 받아요</strong>
                  <p style={landingStyles.communityIntroListText}>나의 경험이 누군가에게 큰 도움이 됩니다.</p>
                </div>
              </div>
              <div style={landingStyles.communityIntroListItem}>
                <span style={landingStyles.communityIntroIcon}>☑</span>
                <div>
                  <strong>사진과 메시지로 소통해요</strong>
                  <p style={landingStyles.communityIntroListText}>일상 속 실천을 사진으로 공유하고 응원받아요.</p>
                </div>
              </div>
              <div style={landingStyles.communityIntroListItem}>
                <span style={landingStyles.communityIntroIcon}>↗</span>
                <div>
                  <strong>서로에게 조언하고 도움을 줘요</strong>
                  <p style={landingStyles.communityIntroListText}>다양한 사람들의 인사이트가 나의 변화를 이끌어요.</p>
                </div>
              </div>
              <div style={landingStyles.communityIntroListItem}>
                <span style={landingStyles.communityIntroIcon}>∞</span>
                <div>
                  <strong>함께 성장하며 더 멀리 나아가요</strong>
                  <p style={landingStyles.communityIntroListText}>혼자가 아닌 연결 속에서 끝까지 해낼 수 있습니다.</p>
                </div>
              </div>
            </div>

            <button style={landingStyles.communityIntroButton} onClick={onCommunity}>
              채팅방 바로가기 →
            </button>
          </div>

          <div style={landingStyles.communityIntroMediaBox}>
            <video
              style={landingStyles.communityIntroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={COMMUNITY_VIDEO_URL} type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </video>
            <div style={landingStyles.communityIntroVideoFallback} />
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section id="reviews" style={landingStyles.reviewSection}>
        <div style={landingStyles.sectionInner}>
          <div style={landingStyles.sectionTopRow}>
            <div>
              <p style={landingStyles.kickerDark}>Customer Voice</p>
              <h2 style={landingStyles.sectionTitle}>실제 사용자들의 변화</h2>
            </div>
            <button type="button" style={landingStyles.moreLinkButton} onClick={() => openDetail("reviews")}>더 알아보기 →</button>
          </div>

          <div style={landingStyles.reviewGrid}>
            {testimonials.map((item) => (
              <div key={item.name} style={landingStyles.reviewCard}>
                <div style={landingStyles.reviewImageArea}>
                  <span style={landingStyles.reviewImageText}>후기 사진 영역</span>
                </div>
                <p style={landingStyles.reviewQuote}>“{item.quote}”</p>
                <p style={landingStyles.reviewName}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section id="intro" style={landingStyles.introSection}>
        <div style={landingStyles.introOverlay} />
        <div style={landingStyles.introContent}>
          <p style={landingStyles.kicker}>VELAXION SYSTEM</p>
          <h2 style={landingStyles.introTitle}>
            AI와 함께 미래를 그려나가고
            <br />
            행동까지 실행시켜줍니다
          </h2>
          <p style={landingStyles.introText}>
            고민과 목표를 입력하면 AI가 현재 상태를 분석하고, 실행 가능한 행동 계획을 만듭니다.
            사용자는 매일 사진으로 행동을 증명하고 자신의 변화를 확인합니다.
          </p>

          <div style={landingStyles.featureGrid}>
            <div style={landingStyles.featureCard}>
              <strong>01</strong>
              <span>AI 분석</span>
            </div>
            <div style={landingStyles.featureCard}>
              <strong>02</strong>
              <span>실행 계획</span>
            </div>
            <div style={landingStyles.featureCard}>
              <strong>03</strong>
              <span>사진 인증</span>
            </div>
          </div>

          <button style={landingStyles.introButton} onClick={onStart}>
            노아 시작하기
          </button>
        </div>
      </section>
      </Reveal>
    </div>
  );
}





export default function App() {
  const [page, setPage] = useState("home");

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openNoah = () => {
    setPage("noah");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (page === "noah") {
    return <NoahApp onBack={goHome} />;
  }

  return <LandingPage onStart={openNoah} onCommunity={() => setPage("home")} />;
}

const emotionOptions = [
  { id: "calm", emoji: "🙂", label: "괜찮음", mode: "기본 그대로" },
  { id: "fire", emoji: "🔥", label: "의욕 넘침", mode: "조금 더 도전" },
  { id: "anxious", emoji: "😰", label: "불안함", mode: "부담 줄이기" },
  { id: "tired", emoji: "😴", label: "지침", mode: "최소 실행" },
  { id: "stress", emoji: "😵", label: "스트레스", mode: "하나만 실행" },
  { id: "blur", emoji: "😶", label: "집중 안됨", mode: "시작만 하기" },
];

const firstNoahMessage = {
  role: "noah",
  text: "안녕. 만나서 반가워 🌙\n먼저 네 이름이 뭐야?",
};

function makeNoahMessage(text) {
  return { role: "noah", text };
}

function makeUserMessage(text) {
  return { role: "user", text };
}

function getEmotionById(id) {
  return emotionOptions.find((item) => item.id === id) || emotionOptions[0];
}

function getId(prefix = "plan") {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTime(raw, previousHour = null) {
  const text = String(raw || "").replace(/\s/g, "");
  let hour = 20;
  let minute = 0;
  const isPm = /오후|저녁|밤/.test(text);
  const isAm = /오전|아침|새벽/.test(text);
  const match = text.match(/(\d{1,2})(?:[:시](\d{1,2})?)?/);
  if (match) {
    hour = Number(match[1]);
    minute = match[2] ? Number(match[2]) : 0;
  }
  if (isPm && hour < 12) hour += 12;
  if (!isAm && !isPm && previousHour !== null && previousHour >= 8 && hour > 0 && hour <= 11 && hour < previousHour) {
    hour += 12;
  }
  hour = Math.max(0, Math.min(23, Number.isFinite(hour) ? hour : 20));
  minute = Math.max(0, Math.min(59, Number.isFinite(minute) ? minute : 0));
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function timeToMinutes(time) {
  const [h, m] = String(time || "20:00").split(":").map(Number);
  return (Number.isFinite(h) ? h : 20) * 60 + (Number.isFinite(m) ? m : 0);
}

function minutesToTime(total) {
  const fixed = Math.max(0, Math.min(23 * 60 + 59, total));
  const h = Math.floor(fixed / 60);
  const m = fixed % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addMinutes(time, minutes) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

function formatTimeKorean(time) {
  const [rawHour, rawMinute] = String(time || "20:00").split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 20;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  if (minute === 0) return `${period} ${displayHour}시`;
  return `${period} ${displayHour}시 ${minute}분`;
}

function extractName(raw) {
  let text = String(raw || "").trim();
  text = text
    .replace(/^(내\s*)?이름(은|는)?\s*/g, "")
    .replace(/^(나는|난|저는|전|제가|제)\s*/g, "")
    .replace(/(이야|야|입니다|이에요|예요|라고\s*해|라고\s*합니다|라고\s*불러줘|라고\s*부르면\s*돼|이라고\s*해|이라\s*해)$/g, "")
    .replace(/[.!?。]/g, "")
    .trim();
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    const likely = parts.find((part) => /^[가-힣]{2,4}$/.test(part));
    if (likely) return likely;
  }
  return text || "너";
}

function extractTimeRanges(raw) {
  const text = String(raw || "");
  const ranges = [];
  const pattern = /(오전|오후|아침|저녁|밤|새벽)?\s*(\d{1,2})\s*(?:[:시]\s*(\d{1,2})?)?\s*(?:분)?\s*(?:부터|~|-|에서)\s*(오전|오후|아침|저녁|밤|새벽)?\s*(\d{1,2})\s*(?:[:시]\s*(\d{1,2})?)?/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const startPeriod = match[1] || "";
    const endPeriod = match[4] || startPeriod;
    const start = normalizeTime(`${startPeriod}${match[2]}시${match[3] || ""}`);
    let end = normalizeTime(`${endPeriod}${match[5]}시${match[6] || ""}`, Number(start.slice(0, 2)));
    if (timeToMinutes(end) <= timeToMinutes(start)) end = addMinutes(end, 12 * 60);
    if (timeToMinutes(end) > timeToMinutes(start)) ranges.push({ start, end });
  }

  if (!ranges.length) {
    const single = text.match(/(오전|오후|아침|저녁|밤|새벽)?\s*\d{1,2}\s*(?::|시)\s*\d{0,2}/);
    const start = single ? normalizeTime(single[0]) : "20:00";
    ranges.push({ start, end: addMinutes(start, 90) });
  }

  return ranges
    .map((range) => ({ ...range, duration: timeToMinutes(range.end) - timeToMinutes(range.start) }))
    .filter((range) => range.duration >= 10)
    .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

function makeSlotsFromRanges(ranges) {
  const slots = [];
  ranges.forEach((range) => {
    const duration = range.duration;
    let step = 35;
    if (duration <= 35) step = duration;
    else if (duration <= 90) step = 25;
    else if (duration <= 180) step = 35;
    else step = 45;

    let current = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);
    while (current < end - 5) {
      slots.push(minutesToTime(current));
      current += step;
      if (slots.length >= 10) break;
    }
  });
  return slots.length ? slots : ["20:00", "20:30", "21:00"];
}

function unlockPlan(items) {
  let opened = false;
  return items.map((item) => {
    if (item.status === "done") return item;
    if (!opened) {
      opened = true;
      return { ...item, status: "open" };
    }
    return { ...item, status: "locked" };
  });
}

function includesAny(text, words) {
  const source = String(text || "").toLowerCase();
  return words.some((word) => source.includes(word.toLowerCase()));
}

function inferFocus(profile) {
  const joined = [profile.dream, profile.why, profile.bestMoment, profile.strength, profile.dislike, profile.habit]
    .filter(Boolean)
    .join(" ");

  if (includesAny(joined, ["심리", "읽", "전략", "상대", "분석", "패턴", "생각"])) return "분석";
  if (includesAny(joined, ["빠른", "피지컬", "반응", "손", "컨트롤", "에임", "기계적"])) return "반응/정확도";
  if (includesAny(joined, ["사람", "팀", "대화", "리더", "함께", "소통", "협업"])) return "소통/협업";
  if (includesAny(joined, ["창의", "만들", "아이디어", "기획", "표현", "콘텐츠"])) return "기획/창의";
  if (includesAny(joined, ["꾸준", "오래", "반복", "성실", "루틴"])) return "꾸준함";
  return "집중";
}

function inferAvoid(profile) {
  const dislike = String(profile.dislike || "");
  if (includesAny(dislike, ["유튜브", "쇼츠", "재밌", "딴짓", "귀찮"])) return "재미만 있는 딴짓으로 새지 않게 결과물을 남기는 방식";
  if (includesAny(dislike, ["사람", "평가", "부담", "앞에서"])) return "혼자 확인하고 기록하는 방식";
  if (includesAny(dislike, ["반복", "의미 없이", "막연"])) return "이유와 결과가 보이는 방식";
  return "계속할 수 있게 작게 쪼개는 방식";
}

function makePlanItem(time, title, status = "locked") {
  return {
    id: getId("plan"),
    time,
    title,
    status,
    proofImage: "",
  };
}

function getGoalBlueprint(profile) {
  const dream = String(profile.dream || "목표");
  const joined = [profile.dream, profile.why, profile.bestMoment, profile.strength, profile.habit].join(" ");
  const focus = inferFocus(profile);
  const avoid = inferAvoid(profile);

  if (includesAny(joined, ["프로게이머", "게임", "랭크", "e스포츠", "이스포츠"])) {
    return [
      `프로 경기 1판 시청 — 내가 이기고 싶은 포지션/상황만 정해서 보기`,
      `상대 심리나 움직임이 읽힌 장면 3개 기록하기`,
      `랭크 또는 연습 1판 진행 — 방금 본 장면 1개만 직접 적용하기`,
      `내 리플레이에서 같은 상황 1개 캡처하고 실수 원인 적기`,
      `실수 1개를 고쳐서 짧은 연습 10분 반복하기`,
      `오늘 배운 플레이 원칙 1개를 내일 첫 경기 목표로 저장하기`,
    ];
  }

  if (includesAny(joined, ["건물주", "부동산", "월세", "임대", "상가", "아파트", "원룸"])) {
    return [
      `부동산 기본 구조 정리 — 매매가, 보증금, 월세, 대출이자 뜻을 내 말로 적기`,
      `관심 지역 1곳 정하기 — 왜 그 지역을 볼지 이유 2개 적기`,
      `그 지역 매물 3개 비교 — 가격, 보증금, 월세를 표로 적기`,
      `월세 수익률 계산 1번 직접 해보기 — 수익과 비용을 나눠 보기`,
      `공실/대출/세금 중 가장 위험한 것 1개를 골라 해결 방법 적기`,
      `내가 모아야 할 자본 목표와 이번 달 준비 행동 1개 정하기`,
      `오늘 분석한 매물 화면이나 계산 기록을 사진으로 인증하기`,
    ];
  }

  if (includesAny(joined, ["사업", "창업", "브랜드", "서비스", "앱", "스타트업", "회사"])) {
    return [
      `내가 해결하고 싶은 고객 문제 1개를 한 문장으로 쓰기`,
      `그 문제를 겪는 사람 3명을 구체적으로 적기`,
      `경쟁 서비스 2개 분석 — 좋은 점 1개, 부족한 점 1개씩 적기`,
      `내 서비스가 줄 수 있는 차이점 1개를 문장으로 만들기`,
      `고객에게 물어볼 질문 5개 만들기`,
      `오늘 바로 보여줄 수 있는 제안/화면/글 초안 1개 만들기`,
      `결과물을 사진으로 인증하고 내일 검증할 사람 1명 정하기`,
    ];
  }

  if (includesAny(joined, ["돈", "부자", "경제", "투자", "주식", "수익", "자산", "자유"])) {
    return [
      `내가 원하는 경제적 자유의 숫자 적기 — 월 얼마가 필요한지 계산하기`,
      `수입을 만드는 방식 3개를 적고 노동형/자산형으로 나누기`,
      `관심 투자 대상 1개를 고르고 돈이 벌리는 구조를 3줄로 설명하기`,
      `그 투자에서 잃을 수 있는 이유 3개 적기`,
      `오늘 당장 자산형 행동으로 연결되는 공부/기록 1개 하기`,
      `이번 주 현금흐름을 늘릴 작은 행동 1개 정하기`,
      `계산 또는 기록 화면을 사진으로 인증하기`,
    ];
  }

  if (includesAny(joined, ["공부", "시험", "성적", "대학", "학교", "자격증", "수능"])) {
    return [
      `가장 약한 단원 1개 고르기`,
      `최근 틀린 문제 3개를 보고 틀린 이유를 유형별로 나누기`,
      `같은 유형 문제 3개 다시 풀기`,
      `틀린 이유를 한 문장으로 적고 다시 풀기`,
      `내가 자주 틀리는 패턴 1개를 내일 첫 문제 목표로 정하기`,
      `공부 흔적을 사진으로 인증하기`,
    ];
  }

  if (includesAny(joined, ["운동", "헬스", "몸", "체력", "근육", "다이어트"])) {
    return [
      `오늘 몸 상태 확인하기 — 통증/피로/가능한 강도 적기`,
      `핵심 운동 1개 고르고 정확한 자세로 워밍업 하기`,
      `본 세트 3세트 진행 — 무게보다 자세를 먼저 확인하기`,
      `힘든 부위와 호흡 정도 기록하기`,
      `다음 운동 때 올릴 것 1개만 정하기`,
      `운동 인증 사진 남기기`,
    ];
  }

  if (includesAny(joined, ["그림", "음악", "작가", "영상", "디자인", "콘텐츠", "창작", "유튜브"])) {
    return [
      `${dream}과 관련해 내가 만들고 싶은 결과물 1개 정하기`,
      `좋아하는 참고작 1개 분석 — 왜 좋은지 3줄 적기`,
      `그 구조를 따라 내 버전 초안 1개 만들기`,
      `마음에 안 드는 부분 1개만 고치기`,
      `작게 공개하거나 저장할 수 있는 형태로 정리하기`,
      `초안 사진 또는 화면을 인증하기`,
    ];
  }

  return [
    `${dream}을 이루려면 필요한 능력 3개 적기`,
    `그중 오늘 가장 먼저 키워야 할 능력 1개 고르기`,
    `${focus} 방식으로 관련 자료 1개를 보고 핵심 3줄 정리하기`,
    `${avoid}으로 오늘 실행 행동 1개 직접 하기`,
    `방금 한 행동에서 부족한 점 1개와 다음 행동 1개 적기`,
    `오늘 결과물을 사진으로 인증하기`,
  ];
}

function buildPersonalPlan(profile) {
  const ranges = extractTimeRanges(profile.time || profile.habit || "20:00부터 21:30까지");
  const slots = makeSlotsFromRanges(ranges);
  const blueprint = getGoalBlueprint(profile);
  const count = Math.max(4, Math.min(Math.max(slots.length, 4), blueprint.length));
  const items = [];

  for (let index = 0; index < count; index += 1) {
    const time = slots[index] || addMinutes(slots[slots.length - 1] || "20:00", (index - slots.length + 1) * 30);
    items.push(makePlanItem(time, blueprint[index % blueprint.length], index === 0 ? "open" : "locked"));
  }

  return unlockPlan(items);
}

function adjustItemsByEmotion(items, emotionId) {
  const emotion = getEmotionById(emotionId);
  return unlockPlan(items.map((item, index) => {
    if (item.status === "done") return item;
    const original = item.originalTitle || item.title;
    let title = original;

    if (emotion.id === "fire") {
      title = index === 0 ? `${original} + 결과물 하나 더 남기기` : original;
    }

    if (emotion.id === "anxious") {
      title = index === 0 ? `부담을 낮춰서 핵심만 하기: ${original}` : original;
    }

    if (emotion.id === "tired") {
      title = index === 0 ? `가장 쉬운 첫 단계만 하기: ${original}` : original;
    }

    if (emotion.id === "stress") {
      title = index === 0 ? `오늘은 이것 하나만 남기기: ${original}` : original;
    }

    if (emotion.id === "blur") {
      title = index === 0 ? `타이머 5분 켜고 시작하기: ${original}` : original;
    }

    return { ...item, originalTitle: original, title };
  }));
}

function NoahApp({ onBack }) {
  const [messages, setMessages] = useState([firstNoahMessage]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("name");
  const [profile, setProfile] = useState({
    name: "",
    dream: "",
    wantsIt: "",
    why: "",
    bestMoment: "",
    dislike: "",
    strength: "",
    habit: "",
    time: "",
    emotion: "",
  });
  const [planItems, setPlanItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("chat");
  const [showEmotionPanel, setShowEmotionPanel] = useState(false);
  const chatBottomRef = useRef(null);
  const chatAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const pendingProofIndexRef = useRef(null);

  const scrollChatToBottom = (smooth = true) => {
    if (activeView !== "chat") return;
    const run = () => {
      chatBottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
      if (chatAreaRef.current) chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    };
    run();
    requestAnimationFrame(run);
    setTimeout(run, 60);
    setTimeout(run, 180);
    setTimeout(run, 360);
  };

  const completedCount = planItems.filter((item) => item.status === "done").length;
  const currentOpenIndex = planItems.findIndex((item) => item.status === "open");

  useEffect(() => {
    if (activeView !== "chat") return;
    scrollChatToBottom(messages.length > 1);
  }, [messages.length, activeView, input, step]);

  const progressText = useMemo(() => {
    if (!profile.name) return "처음 만나는 중";
    if (!profile.dream) return `${profile.name}의 꿈을 찾는 중`;
    if (planItems.length === 0) return "사용자 성향 파악 중";
    return `${completedCount}/${planItems.length} 인증 완료`;
  }, [profile, planItems.length, completedCount]);

  const getSuggestedReplies = () => {
    if (step === "name") return ["내 이름부터 알려줄게", "이름은 직접 입력할게"];
    if (step === "dream") return ["프로게이머가 되고 싶어", "건물주가 되고 싶어", "사업으로 성공하고 싶어", "경제적으로 자유로워지고 싶어"];
    if (step === "why") return ["내 힘으로 결과를 만들고 싶어", "남들이 안 된다고 한 걸 증명하고 싶어", "자유롭게 살 수 있는 기반을 만들고 싶어"];
    if (step === "bestMoment") return ["상대의 생각을 읽고 이길 때 재밌어", "결과가 눈에 보일 때 좋아", "오래 파고들어서 실력이 늘 때 좋아"];
    if (step === "dislike") return ["의미 없이 반복하는 건 싫어", "너무 막연한 계획은 싫어", "재밌는 딴짓으로 새는 게 싫어"];
    if (step === "strength") return ["분석하는 걸 잘해", "한번 꽂히면 오래 파고들어", "경쟁하면 집중이 잘돼"];
    if (step === "habit") return ["저녁에 집중이 잘돼", "혼자 할 때 더 몰입돼", "누가 같이 확인해주면 더 잘해"];
    if (step === "time") return ["오전 8시부터 8시 30분까지, 오후 4시부터 10시까지 가능해", "학교 끝나고 오후 6시부터 9시까지 가능해", "하루에 30분 정도 가능해"];
    if (step === "execute") return ["오늘 계획을 다시 다듬고 싶어", "오늘은 조금 힘들어서 줄이고 싶어", "지금 계획이 나에게 맞는지 봐줘"];
    return [];
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value) return;

    const nextMessages = [...messages, makeUserMessage(value)];
    let noahReply = "";
    let nextStep = step;
    const nextProfile = { ...profile };

    if (step === "name") {
      const cleanName = extractName(value);
      nextProfile.name = cleanName;
      noahReply = `좋네, ${cleanName}.
이제 진짜 중요한 걸 물어볼게.

너는 뭘 이루고 싶어?
하고 싶은 게 뭐고, 달성하고 싶은 목표가 뭐야?
아, 꿈은?`;
      nextStep = "dream";
    } else if (step === "dream") {
      nextProfile.dream = value;
      noahReply =
        `좋아. ${nextProfile.name}, 그 꿈 기억할게.

` +
        "그 목표 혹은 꿈을 정말 이루고 싶은 거지?

" +
        "가능해. 무조건 말이야.

" +
        "내가 너를 거기에 좀 더 빠르게 데려다줄 뿐이지.
다시 한번 말해줄게.

" +
        "너는 갈 수 있어.
그 이유는 네가 이미 달라졌기 때문이야.
나를 찾아왔잖아.

" +
        "근데 바로 계획부터 짜지 않을게.
너한테 맞는 계획을 만들려면 먼저 너를 알아야 해.

" +
        "그 꿈을 왜 이루고 싶어?
진짜 이유를 편하게 말해줘.";
      nextStep = "why";
    } else if (step === "why") {
      nextProfile.why = value;
      noahReply =
        "좋아. 그 이유는 계획의 방향을 잡는 데 중요해.\n\n이번엔 조금 더 구체적으로 볼게.\n그 꿈과 관련해서 네가 가장 재밌다고 느끼는 순간은 언제야?\n잘한다는 느낌이 들거나, 시간이 빨리 가는 순간도 좋아.";
      nextStep = "bestMoment";
    } else if (step === "bestMoment") {
      nextProfile.bestMoment = value;
      noahReply =
        "좋아. 그 지점이 네 계획의 중심이 될 수 있어.\n\n반대로 싫어하는 방식도 알아야 해.\n어떤 방식으로 하면 금방 지치거나 하기 싫어져?";
      nextStep = "dislike";
    } else if (step === "dislike") {
      nextProfile.dislike = value;
      noahReply =
        "좋아. 싫어하는 방식은 계획에서 최대한 피할게.\n\n이번엔 네가 가진 쪽을 볼게.\n주변에서 잘한다고 들었거나, 네가 스스로 조금 자신 있는 건 뭐야?";
      nextStep = "strength";
    } else if (step === "strength") {
      nextProfile.strength = value;
      noahReply =
        "좋아. 그걸 직접 말로 칭찬하기보다 계획 안에 녹여볼게.\n\n평소 습관도 중요해.\n너는 언제 집중이 잘 되고, 혼자가 편해 아니면 누가 같이 확인해줄 때 더 잘해?";
      nextStep = "habit";
    } else if (step === "habit") {
      nextProfile.habit = value;
      noahReply =
        "좋아. 마지막으로 현실 시간을 맞춰보자.\n오늘 또는 평소에 이 꿈을 위해 실제로 쓸 수 있는 시간은 언제야?\n예: 20:00부터 1시간, 학교 끝나고 30분, 자기 전 40분";
      nextStep = "time";
    } else if (step === "time") {
      nextProfile.time = value;
      const personalPlan = buildPersonalPlan(nextProfile);
      setPlanItems(personalPlan);
      setActiveView("plan");
      setShowEmotionPanel(false);
      noahReply =
        "좋아. 이제 네가 말한 꿈, 좋아하는 방식, 싫어하는 방식, 집중되는 시간까지 보고 오늘 계획을 만들었어.\n\n기본 계획은 넣지 않았어.\n네가 말한 내용 안에서 바로 실행 가능한 순서로 정리했어.\n\n이제 오늘 계획 화면에서 먼저 오늘 기분을 고르고, 그 기분에 맞게 계획을 재배치한 다음 하나씩 인증하면서 가자.";
      nextStep = "execute";
    } else {
      noahReply = "좋아. 지금 대화도 계획에 반영할 수 있어. 필요하면 오늘 계획 화면에서 다시 다듬고, 지금은 열린 계획부터 하나씩 가자.";
    }

    setProfile(nextProfile);
    setMessages([...nextMessages, makeNoahMessage(noahReply)]);
    setStep(nextStep);
    setInput("");
  };

  const selectEmotion = (emotionId) => {
    const emotion = getEmotionById(emotionId);
    setProfile((prev) => ({ ...prev, emotion: emotionId }));
    setPlanItems((prev) => adjustItemsByEmotion(prev, emotionId));
    setMessages((prev) => [
      ...prev,
      makeUserMessage(`${emotion.emoji} ${emotion.label}`),
      makeNoahMessage(
        `오늘 기분은 ${emotion.emoji} ${emotion.label}이구나.\n\n좋아. 목표는 바꾸지 않고, 오늘 상태에 맞게 행동의 크기만 조정했어.\n오늘 계획 화면에서 첫 번째 계획부터 사진으로 인증하면서 가자.`
      ),
    ]);
    setShowEmotionPanel(false);
    setActiveView("plan");
    setStep("execute");
  };

  const openProofPicker = (index) => {
    if (planItems[index]?.status !== "open") return;
    pendingProofIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleProofImage = (event) => {
    const file = event.target.files?.[0];
    const index = pendingProofIndexRef.current;
    if (!file || index === null || index === undefined) return;
    const url = URL.createObjectURL(file);

    setPlanItems((prev) => {
      const next = prev.map((item, itemIndex) => {
        if (itemIndex === index) return { ...item, status: "done", proofImage: url };
        if (itemIndex === index + 1 && item.status === "locked") return { ...item, status: "open" };
        return item;
      });
      return next;
    });

    const isLast = index >= planItems.length - 1;
    setMessages((prev) => [
      ...prev,
      makeUserMessage(`오늘 계획 ${index + 1} 인증 완료`),
      makeNoahMessage(
        isLast
          ? `좋아, ${profile.name || "우리"}. 오늘 계획을 전부 증명했어.\n이건 말이 아니라 실제로 움직였다는 증거야.`
          : "좋아. 하나 인증했어.\n다음 계획이 열렸어. 오늘 계획 화면에서 이어가자."
      ),
    ]);

    pendingProofIndexRef.current = null;
    event.target.value = "";
  };

  return (
    <div className="noah-app">
      <style>{styles}</style>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="side-logo">NOAH</div>
        <button className={`side-item ${activeView === "chat" ? "active" : ""}`} onClick={() => setActiveView("chat")}>오늘 대화</button>
        <button className={`side-item ${activeView === "plan" ? "active" : ""}`} onClick={() => setActiveView("plan")}>오늘 계획</button>
        <button className={`side-item ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>설정</button>

        <div className="side-card">
          <span>현재 상태</span>
          <strong>{progressText}</strong>
        </div>

        {planItems.length > 0 ? (
          <div className="side-mini-plan">
            <div className="side-mini-head">
              <span>다음 실행</span>
              <strong>{completedCount}/{planItems.length}</strong>
            </div>
            {currentOpenIndex >= 0 ? (
              <div className="mini-current">
                <b>{formatTimeKorean(planItems[currentOpenIndex].time)}</b>
                <p>{planItems[currentOpenIndex].title}</p>
              </div>
            ) : (
              <div className="mini-current"><b>완료</b><p>오늘 계획을 모두 인증했어.</p></div>
            )}
          </div>
        ) : null}
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen((v) => !v)}>☰</button>
          <div className="brand"><span>NOAH</span><small>오늘도 같이</small></div>
          <div className="top-actions"><div className="top-pill">꿈을 행동으로</div><button className="home-btn" onClick={onBack}>홈</button></div>
        </header>

        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="stars" />

        {activeView === "plan" ? (
          <PlanView
            planItems={planItems}
            completedCount={completedCount}
            onProof={openProofPicker}
            emotionOptions={emotionOptions}
            activeEmotion={profile.emotion}
            onEmotion={selectEmotion}
          />
        ) : activeView === "settings" ? (
          <section className="page-view"><div className="view-card"><h1>설정</h1><p>노아 설정은 다음 단계에서 연결할게.</p></div></section>
        ) : (
          <section className="chat-area" ref={chatAreaRef}>
            <div className="hero-title"><p>NOAH</p><h1>조용히, 같이 걸어가는 AI</h1><span>꿈은 멀리 보되 오늘 행동은 아주 작게.</span></div>

            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message-row ${message.role}`}>
                  <div className="avatar">{message.role === "noah" ? "🌙" : "나"}</div>
                  <div className="bubble">
                    {message.role === "noah" && <div className="bubble-label">NOAH · 함께 가는 중</div>}
                    {message.text.split("\n").map((line, lineIndex) => (<Fragment key={lineIndex}>{line}<br /></Fragment>))}
                  </div>
                </div>
              ))}
            </div>

            {getSuggestedReplies().length ? (
              <div className="feedback-row">
                {getSuggestedReplies().map((reply) => (
                  <button key={reply} onClick={() => setInput(reply)}>{reply}</button>
                ))}
              </div>
            ) : null}
            <div ref={chatBottomRef} />
          </section>
        )}

        {activeView === "chat" ? (
          <footer className="composer">
            <div className="input-shell">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="노아에게 말해보세요..." rows={1} />
              <button onClick={sendMessage}>➜</button>
            </div>
          </footer>
        ) : null}

        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleProofImage} hidden />
      </main>
    </div>
  );
}

function PlanView({ planItems, completedCount, onProof, emotionOptions, activeEmotion, onEmotion }) {
  const emotion = getEmotionById(activeEmotion);

  return (
    <section className="page-view plan-view">
      <div className="view-header">
        <p>NOAH PLAN</p>
        <h1>오늘 계획</h1>
        <span>오늘 기분에 맞게 계획을 조정하고, 시간 순서대로 하나씩 인증하는 공간이야.</span>
      </div>

      {planItems.length === 0 ? (
        <div className="empty-plan"><h2>아직 오늘 계획이 없어.</h2><p>노아가 너를 먼저 알아본 뒤 여기에서 계획을 보여줄게.</p></div>
      ) : (
        <div className="plan-board">
          <div className="plan-emotion-card">
            <div>
              <h2>오늘 기분은 어때?</h2>
              <p>여기서 기분을 고르면, 목표는 그대로 두고 오늘 행동의 크기만 조정할게.</p>
            </div>
            <div className="emotion-grid">
              {emotionOptions.map((item) => (
                <button
                  key={item.id}
                  className={activeEmotion === item.id ? "selected" : ""}
                  onClick={() => onEmotion(item.id)}
                >
                  <span>{item.emoji}</span>
                  <strong>{item.label}</strong>
                  <small>{item.mode}</small>
                </button>
              ))}
            </div>
            {activeEmotion ? (
              <p className="emotion-result">
                오늘 상태: {emotion.emoji} {emotion.label} — 계획을 오늘 컨디션에 맞게 조정했어.
              </p>
            ) : null}
          </div>

          <div className="plan-progress"><span>오늘 인증</span><strong>{completedCount}/{planItems.length}</strong></div>
          {planItems.map((item, index) => (
            <article key={item.id} className={`plan-card ${item.status}`}>
              <div className="plan-time"><strong>{formatTimeKorean(item.time)}</strong><span>{item.status === "done" ? "완료" : item.status === "open" ? "진행 가능" : "잠김"}</span></div>
              <p>{item.title}</p>
              {item.proofImage ? <img src={item.proofImage} alt="인증 사진" /> : null}
              <button disabled={item.status !== "open"} onClick={() => onProof(index)}>{item.status === "done" ? "인증 완료" : item.status === "open" ? "사진 인증" : "이전 계획 인증 필요"}</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = `
* { box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; min-height: 100%; margin: 0; overflow: hidden; }
body { background: #080a14; font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
button, textarea { font-family: inherit; }
.noah-app { height: 100vh; color: rgba(255,255,255,0.92); background: radial-gradient(circle at 22% 8%, rgba(168,85,247,0.22), transparent 28%), radial-gradient(circle at 78% 10%, rgba(96,165,250,0.18), transparent 30%), linear-gradient(180deg, #080a14 0%, #0b1020 46%, #101322 100%); display: flex; overflow: hidden; position: relative; }
.sidebar { width: 290px; height: 100vh; overflow-y: auto; padding: 24px 18px; border-right: 1px solid rgba(255,255,255,0.08); background: rgba(8,10,20,0.78); backdrop-filter: blur(22px); z-index: 10; }
.side-logo { letter-spacing: 0.35em; font-size: 18px; font-weight: 900; margin: 0 0 34px 8px; }
.side-item { width: 100%; border: 0; color: rgba(255,255,255,0.72); background: transparent; text-align: left; padding: 15px 16px; border-radius: 16px; cursor: pointer; margin-bottom: 8px; font-weight: 800; }
.side-item.active, .side-item:hover { background: rgba(255,255,255,0.09); color: white; }
.side-card, .side-mini-plan { margin-top: 26px; padding: 18px; border-radius: 22px; background: linear-gradient(135deg, rgba(168,85,247,0.22), rgba(96,165,250,0.14)); border: 1px solid rgba(255,255,255,0.1); }
.side-card span, .side-mini-head span { display: block; font-size: 12px; color: rgba(255,255,255,0.58); margin-bottom: 8px; }
.side-card strong, .side-mini-head strong { font-size: 16px; }
.side-mini-plan { background: rgba(255,255,255,0.055); }
.side-mini-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.mini-current { border: 1px solid rgba(125,211,252,0.22); background: rgba(96,165,250,0.08); border-radius: 18px; padding: 14px; }
.mini-current b { display: block; margin-bottom: 8px; }
.mini-current p { margin: 0; color: rgba(255,255,255,0.76); font-size: 13px; line-height: 1.55; }
.main { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.topbar { height: 72px; flex: 0 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; z-index: 5; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(8,10,20,0.42); backdrop-filter: blur(18px); }
.icon-btn { width: 42px; height: 42px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; border-radius: 14px; cursor: pointer; }
.brand { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.brand span { letter-spacing: 0.28em; font-weight: 900; }
.brand small { color: rgba(255,255,255,0.48); font-size: 12px; }
.top-actions { display: flex; align-items: center; gap: 10px; }
.top-pill, .home-btn { padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.78); font-size: 13px; border: 1px solid rgba(255,255,255,0.09); }
.home-btn { cursor: pointer; font-weight: 800; }
.aurora { position: absolute; width: 420px; height: 420px; border-radius: 999px; filter: blur(70px); opacity: 0.42; animation: float 11s ease-in-out infinite alternate; pointer-events: none; }
.aurora-one { left: 16%; top: 8%; background: rgba(168,85,247,0.34); }
.aurora-two { right: 8%; top: 28%; background: rgba(125,211,252,0.22); animation-delay: 1.8s; }
.stars { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px); background-size: 120px 120px, 190px 190px; opacity: 0.16; pointer-events: none; }
@keyframes float { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(22px,28px,0) scale(1.08); } }
.chat-area, .page-view { flex: 1; height: calc(100vh - 72px); overflow-y: auto; padding: 44px 22px 150px; z-index: 2; }
.hero-title, .view-header { max-width: 860px; margin: 0 auto 28px; text-align: center; }
.hero-title p, .view-header p { margin: 0 0 8px; color: rgba(255,255,255,0.48); letter-spacing: 0.35em; font-size: 13px; }
.hero-title h1, .view-header h1 { margin: 0; font-size: clamp(34px,5vw,64px); letter-spacing: -0.06em; line-height: 1.05; }
.hero-title span, .view-header span { display: block; margin-top: 16px; color: rgba(255,255,255,0.58); }
.messages { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
.message-row { display: flex; gap: 12px; align-items: flex-start; }
.message-row.user { flex-direction: row-reverse; }
.avatar { flex: 0 0 auto; width: 38px; height: 38px; border-radius: 14px; display: grid; place-items: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08); font-size: 14px; }
.bubble { max-width: min(680px,78vw); padding: 18px 20px; border-radius: 24px; line-height: 1.75; color: rgba(255,255,255,0.88); }
.message-row.noah .bubble { background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(168,85,247,0.09)); border: 1px solid rgba(255,255,255,0.09); backdrop-filter: blur(18px); box-shadow: 0 24px 80px rgba(0,0,0,0.18); }
.message-row.user .bubble { background: rgba(255,255,255,0.14); }
.bubble-label { font-size: 12px; color: rgba(255,255,255,0.44); margin-bottom: 8px; }
.panel { max-width: 860px; margin: 18px auto 0; padding: 22px; border-radius: 28px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(22px); }
.panel h3 { margin: 0 0 6px; font-size: 21px; }
.panel p { margin: 0; color: rgba(255,255,255,0.58); line-height: 1.65; }
.emotion-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.emotion-grid button { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.07); color: white; border-radius: 20px; padding: 16px 12px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: transform 160ms ease, background 160ms ease; }
.emotion-grid button:hover { transform: translateY(-2px); background: rgba(255,255,255,0.11); }
.emotion-grid span { font-size: 24px; }
.emotion-grid small { color: rgba(255,255,255,0.48); }
.feedback-row { max-width: 860px; margin: 18px auto 0; display: flex; gap: 10px; flex-wrap: wrap; }
.feedback-row button { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); border-radius: 999px; padding: 11px 14px; cursor: pointer; }
.composer { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px 22px 28px; background: linear-gradient(180deg, transparent, rgba(8,10,20,0.88) 34%, rgba(8,10,20,0.98)); z-index: 6; }
.input-shell { max-width: 860px; margin: 0 auto; min-height: 62px; border-radius: 26px; padding: 10px 10px 10px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; gap: 12px; backdrop-filter: blur(22px); box-shadow: 0 24px 80px rgba(0,0,0,0.25); }
.input-shell textarea { flex: 1; resize: none; border: 0; outline: none; color: white; background: transparent; font-size: 16px; line-height: 1.45; max-height: 120px; }
.input-shell textarea::placeholder { color: rgba(255,255,255,0.42); }
.input-shell button { width: 46px; height: 46px; border: 0; border-radius: 18px; cursor: pointer; color: white; font-size: 20px; background: linear-gradient(135deg, rgba(168,85,247,0.95), rgba(96,165,250,0.9)); }
.plan-board { max-width: 980px; margin: 0 auto; display: grid; gap: 14px; }

.plan-emotion-card { padding: 24px; border-radius: 28px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(22px); }
.plan-emotion-card h2 { margin: 0 0 8px; font-size: 24px; }
.plan-emotion-card p { margin: 0; color: rgba(255,255,255,0.62); line-height: 1.65; }
.plan-emotion-card .emotion-grid { margin-top: 18px; }
.emotion-grid button.selected { border-color: rgba(96,165,250,0.75); background: rgba(96,165,250,0.18); box-shadow: 0 0 0 1px rgba(96,165,250,0.18) inset; }
.emotion-result { margin-top: 14px !important; padding: 13px 14px; border-radius: 16px; background: rgba(96,165,250,0.09); border: 1px solid rgba(96,165,250,0.18); color: rgba(255,255,255,0.78) !important; }

.plan-progress, .empty-plan, .view-card { padding: 24px; border-radius: 28px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(22px); }
.plan-progress { display: flex; justify-content: space-between; align-items: center; }
.plan-progress span { color: rgba(255,255,255,0.6); }
.plan-progress strong { font-size: 24px; }
.plan-card { padding: 22px; border-radius: 26px; background: rgba(255,255,255,0.065); border: 1px solid rgba(255,255,255,0.09); }
.plan-card.open { border-color: rgba(96,165,250,0.52); background: rgba(96,165,250,0.10); }
.plan-card.done { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.08); }
.plan-card.locked { opacity: 0.56; }
.plan-time { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.plan-time strong { font-size: 22px; }
.plan-time span { color: rgba(255,255,255,0.58); font-size: 13px; }
.plan-card p { margin: 0 0 16px; line-height: 1.7; color: rgba(255,255,255,0.84); }
.plan-card img { width: 120px; height: 120px; border-radius: 20px; object-fit: cover; display: block; margin-bottom: 14px; }
.plan-card button { width: 100%; border: 0; background: linear-gradient(135deg, rgba(168,85,247,0.9), rgba(96,165,250,0.86)); color: white; padding: 14px 16px; border-radius: 16px; cursor: pointer; font-weight: 900; }
.plan-card button:disabled { cursor: not-allowed; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.46); }
.empty-plan { max-width: 780px; margin: 0 auto; text-align: center; }
.empty-plan h2 { margin: 0 0 10px; }
.empty-plan p { margin: 0; color: rgba(255,255,255,0.58); }
@media (max-width: 860px) { .sidebar { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%); transition: transform 220ms ease; } .sidebar.open { transform: translateX(0); } .topbar { height: 66px; padding: 0 14px; } .top-pill { display: none; } .chat-area, .page-view { height: calc(100vh - 66px); padding: 34px 14px 150px; } .hero-title h1, .view-header h1 { font-size: 36px; } .message-row { gap: 9px; } .bubble { max-width: 82vw; padding: 15px 16px; border-radius: 21px; font-size: 15px; } .emotion-grid { grid-template-columns: repeat(2, 1fr); } .feedback-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; } .feedback-row button { flex: 0 0 auto; } .composer { padding: 16px 12px 20px; } }
`;


const landingStyles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#ffffff",
    fontFamily:
      'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    scrollBehavior: "smooth",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 34px",
    zIndex: 30,
    background: "linear-gradient(180deg, rgba(0,0,0,0.72), rgba(0,0,0,0))",
    boxSizing: "border-box",
  },
  brand: {
    fontSize: "22px",
    fontWeight: 950,
    letterSpacing: "0.22em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },
  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 800,
    textShadow: "0 2px 12px rgba(0,0,0,0.55)",
  },
  navButton: {
    border: "1px solid rgba(255,255,255,0.58)",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
  navTextButton: {
    border: "none",
    background: "transparent",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 850,
    cursor: "pointer",
    padding: "10px 4px",
    textShadow: "0 2px 12px rgba(0,0,0,0.55)",
  },
  megaMenu: {
    position: "fixed",
    top: "0",
    left: 0,
    right: 0,
    zIndex: 24,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    padding: "96px 32px 54px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.18)",
  },
  megaMenuInner: {
    width: "min(780px, 100%)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
    gap: "80px",
  },
  megaColumn: {
    display: "grid",
    gap: "16px",
    alignContent: "start",
  },
  megaTitle: {
    margin: "0 0 8px",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 800,
  },
  megaItem: {
    border: "none",
    background: "transparent",
    padding: 0,
    textAlign: "left",
    color: "#111827",
    fontSize: "18px",
    fontWeight: 850,
    cursor: "pointer",
  },
  megaItemLink: {
    color: "#111827",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: 850,
  },
  videoWallSection: {
    minHeight: "100vh",
    background: "#050505",
    padding: "82px 8px 8px",
    boxSizing: "border-box",
  },
  videoWallGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(170px, 1fr))",
    gap: "8px",
    height: "calc(100vh - 90px)",
    minHeight: "620px",
  },
  videoPanel: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "4px",
    background: "#111827",
    isolation: "isolate",
  },
  panelVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
    pointerEvents: "none",
  },
  panelFallback: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, #111827 0%, #374151 45%, #020617 100%)",
    zIndex: 0,
  },
  panelOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.82))",
    zIndex: 2,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "58px",
    height: "58px",
    borderRadius: "999px",
    border: "1.5px solid rgba(255,255,255,0.86)",
    background: "rgba(0,0,0,0.18)",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer",
    zIndex: 3,
    backdropFilter: "blur(8px)",
  },
  panelText: {
    position: "absolute",
    left: "22px",
    right: "18px",
    bottom: "22px",
    zIndex: 4,
  },
  panelNumber: {
    fontSize: "22px",
    fontWeight: 950,
    marginBottom: "12px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "clamp(20px, 2vw, 30px)",
    lineHeight: 1.25,
    fontWeight: 950,
    letterSpacing: "-0.04em",
    textShadow: "0 8px 24px rgba(0,0,0,0.45)",
  },
  panelCaption: {
    margin: "10px 0 0",
    color: "rgba(255,255,255,0.86)",
    fontSize: "14px",
    lineHeight: 1.55,
    fontWeight: 650,
  },
  kicker: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.82)",
  },
  kickerDark: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 950,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  communityIntroSection: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    padding: "104px 22px",
    boxSizing: "border-box",
  },
  communityIntroInner: {
    width: "min(1180px, 100%)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "0.86fr 1.14fr",
    gap: "54px",
    alignItems: "center",
  },
  communityIntroTextBox: {
    minWidth: 0,
  },
  communityIntroTitle: {
    margin: "14px 0 0",
    fontSize: "clamp(38px, 5vw, 64px)",
    lineHeight: 1.06,
    letterSpacing: "-0.06em",
    fontWeight: 950,
  },
  communityIntroText: {
    margin: "22px 0 0",
    color: "#374151",
    fontSize: "17px",
    lineHeight: 1.75,
    fontWeight: 700,
  },
  communityIntroList: {
    display: "grid",
    gap: "18px",
    marginTop: "32px",
  },
  communityIntroListItem: {
    display: "grid",
    gridTemplateColumns: "46px 1fr",
    gap: "14px",
    alignItems: "start",
  },
  communityIntroListText: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.55,
    fontWeight: 650,
  },
  communityIntroIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#111827",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: 950,
    boxShadow: "0 12px 26px rgba(15,23,42,0.16)",
  },
  communityIntroButton: {
    marginTop: "34px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "16px 24px",
    fontSize: "15px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 18px 38px rgba(15,23,42,0.18)",
  },
  communityIntroMediaBox: {
    position: "relative",
    minHeight: "470px",
    borderRadius: "30px",
    overflow: "hidden",
    background: "#111827",
    boxShadow: "0 28px 80px rgba(15,23,42,0.22)",
    isolation: "isolate",
  },
  communityIntroVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 2,
    pointerEvents: "auto",
  },
  communityIntroVideoFallback: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 40% 35%, #4b5563 0%, #111827 46%, #020617 100%)",
    zIndex: 1,
  },
  communityIntroVideoOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.28))",
    zIndex: 3,
    pointerEvents: "none",
  },
  communityPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "78px",
    height: "78px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.92)",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: 950,
    zIndex: 5,
    boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
    pointerEvents: "none",
  },
  communityChatBubbleTop: {
    position: "absolute",
    top: "58px",
    left: "92px",
    zIndex: 6,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    borderRadius: "18px",
    padding: "15px 18px",
    fontSize: "14px",
    fontWeight: 850,
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    pointerEvents: "none"
  },
  communityChatBubbleMiddle: {
    position: "absolute",
    left: "48px",
    bottom: "112px",
    zIndex: 6,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    borderRadius: "18px",
    padding: "15px 18px",
    fontSize: "14px",
    fontWeight: 850,
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    pointerEvents: "none"
  },
  communityChatBubbleBottom: {
    position: "absolute",
    right: "58px",
    bottom: "46px",
    zIndex: 6,
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    borderRadius: "18px",
    padding: "15px 18px",
    fontSize: "14px",
    fontWeight: 850,
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    pointerEvents: "none"
  },
  reviewSection: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    padding: "92px 22px",
    boxSizing: "border-box",
  },
  sectionInner: {
    width: "min(1180px, 100%)",
    margin: "0 auto",
  },
  sectionTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "22px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: "14px 0 0",
    fontSize: "clamp(34px, 5vw, 62px)",
    lineHeight: 1.06,
    letterSpacing: "-0.05em",
    fontWeight: 950,
  },
  moreLink: {
    color: "#111827",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 900,
  },
  moreLinkButton: {
    border: "none",
    background: "transparent",
    color: "#111827",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
    padding: 0,
  },
  reviewGrid: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  reviewCard: {
    background: "#ffffff",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
  },
  reviewImageArea: {
    height: "260px",
    background: "linear-gradient(135deg, #111827 0%, #4b5563 48%, #d1d5db 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: "14px",
    fontWeight: 900,
  },
  reviewImageText: {
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "999px",
    padding: "10px 14px",
    background: "rgba(0,0,0,0.18)",
  },
  reviewQuote: {
    margin: 0,
    padding: "22px 22px 0",
    fontSize: "17px",
    lineHeight: 1.65,
    color: "#111827",
    fontWeight: 850,
  },
  reviewName: {
    margin: 0,
    padding: "16px 22px 24px",
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: 800,
  },
  introSection: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "92px 22px",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #0f172a 0%, #111827 45%, #020617 100%)",
  },
  introOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 34%)",
  },
  introContent: {
    position: "relative",
    zIndex: 2,
    width: "min(960px, 100%)",
    textAlign: "center",
  },
  introTitle: {
    margin: "18px 0 0",
    fontSize: "clamp(38px, 6vw, 76px)",
    lineHeight: 1.05,
    letterSpacing: "-0.06em",
    fontWeight: 950,
  },
  introText: {
    maxWidth: "760px",
    margin: "24px auto 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: "18px",
    lineHeight: 1.8,
    fontWeight: 550,
  },
  featureGrid: {
    margin: "42px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    maxWidth: "760px",
  },
  featureCard: {
    minHeight: "120px",
    borderRadius: "26px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    backdropFilter: "blur(10px)",
  },
  introButton: {
    marginTop: "38px",
    border: "none",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "999px",
    padding: "15px 28px",
    fontSize: "16px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
  },
  detailPage: {
    minHeight: "100vh",
    background: "#f7f7f5",
    color: "#111827",
    fontFamily:
      'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  detailNav: {
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    background: "rgba(255,255,255,0.9)",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(14px)",
  },
  brandDark: {
    fontSize: "20px",
    fontWeight: 950,
    letterSpacing: "0.2em",
  },
  detailBackButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "999px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 850,
    cursor: "pointer",
  },
  detailStartButton: {
    border: "none",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "11px 18px",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  detailMain: {
    width: "min(1180px, calc(100% - 36px))",
    margin: "0 auto",
    padding: "54px 0 80px",
  },
  detailHero: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "34px",
    alignItems: "stretch",
  },
  detailHeroIntroOnly: {
    display: "block",
    maxWidth: "980px",
    paddingTop: "18px",
  },
  detailTitleIntroOnly: {
    margin: "20px 0 0",
    fontSize: "clamp(54px, 7vw, 96px)",
    lineHeight: 1.02,
    letterSpacing: "-0.07em",
    fontWeight: 950,
  },
  detailEyebrow: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 950,
    letterSpacing: "0.18em",
  },
  detailTitle: {
    margin: "20px 0 0",
    fontSize: "clamp(42px, 6vw, 76px)",
    lineHeight: 1.02,
    letterSpacing: "-0.06em",
    fontWeight: 950,
  },
  detailSubtitle: {
    marginTop: "22px",
    color: "#4b5563",
    fontSize: "19px",
    lineHeight: 1.75,
    fontWeight: 600,
  },
  detailVideoHero: {
    position: "relative",
    minHeight: "480px",
    borderRadius: "34px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #111827 0%, #374151 52%, #d1d5db 100%)",
    boxShadow: "0 28px 80px rgba(15,23,42,0.2)",
  },
  detailVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailVideoOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.58))",
  },
  detailVideoText: {
    position: "absolute",
    left: "28px",
    right: "28px",
    bottom: "28px",
    color: "rgba(255,255,255,0.9)",
    fontSize: "18px",
    fontWeight: 900,
  },
  introVisionStatement: {
    width: "min(1180px, 100%)",
    margin: "0 auto",
    padding: "30px 0 90px",
  },
  introVisionLine: {
    margin: "0 0 40px",
    color: "#111827",
    fontSize: "clamp(42px, 6vw, 92px)",
    lineHeight: 1.02,
    letterSpacing: "-0.065em",
    fontWeight: 950,
  },
  introVisionVideoWrap: {
    position: "relative",
    width: "100%",
    minHeight: "520px",
    borderRadius: "34px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #111827 0%, #374151 48%, #020617 100%)",
    boxShadow: "0 34px 80px rgba(15, 23, 42, 0.22)",
  },
  introVisionVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  introVisionVideoOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.52))",
  },
  introVisionVideoText: {
    position: "absolute",
    left: "34px",
    bottom: "30px",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 950,
    letterSpacing: "0.08em",
  },
  introVideoBelowSection: {
    marginTop: "34px",
  },
  introVideoBelowHero: {
    position: "relative",
    width: "100%",
    height: "min(72vh, 680px)",
    minHeight: "420px",
    borderRadius: "34px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #111827 0%, #374151 52%, #d1d5db 100%)",
    boxShadow: "0 28px 80px rgba(15,23,42,0.2)",
  },
  detailCards: {
    marginTop: "34px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
    gap: "18px",
  },
  detailCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 16px 42px rgba(15,23,42,0.08)",
  },
  detailCardNumber: {
    fontSize: "14px",
    fontWeight: 950,
    color: "#6b7280",
  },
  detailCardTitle: {
    margin: "18px 0 0",
    fontSize: "24px",
    lineHeight: 1.25,
    fontWeight: 950,
    letterSpacing: "-0.04em",
  },
  detailCardText: {
    margin: "12px 0 0",
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: 1.7,
    fontWeight: 600,
  },
  futureStorySection: {
    display: "grid",
    gap: "26px",
    marginBottom: "120px",
  },
  futureStoryTextBox: {
    width: "min(980px, 100%)",
    margin: "0 auto",
  },
  futureStoryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 950,
    letterSpacing: "0.18em",
  },
  futureStoryTitle: {
    margin: "14px 0 0",
    fontSize: "clamp(30px, 4.2vw, 56px)",
    lineHeight: 1.05,
    letterSpacing: "-0.055em",
    fontWeight: 950,
  },
  futureStoryText: {
    margin: "14px 0 0",
    color: "#4b5563",
    fontSize: "18px",
    lineHeight: 1.6,
    fontWeight: 700,
  },
  futureStoryMedia: {
    position: "relative",
    width: "100%",
    minHeight: "76vh",
    borderRadius: "0",
    overflow: "hidden",
    background: "#111827",
    boxShadow: "0 28px 80px rgba(15,23,42,0.18)",
  },
  detailStoryWrap: {
    marginTop: "90px",
    display: "grid",
    gap: "90px",
  },
  detailStorySection: {
    display: "grid",
    gridTemplateColumns: "0.82fr 1.18fr",
    gap: "42px",
    alignItems: "center",
  },
  detailStoryReverse: {
    gridTemplateColumns: "1.18fr 0.82fr",
  },
  detailStoryTextBox: {
    minWidth: 0,
  },
  detailStoryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 950,
    letterSpacing: "0.16em",
  },
  detailStoryTitle: {
    margin: "16px 0 0",
    fontSize: "clamp(32px, 4.4vw, 58px)",
    lineHeight: 1.08,
    letterSpacing: "-0.055em",
    fontWeight: 950,
  },
  detailStoryText: {
    margin: "18px 0 0",
    color: "#4b5563",
    fontSize: "18px",
    lineHeight: 1.8,
    fontWeight: 600,
  },
  detailStoryMedia: {
    position: "relative",
    minHeight: "520px",
    borderRadius: "34px",
    overflow: "hidden",
    background: "#111827",
    boxShadow: "0 28px 80px rgba(15,23,42,0.18)",
  },
  detailStoryVideo: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 2,
  },
  detailStoryFallback: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.75)",
    fontSize: "16px",
    fontWeight: 900,
    background: "linear-gradient(135deg, #111827 0%, #4b5563 48%, #020617 100%)",
    zIndex: 1,
  },
  reviewDetailPage: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111827",
    fontFamily:
      'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  reviewDetailMain: {
    width: "min(1180px, calc(100% - 36px))",
    margin: "0 auto",
    padding: "72px 0 96px",
  },
  reviewDetailHeader: {
    marginBottom: "40px",
  },
  reviewDetailTitle: {
    margin: "18px 0 0",
    fontSize: "clamp(44px, 6vw, 76px)",
    lineHeight: 1.02,
    letterSpacing: "-0.06em",
    fontWeight: 950,
  },
  reviewDetailSubtitle: {
    maxWidth: "700px",
    marginTop: "18px",
    color: "#4b5563",
    fontSize: "18px",
    lineHeight: 1.75,
    fontWeight: 600,
  },
  reviewStoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "28px",
    alignItems: "start",
  },
  reviewStoryCard: {
    background: "#ffffff",
    borderRadius: "8px",
  },
  reviewStoryImageWrap: {
    position: "relative",
    width: "100%",
    height: "240px",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#e5e7eb",
    marginBottom: "18px",
  },
  reviewStoryImage: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  reviewStoryImageFallback: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 900,
    zIndex: 1,
  },
  reviewStoryTitle: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.28,
    letterSpacing: "-0.04em",
    fontWeight: 950,
    color: "#111827",
  },
  reviewStoryText: {
    margin: "12px 0 0",
    color: "#374151",
    fontSize: "15px",
    lineHeight: 1.7,
    fontWeight: 650,
  },
  reviewStoryMeta: {
    margin: "14px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 800,
  },

};
