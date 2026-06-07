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

  if (page === "noah") return <NoahExperienceApp onBack={goHome} />;
  return <LandingPage onStart={openNoah} onCommunity={() => setPage("home")} />;
}

const emotionOptions = [
  { id: "calm", emoji: "🙂", label: "괜찮음", mode: "원래 계획 유지" },
  { id: "fire", emoji: "🔥", label: "의욕 넘침", mode: "조금 더 도전" },
  { id: "anxious", emoji: "😰", label: "불안함", mode: "부담 줄이기" },
  { id: "tired", emoji: "😴", label: "지침", mode: "최소 실행" },
  { id: "stress", emoji: "😵", label: "스트레스", mode: "하나만 남기기" },
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

function getId(prefix = "id") {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {}
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function includesAny(text, words) {
  const source = String(text || "").toLowerCase();
  return words.some((word) => source.includes(String(word).toLowerCase()));
}

function isNoPreferenceAnswer(value) {
  const text = String(value || "").replace(/\s/g, "").toLowerCase();
  return /딱히없|별로없|잘모르|모르겠|생각안나|없어|없음|아직모르|상관없|아무거나/.test(text) || text.length <= 3;
}

function extractNameFromInput(value) {
  const raw = String(value || "").trim();
  const patterns = [
    /(?:내\s*이름은|제\s*이름은|나는|난)\s*([가-힣a-zA-Z]{2,20})(?:이야|야|입니다|이에요|예요|라고\s*해|라고\s*합니다)?/,
    /^([가-힣a-zA-Z]{2,20})(?:이야|야|입니다|이에요|예요)?$/,
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return raw
    .replace(/내\s*이름은|제\s*이름은|나는|난|입니다|이에요|예요|이야|야|라고\s*해|라고\s*합니다/g, "")
    .replace(/[^가-힣a-zA-Z]/g, "")
    .trim() || raw;
}

function cleanGoalText(value) {
  return String(value || "")
    .replace(/나는|내가|되고\s*싶어|되고싶어|하고\s*싶어|하고싶어|꿈이야|꿈|목표야|목표/g, "")
    .replace(/\s+/g, " ")
    .trim() || "목표";
}

function goalLabel(profile) {
  return cleanGoalText(profile?.dream || "목표");
}

function parseTimeToMinutes(time) {
  const [h, m] = String(time || "20:00").split(":").map(Number);
  return (Number.isFinite(h) ? h : 20) * 60 + (Number.isFinite(m) ? m : 0);
}

function minutesToTime(total) {
  const safe = Math.max(0, Math.min(23 * 60 + 59, total));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseKoreanTimeExpression(raw) {
  const text = String(raw || "").replace(/\s/g, "");
  const match = text.match(/(오전|오후|아침|저녁|밤|새벽)?(\d{1,2})(?:[:시](\d{1,2})?)?/);
  if (!match) return null;
  const period = match[1] || "";
  let hour = Number(match[2]);
  const minute = match[3] ? Number(match[3]) : 0;
  if ((period === "오후" || period === "저녁" || period === "밤") && hour < 12) hour += 12;
  if ((period === "오전" || period === "아침" || period === "새벽") && hour === 12) hour = 0;
  return minutesToTime(hour * 60 + minute);
}

function extractAvailableWindows(text) {
  const raw = String(text || "");
  const windows = [];
  const mentionRegex = /(오전|오후|아침|저녁|밤|새벽)?\s*\d{1,2}\s*(?::|시)\s*\d{0,2}\s*(?:분)?/g;
  const mentions = [];
  let match;
  let lastPeriod = "";

  while ((match = mentionRegex.exec(raw)) !== null) {
    const period = match[1] || lastPeriod;
    if (match[1]) lastPeriod = match[1];
    const time = parseKoreanTimeExpression(`${period || ""}${match[0]}`);
    if (time) mentions.push({ time, index: match.index, text: match[0], period });
  }

  for (let i = 0; i < mentions.length - 1; i += 2) {
    const start = mentions[i];
    const end = mentions[i + 1];
    let startMin = parseTimeToMinutes(start.time);
    let endMin = parseTimeToMinutes(end.time);
    if (endMin <= startMin) endMin += 12 * 60;
    const duration = endMin - startMin;
    if (duration >= 15) windows.push({ start: minutesToTime(startMin), end: minutesToTime(Math.min(endMin, 23 * 60 + 59)) });
  }

  if (!windows.length && mentions.length === 1) {
    const one = mentions[0].time;
    windows.push({ start: one, end: minutesToTime(parseTimeToMinutes(one) + 90) });
  }
  if (!windows.length) windows.push({ start: "20:00", end: "21:30" });
  return windows;
}

function getAvailabilityMinutes(timeText) {
  return extractAvailableWindows(timeText).reduce((sum, window) => sum + Math.max(0, parseTimeToMinutes(window.end) - parseTimeToMinutes(window.start)), 0);
}

function getPlanCountFromAvailability(timeText) {
  const total = getAvailabilityMinutes(timeText);
  if (total <= 35) return 2;
  if (total <= 90) return 3;
  if (total <= 180) return 5;
  if (total <= 360) return 7;
  return 9;
}

function buildScheduleTimes(timeText, desiredCount = 6) {
  const windows = extractAvailableWindows(timeText);
  const totalAvailable = windows.reduce((sum, window) => sum + Math.max(0, parseTimeToMinutes(window.end) - parseTimeToMinutes(window.start)), 0);
  const count = Math.max(1, desiredCount);
  const times = [];

  windows.forEach((window) => {
    const start = parseTimeToMinutes(window.start);
    const end = parseTimeToMinutes(window.end);
    const duration = Math.max(0, end - start);
    if (duration < 15) return;
    const windowCount = Math.max(1, Math.round((duration / Math.max(totalAvailable, 1)) * count));
    const step = Math.max(25, Math.floor(duration / Math.max(windowCount, 1)));
    let current = start;
    for (let i = 0; i < windowCount && current <= end - 10; i += 1) {
      times.push(minutesToTime(current));
      current += step;
    }
  });

  while (times.length < count) {
    const last = times.length ? parseTimeToMinutes(times[times.length - 1]) + 30 : parseTimeToMinutes("20:00");
    times.push(minutesToTime(last));
  }
  return [...new Set(times)].slice(0, count);
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

function getScenarioType(profile) {
  const dream = String(profile.dream || "");
  if (includesAny(dream, ["프로게이머", "게임", "e스포츠", "이스포츠", "랭크"])) return "gamer";
  if (includesAny(dream, ["건물주", "부동산", "임대", "월세", "상가", "아파트"])) return "realestate";
  if (includesAny(dream, ["사업", "창업", "회사", "브랜드", "서비스", "앱", "스타트업", "사업가"])) return "business";
  if (includesAny(dream, ["면접", "취업", "회사원", "직장", "입사"])) return "interview";
  if (includesAny(dream, ["발표", "스피치", "유튜브", "콘텐츠", "크리에이터"])) return "presentation";
  if (includesAny(dream, ["돈", "부자", "경제", "투자", "주식", "수익", "자산", "경제적 자유"])) return "money";
  if (includesAny(dream, ["공부", "시험", "성적", "대학", "학교", "자격증", "수능"])) return "study";
  return "general";
}

function getScenario(profile) {
  const type = getScenarioType(profile);
  const goal = goalLabel(profile);
  const map = {
    business: {
      type,
      title: "카페에서 만난 첫 고객",
      location: "작은 카페, 창가 자리",
      role: "노아가 잠재 고객 역할",
      video: "/videos/simulation-business.mp4",
      poster: "/videos/simulation-business.jpg",
      opening: "안녕하세요. 당신 서비스가 뭔지 궁금해서 왔어요. 제 시간을 써서 들어야 할 이유가 뭔가요?",
      pressure: "좋아요. 그런데 제가 돈을 내야 할 만큼 아픈 문제인지 아직 모르겠어요. 더 쉽게 설명해줄 수 있나요?",
      good: "고객 입장에서 이해되는 표현이 하나 생겼어. 다음에는 더 짧고 구체적으로 말하면 좋아.",
    },
    realestate: {
      type,
      title: "부동산 사무실 상담",
      location: "중개사무소 상담 테이블",
      role: "노아가 중개사 겸 투자자 역할",
      video: "/videos/simulation-realestate.mp4",
      poster: "/videos/simulation-realestate.jpg",
      opening: "예산과 목표 월세가 어떻게 되나요? 이 매물을 왜 선택하려는지도 말해보세요.",
      pressure: "좋습니다. 그런데 공실이 3개월 생기면 버틸 수 있나요? 위험을 어떻게 계산할 건가요?",
      good: "좋아. 숫자로 판단하려는 방향이 생겼어. 감이 아니라 기준으로 보는 훈련을 계속하자.",
    },
    gamer: {
      type,
      title: "프로 경기 분석실",
      location: "어두운 분석실, 경기 화면 앞",
      role: "노아가 코치 역할",
      video: "/videos/simulation-gamer.mp4",
      poster: "/videos/simulation-gamer.jpg",
      opening: "상대 핵심 선수가 지도에서 사라졌어. 지금 네가 확인해야 할 정보 3개를 말해봐.",
      pressure: "좋아. 그런데 팀원이 무리하게 들어가려고 해. 넌 어떤 콜을 할 거야?",
      good: "판단 순서가 생기고 있어. 상황을 보기 전에 먼저 확인할 기준을 정한 게 좋아.",
    },
    interview: {
      type,
      title: "실전 면접실",
      location: "회의실, 면접관 맞은편",
      role: "노아가 면접관 역할",
      video: "/videos/simulation-interview.mp4",
      poster: "/videos/simulation-interview.jpg",
      opening: "자기소개를 해보세요. 그리고 왜 이 일을 하고 싶은지도 함께 말해주세요.",
      pressure: "좋습니다. 그런데 다른 지원자 대신 당신을 뽑아야 하는 이유는 뭔가요?",
      good: "답변의 뼈대가 생겼어. 다음에는 경험 하나를 붙이면 더 설득력 있어.",
    },
    presentation: {
      type,
      title: "작은 발표 무대",
      location: "조용한 발표실, 앞에 청중 5명",
      role: "노아가 청중 역할",
      video: "/videos/simulation-presentation.mp4",
      poster: "/videos/simulation-presentation.jpg",
      opening: "지금부터 네 아이디어를 30초 안에 설명해줘. 듣는 사람이 바로 이해해야 해.",
      pressure: "좋아요. 그런데 핵심이 조금 흐려요. 한 문장으로 다시 말하면 뭐예요?",
      good: "핵심 문장을 줄이는 감각이 생겼어. 청중은 짧고 선명한 말을 기억해.",
    },
    money: {
      type,
      title: "투자 판단 회의",
      location: "노트북 앞, 숫자와 차트가 열린 책상",
      role: "노아가 리스크 질문자 역할",
      video: "/videos/simulation-money.mp4",
      poster: "/videos/simulation-money.jpg",
      opening: "이 선택으로 돈을 벌 수 있다고 생각하는 이유를 말해봐. 숫자와 위험을 같이 말해야 해.",
      pressure: "좋아. 그런데 네 예상이 틀렸을 때 가장 먼저 무너지는 지점은 어디야?",
      good: "위험을 같이 보는 습관이 생기고 있어. 수익보다 먼저 생존을 보는 게 좋아.",
    },
    study: {
      type,
      title: "시험 직전 코칭룸",
      location: "책상, 문제집과 타이머",
      role: "노아가 시험 코치 역할",
      video: "/videos/simulation-study.mp4",
      poster: "/videos/simulation-study.jpg",
      opening: "지금 이 문제를 틀렸다고 가정하자. 왜 틀렸는지 원인을 세 가지 중 하나로 골라봐. 지식 부족, 실수, 시간 부족.",
      pressure: "좋아. 그럼 같은 실수를 줄이기 위해 다음 문제에서 어떤 확인을 먼저 할 거야?",
      good: "틀린 이유를 나누는 습관이 생겼어. 이게 점수를 올리는 핵심이야.",
    },
    general: {
      type,
      title: `${goal} 실전 첫 장면`,
      location: "현실처럼 구성된 연습 공간",
      role: "노아가 상황 상대 역할",
      video: "/videos/simulation-general.mp4",
      poster: "/videos/simulation-general.jpg",
      opening: `${goal}를 실제로 시작해야 하는 순간이야. 지금 가장 먼저 어떤 행동을 할 건지 말해봐.`,
      pressure: "좋아. 그런데 예상과 다르게 막혔어. 다음 선택은 뭐야?",
      good: "실제 상황에서 멈추지 않고 다음 행동을 고르는 힘이 생기고 있어.",
    },
  };
  return map[type] || map.general;
}


function makeUnexpectedSimulationSteps(type, planTitle, goal) {
  const cleanPlan = String(planTitle || "오늘 계획").replace(/\s+/g, " ").trim();
  const cleanGoal = String(goal || "목표").replace(/\s+/g, " ").trim();

  if (type === "business") {
    return [
      `안녕하세요. 저는 잠재 고객이에요. 지금 계획이 “${cleanPlan}” 맞죠? 먼저 당신이 하려는 걸 한 문장으로 설명해보세요.`,
      "잠깐만요. 저는 그걸 왜 써야 하는지 아직 잘 모르겠어요. 제 불편함을 기준으로 다시 말해줄래요?",
      "가격이 있거나 시간이 들어간다면 망설일 것 같아요. 제가 지금 바로 관심 가져야 할 이유 하나만 말해보세요.",
      "좋아요. 그런데 비슷한 걸 이미 본 적이 있어요. 당신 방식이 다른 점은 뭐예요?",
      "마지막으로, 이 대화를 끝내고 실제 행동으로 옮길 다음 한 가지를 말해보세요.",
    ];
  }

  if (type === "realestate" || type === "money") {
    return [
      `좋아요. 지금 계획이 “${cleanPlan}”이죠. 저는 보수적인 투자자 역할을 할게요. 이 선택을 왜 검토하려는지 말해보세요.`,
      "예상과 다르게 비용이 더 나왔어요. 어떤 숫자를 먼저 다시 확인할 건가요?",
      "수익이 좋아 보여도 위험이 숨어 있을 수 있어요. 가장 먼저 의심해야 할 부분은 뭐라고 봐요?",
      "만약 오늘 결정하지 못한다면, 내일 판단을 위해 꼭 확인해야 할 자료 하나는 뭐예요?",
      "마지막으로, 감이 아니라 기준으로 남길 판단 문장 하나를 말해보세요.",
    ];
  }

  if (type === "gamer") {
    return [
      `지금은 경기 중이라고 생각해요. 오늘 계획 “${cleanPlan}”을 실제 상황에 적용해야 해요. 상대가 예상 밖으로 움직였어요. 먼저 뭘 확인할 건가요?`,
      "팀원이 무리하게 들어가려 해요. 지금 어떤 콜을 할 건가요?",
      "방금 판단이 틀렸다고 가정해볼게요. 다음에는 어떤 정보가 더 필요했을까요?",
      "같은 상황이 다시 나오면 바로 할 행동 하나를 짧게 말해보세요.",
      "마지막으로, 오늘 실전 게임에서 의식할 규칙 하나를 정해보세요.",
    ];
  }

  if (type === "interview") {
    return [
      `면접실이라고 생각해요. 오늘 계획 “${cleanPlan}”을 바탕으로 답해볼게요. 먼저 자기소개처럼 짧게 말해보세요.`,
      "좋아요. 그런데 면접관인 제가 보기엔 아직 근거가 부족해요. 실제 경험 하나를 붙여 말해보세요.",
      "다른 지원자와 비교해서 당신을 뽑아야 하는 이유는 뭐예요?",
      "답변이 길어졌어요. 핵심만 한 문장으로 다시 말해보세요.",
      "마지막으로, 실제 면접에서 가장 먼저 꺼낼 문장 하나를 말해보세요.",
    ];
  }

  if (type === "presentation") {
    return [
      `작은 발표장이라고 생각해요. 오늘 계획 “${cleanPlan}”을 바탕으로 20초 안에 설명해보세요.`,
      "청중이 고개를 갸웃했어요. 더 쉬운 말로 다시 설명해보세요.",
      "누군가 이렇게 묻습니다. '그래서 그게 나한테 왜 중요한데요?' 답해보세요.",
      "지금 말에서 핵심 단어 3개만 남긴다면 뭐예요?",
      "마지막으로, 실제 발표 첫 문장을 정해보세요.",
    ];
  }

  if (type === "study") {
    return [
      `공부방이라고 생각해요. 오늘 계획 “${cleanPlan}”을 실제 문제 상황에 적용할게요. 지금 막힌 문제가 나왔어요. 먼저 원인을 뭐로 볼 건가요?`,
      "답을 봐도 비슷한 문제를 또 틀릴 수 있어요. 다음 문제에서 가장 먼저 확인할 기준은 뭐예요?",
      "시간이 부족해졌어요. 지금 버릴 것과 끝까지 볼 것을 나눠보세요.",
      "이 유형을 내일 다시 풀 때 첫 행동은 뭐예요?",
      "마지막으로, 오늘 배운 내용을 한 문장으로 말해보세요.",
    ];
  }

  return [
    `지금은 ${cleanGoal}로 가는 실제 상황이야. 오늘 계획 “${cleanPlan}”을 해야 하는 순간인데 예상치 못한 문제가 생겼어. 먼저 어떻게 시작할래?`,
    "생각보다 반응이 없거나 결과가 안 나와요. 다음 선택은 뭐예요?",
    "주변에서 다른 방식이 낫다고 말해요. 그래도 네 방식으로 밀고 갈 기준은 뭐예요?",
    "지금 바로 줄여서 실행한다면 어떤 행동 하나만 남길 건가요?",
    "마지막으로, 실제 행동으로 옮길 첫 문장 또는 첫 행동을 말해보세요.",
  ];
}

function getPlanBasedScenario(profile, planItem) {
  const type = getScenarioType(profile);
  const goal = goalLabel(profile);
  const base = getScenario(profile);
  const planTitle = planItem?.title || base.title || "오늘 계획";
  const steps = makeUnexpectedSimulationSteps(type, planTitle, goal);

  const titleMap = {
    business: "잠재 고객과 실제 대화",
    realestate: "중개사와 투자 판단 대화",
    gamer: "경기 중 예상 밖 상황",
    interview: "실전 면접 압박 질문",
    presentation: "청중 앞 돌발 질문",
    money: "투자 리스크 점검 대화",
    study: "막힌 문제 해결 훈련",
    general: "예상치 못한 현실 상황",
  };

  const roleMap = {
    business: "잠재 고객",
    realestate: "중개사 / 투자자",
    gamer: "코치 / 팀원",
    interview: "면접관",
    presentation: "청중",
    money: "리스크 질문자",
    study: "시험 코치",
    general: "상황 상대",
  };

  return {
    ...base,
    type,
    planTitle,
    title: titleMap[type] || titleMap.general,
    role: roleMap[type] || roleMap.general,
    location: `${goal}를 향해 가는 실제 상황`,
    opening: steps[0],
    pressure: steps[1],
    good: "좋아. 방금 답변에서 실제로 써먹을 수 있는 기준이 생겼어. 이제 말로 끝내지 말고 다음 행동으로 이어가자.",
    steps,
  };
}

function buildActions(profile) {
  const type = getScenarioType(profile);
  const goal = goalLabel(profile);
  const joined = [profile.dream, profile.why, profile.bestMoment, profile.strength, profile.habit, profile.dislike].join(" ");
  const analysis = includesAny(joined, ["분석", "패턴", "심리", "전략", "숫자", "비교"]);
  const people = includesAny(joined, ["사람", "대화", "소통", "고객", "팀", "설득"]);
  const avoidsPeople = includesAny(profile.dislike, ["사람", "평가", "시선", "부담"]);

  const templates = {
    business: [
      "내가 만들고 싶은 서비스나 상품을 한 줄로 적기",
      "그 서비스를 가장 필요로 할 사람을 한 명 떠올리고, 상황과 불편함 적기",
      people && !avoidsPeople ? "실전 체험에서 고객에게 서비스 설명 연습하기" : "실전 체험에서 고객 반박에 답하는 연습하기",
      "실전에서 나온 질문을 바탕으로 제안 문장 한 줄 다시 쓰기",
      "오늘 만든 제안 문장을 사진으로 인증하기",
    ],
    realestate: [
      "내가 원하는 월세 수입 목표를 숫자로 적기",
      "관심 지역 1곳과 매물 2개를 고르고 가격과 예상 월세 적기",
      "실전 체험에서 중개사의 질문에 답하며 위험 계산 연습하기",
      "월세에서 대출이자와 관리비를 빼고 실제 남는 돈 계산하기",
      "오늘 조사표를 사진으로 인증하기",
    ],
    gamer: [
      "프로 경기 1판 보기",
      analysis ? "상대가 움직이기 전 보인 신호 3개 적기" : "내가 자주 지는 상황 1개 고르기",
      "실전 체험에서 코치 질문에 답하며 판단 순서 연습하기",
      "직접 1판 플레이하고 방금 정한 판단 하나만 적용하기",
      "리플레이 장면을 사진으로 인증하고 실수 원인 1개 적기",
    ],
    interview: [
      "자기소개 3문장 적기",
      "내 경험 중 증명할 수 있는 사례 1개 고르기",
      "실전 체험에서 면접관 질문에 답하기",
      "막힌 질문을 다시 한 문장으로 고쳐 말하기",
      "최종 답변을 사진으로 인증하기",
    ],
    presentation: [
      "내 아이디어를 한 문장으로 적기",
      "듣는 사람이 궁금해할 질문 3개 적기",
      "실전 체험에서 30초 발표하기",
      "노아가 물은 반박 질문에 다시 답하기",
      "수정한 핵심 문장을 인증하기",
    ],
    money: [
      "내가 원하는 경제적 자유 숫자를 적기",
      "관심 있는 수익 방법 1개와 필요한 첫 능력 1개 적기",
      "실전 체험에서 수익 이유와 위험을 말해보기",
      "가장 큰 손실 위험 1개와 대비 행동 1개 적기",
      "오늘 정리한 숫자를 사진으로 인증하기",
    ],
    study: [
      "오늘 점수를 가장 빨리 올릴 약한 단원 1개 고르기",
      "그 단원에서 자주 틀리는 유형 3개 적기",
      "실전 체험에서 틀린 이유를 말로 설명하기",
      "같은 유형 문제 3개 풀기",
      "풀이 흔적을 사진으로 인증하기",
    ],
    general: [
      `${goal}에 필요한 능력 3개 적기`,
      `${goal}를 이미 해낸 사람의 행동 1개 고르기`,
      "실전 체험에서 실제 상황 질문에 답하기",
      "실전에서 막힌 부분을 다시 작은 행동 1개로 바꾸기",
      "오늘 결과를 사진으로 인증하기",
    ],
  };

  return templates[type] || templates.general;
}

function buildExperiencePlan(profile) {
  const count = getPlanCountFromAvailability(profile.time || profile.habit || "20:00");
  const base = buildActions(profile);
  const extras = [
    `${goalLabel(profile)}를 위해 내일 이어갈 첫 행동 1개 정하기`,
    "오늘 배운 점 3줄 기록하기",
    "회고에서 가장 어려웠던 순간 1개 말하기",
  ];
  const actions = [...base, ...extras].slice(0, Math.max(5, count));
  const times = buildScheduleTimes(profile.time || profile.habit || "20:00", actions.length);
  return actions.map((title, index) => ({
    id: getId("plan"),
    time: times[index] || minutesToTime(parseTimeToMinutes(times[0] || "20:00") + index * 30),
    title,
    phase: title.includes("실전 체험") ? "simulation" : index === actions.length - 1 ? "review" : "action",
    status: index === 0 ? "open" : "locked",
    proofImage: "",
  }));
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

function adjustItemsByEmotion(items, emotionId) {
  return unlockPlan(items.map((item, index) => {
    if (item.status === "done") return item;
    const original = item.originalTitle || item.title;
    let title = original;
    if (emotionId === "fire" && item.phase !== "simulation") title = `${original} + 결과물 하나 더 남기기`;
    if (emotionId === "anxious") title = item.phase === "simulation" ? original : `부담 줄여서 핵심만 하기: ${original}`;
    if (emotionId === "tired") title = item.phase === "simulation" ? original : `가장 쉬운 첫 단계만 하기: ${original}`;
    if (emotionId === "stress") title = item.phase === "simulation" ? original : `오늘은 이것 하나만 남기기: ${original}`;
    if (emotionId === "blur") title = item.phase === "simulation" ? original : `타이머 5분 켜고 시작하기: ${original}`;
    return { ...item, originalTitle: original, title };
  }));
}

function getEmotionById(id) {
  return emotionOptions.find((item) => item.id === id) || emotionOptions[0];
}

function NoahExperienceApp({ onBack }) {
  const [messages, setMessages] = useState([firstNoahMessage]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("name");
  const [profile, setProfile] = useState({ name: "", dream: "", why: "", bestMoment: "", dislike: "", strength: "", habit: "", time: "", emotion: "" });
  const [planItems, setPlanItems] = useState([]);
  const [activeView, setActiveView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simulation, setSimulation] = useState({ started: false, turn: 0, messages: [] });
  const [simulationInput, setSimulationInput] = useState("");
  const [activeSimulationItem, setActiveSimulationItem] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const chatAreaRef = useRef(null);
  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const pendingProofIndexRef = useRef(null);

  const completedCount = planItems.filter((item) => item.status === "done").length;
  const currentOpenIndex = planItems.findIndex((item) => item.status === "open");
  const fallbackSimulationItem = planItems.find((item) => item.phase === "simulation") || planItems[currentOpenIndex] || planItems[0];
  const scenario = getPlanBasedScenario(profile, activeSimulationItem || fallbackSimulationItem);

  useEffect(() => {
    if (activeView !== "chat") return;
    const scrollToBottom = () => {
      const area = chatAreaRef.current;
      if (area) area.scrollTop = area.scrollHeight;
      chatBottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    };
    scrollToBottom();
    const timers = [0, 60, 160, 320].map((delay) => setTimeout(scrollToBottom, delay));
    const frame = requestAnimationFrame(scrollToBottom);
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(frame); };
  }, [messages.length, activeView, input, step]);

  const progressText = useMemo(() => {
    if (!profile.name) return "처음 만나는 중";
    if (!profile.dream) return `${profile.name}의 꿈을 찾는 중`;
    if (!planItems.length) return "사용자 성향 파악 중";
    return `${completedCount}/${planItems.length} 완료`;
  }, [profile, planItems.length, completedCount]);

  const getSuggestedReplies = () => {
    if (step === "name") return ["내 이름은 예원이야", "나는 민준이야", "이름을 말하고 시작할게"];
    if (step === "dream") return ["나는 사업가가 되고 싶어", "프로게이머가 되고 싶어", "경제적으로 자유로워지고 싶어"];
    if (step === "why") return ["내 힘으로 결과를 만들고 싶어", "남들이 안 된다고 한 걸 증명하고 싶어", "이걸 할 때 내가 살아있는 느낌이 들어"];
    if (step === "bestMoment") return ["결과가 눈에 보일 때 좋아", "오래 파고들어서 실력이 늘 때 좋아", "상대의 생각을 읽고 이길 때 재밌어"];
    if (step === "dislike") return ["딱히 싫어하는 건 없어", "너무 막연한 계획은 싫어", "의미 없이 반복하는 건 싫어"];
    if (step === "strength") return ["분석하는 걸 잘해", "한번 꽂히면 오래 파고들어", "경쟁하면 집중이 잘돼"];
    if (step === "habit") return ["저녁에 집중이 잘돼", "혼자 할 때 더 몰입돼", "누가 같이 확인해주면 더 잘해"];
    if (step === "time") return ["오전 8시부터 8시 30분까지, 오후 4시부터 10시까지 가능해", "학교 끝나고 오후 6시부터 2시간 가능해", "하루에 30분 정도 가능해"];
    if (step === "execute") return ["실전 체험부터 해볼래", "오늘 계획을 다시 조정해줘", "회고로 넘어가고 싶어"];
    return [];
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value) return;
    const nextMessages = [...messages, makeUserMessage(value)];
    const nextProfile = { ...profile };
    let noahReply = "";
    let nextStep = step;

    if (step === "name") {
      const cleanName = extractNameFromInput(value);
      nextProfile.name = cleanName;
      noahReply = `좋네, ${cleanName}.\n이제 진짜 중요한 걸 물어볼게.\n\n너는 뭘 이루고 싶어?\n하고 싶은 게 뭐고, 달성하고 싶은 목표가 뭐야?\n아, 꿈은?`;
      nextStep = "dream";
    } else if (step === "dream") {
      nextProfile.dream = value;
      noahReply =
        `좋아. ${nextProfile.name || "너"}, 그 꿈 기억할게.\n\n` +
        "가능해. 무조건 말이야.\n\n" +
        "내가 너를 거기에 좀 더 빠르게 데려다줄 뿐이지.\n" +
        "다시 한번 말해줄게. 너는 갈 수 있어.\n" +
        "그 이유는 네가 이미 달라졌기 때문이야. 나를 찾아왔잖아.\n\n" +
        "근데 바로 계획부터 짜지 않을게.\n" +
        "너한테 맞는 계획과 실전 상황을 만들려면 먼저 너를 알아야 해.\n\n" +
        "그 꿈을 왜 이루고 싶어?\n돈, 자유, 인정, 재미, 증명하고 싶은 마음 전부 괜찮아.";
      nextStep = "why";
    } else if (step === "why") {
      nextProfile.why = value;
      noahReply = `${nextProfile.name || "좋아"}. 네가 말한 이유를 기준으로 방향을 잡을게.\n\n${nextProfile.dream || "그 꿈"}과 관련해서 네가 가장 재미있거나 몰입되는 순간은 언제야?`;
      nextStep = "bestMoment";
    } else if (step === "bestMoment") {
      nextProfile.bestMoment = value;
      noahReply = "좋아. 그 지점은 네가 오래 갈 수 있는 방식일 가능성이 커.\n\n반대로 싫어하는 방식도 알아야 해. 어떤 방식으로 하면 금방 지치거나 하기 싫어져? 딱히 없으면 없다고 말해도 돼.";
      nextStep = "dislike";
    } else if (step === "dislike") {
      nextProfile.dislike = value;
      noahReply = isNoPreferenceAnswer(value)
        ? "좋아. 아직 뚜렷하게 싫은 방식이 없다면 넓게 시작해볼게. 하면서 지치는 지점이 나오면 바로 줄이면 돼.\n\n이번엔 네가 가진 쪽을 볼게. 주변에서 잘한다고 들었거나, 네가 스스로 조금 자신 있는 건 뭐야?"
        : "좋아. 그 방식은 계획에서 최대한 피할게.\n\n이번엔 네가 가진 쪽을 볼게. 주변에서 잘한다고 들었거나, 네가 스스로 조금 자신 있는 건 뭐야?";
      nextStep = "strength";
    } else if (step === "strength") {
      nextProfile.strength = value;
      noahReply = isNoPreferenceAnswer(value)
        ? "괜찮아. 아직 강점이 선명하지 않은 사람도 많아. 그럼 실전 훈련 안에서 네가 잘 버티는 방식과 빨리 이해하는 방식을 찾아볼게.\n\n평소 습관을 알려줘. 언제 집중이 잘 되고, 혼자가 편해 아니면 누가 같이 확인해줄 때 더 잘해?"
        : "좋아. 그건 말로 칭찬하기보다 계획과 실전 상황 안에 녹일게.\n\n평소 습관도 중요해. 언제 집중이 잘 되고, 혼자가 편해 아니면 누가 같이 확인해줄 때 더 잘해?";
      nextStep = "habit";
    } else if (step === "habit") {
      nextProfile.habit = value;
      noahReply = "좋아. 마지막으로 현실 시간을 맞춰보자.\n오늘 또는 평소에 이 꿈을 위해 실제로 쓸 수 있는 시간은 언제야?\n예: 오전 8시부터 8시 30분까지, 오후 4시부터 10시까지";
      nextStep = "time";
    } else if (step === "time") {
      nextProfile.time = value;
      const plan = buildExperiencePlan(nextProfile);
      setPlanItems(plan);
      setActiveView("plan");
      noahReply =
        "좋아. 이제 네 답변을 바탕으로 오늘 계획을 만들었어.\n\n" +
        "이번 구조는 단순 체크가 아니야.\n" +
        "오늘 계획 안에 실전 체험이 들어가 있어.\n\n" +
        "흐름은 이렇게 갈 거야.\n꿈 → 오늘 계획 → 실전 시뮬레이션 → 실행 → 인증 → 회고 → 다음 계획.\n\n" +
        "오늘 계획 화면에서 먼저 확인하고, 실전 체험 버튼을 눌러 상황 안으로 들어가자.";
      nextStep = "execute";
    } else {
      if (includesAny(value, ["실전", "체험", "연습"])) {
        setActiveView("simulation");
        noahReply = "좋아. 실전 체험으로 넘어갈게. 내가 상황을 만들고 상대 역할을 할게.";
      } else if (includesAny(value, ["회고", "돌아", "어땠"])) {
        setActiveView("review");
        noahReply = "좋아. 오늘 경험을 회고하면서 내일 계획으로 연결해보자.";
      } else {
        noahReply = "좋아. 지금 말한 것도 다음 계획에 반영할 수 있어. 오늘 계획이나 실전 체험에서 바로 이어가자.";
      }
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
    setMessages((prev) => [...prev, makeNoahMessage(`오늘 기분은 ${emotion.emoji} ${emotion.label}이구나. 오늘 계획 화면에서 행동 크기만 조정해뒀어.`)]);
    setActiveView("plan");
  };

  const openProofPicker = (index) => {
    if (planItems[index]?.status !== "open") return;
    pendingProofIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const markSimulationDone = () => {
    setPlanItems((prev) => {
      const simIndex = prev.findIndex((item) => item.phase === "simulation" && item.status !== "done");
      if (simIndex < 0) return prev;
      return unlockPlan(prev.map((item, index) => index === simIndex ? { ...item, status: "done" } : item));
    });
    setActiveView("plan");
  };

  const handleProofImage = (event) => {
    const file = event.target.files?.[0];
    const index = pendingProofIndexRef.current;
    if (!file || index === null || index === undefined) return;
    const url = URL.createObjectURL(file);
    setPlanItems((prev) => unlockPlan(prev.map((item, itemIndex) => itemIndex === index ? { ...item, status: "done", proofImage: url } : item)));
    setMessages((prev) => [...prev, makeNoahMessage(index >= planItems.length - 1 ? "좋아. 오늘 계획을 전부 증명했어. 이제 회고로 넘어가자." : "좋아. 하나 인증했어. 다음 계획이 열렸어.")]);
    pendingProofIndexRef.current = null;
    event.target.value = "";
  };

  const submitSimulation = () => {
    const value = simulationInput.trim();
    if (!value) return;

    const steps = scenario.steps || [scenario.opening, scenario.pressure];
    const nextTurn = simulation.turn + 1;
    const nextAiText = steps[nextTurn] ||
      "좋아. 지금 답변을 실제 행동으로 옮겨보자. 오늘 계획 화면으로 돌아가서 실행하고 인증하면 돼.";

    setSimulation((prev) => ({
      started: true,
      turn: nextTurn,
      messages: [
        ...prev.messages,
        { role: "user", text: value },
        { role: "noah", text: nextAiText },
      ],
    }));

    setSimulationInput("");

    if (nextTurn >= Math.max(4, steps.length - 1)) {
      setTimeout(markSimulationDone, 250);
    }
  };

  const startSimulation = () => {
    const steps = scenario.steps || [scenario.opening];
    setSimulation({
      started: true,
      turn: 0,
      messages: [{ role: "noah", text: steps[0] || scenario.opening }],
    });
  };

  const submitReview = () => {
    const text = reviewText.trim();
    if (!text) return;
    const nextAction = text.includes("어려") || text.includes("힘들") ? "내일은 오늘 막힌 부분 하나만 더 작게 쪼개서 다시 해보자." : "내일은 오늘 잘 된 행동을 한 번 더 반복해서 흐름을 만들자.";
    setMessages((prev) => [...prev, makeUserMessage(`회고: ${text}`), makeNoahMessage(`좋아. 오늘 회고 기억할게.\n\n${nextAction}`)]);
    setReviewText("");
    setActiveView("chat");
  };

  return (
    <div className="noah-experience-app">
      <style>{experienceStyles}</style>
      <aside className={`nx-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="nx-logo">NOAH</div>
        <button className={`nx-side-item ${activeView === "chat" ? "active" : ""}`} onClick={() => setActiveView("chat")}>노아 채팅</button>
        <button className={`nx-side-item ${activeView === "plan" ? "active" : ""}`} onClick={() => setActiveView("plan")}>오늘 계획</button>
        <button className={`nx-side-item ${activeView === "simulation" ? "active" : ""}`} onClick={() => setActiveView("simulation")}>실전 체험</button>
        <button className={`nx-side-item ${activeView === "review" ? "active" : ""}`} onClick={() => setActiveView("review")}>회고</button>
        <div className="nx-side-card"><span>현재 상태</span><strong>{progressText}</strong></div>
        {currentOpenIndex >= 0 ? <div className="nx-next"><span>다음 실행</span><b>{formatTimeKorean(planItems[currentOpenIndex]?.time)}</b><p>{planItems[currentOpenIndex]?.title}</p></div> : null}
      </aside>

      <main className="nx-main">
        <header className="nx-topbar">
          <button className="nx-icon" onClick={() => setSidebarOpen((v) => !v)}>☰</button>
          <div className="nx-brand"><span>NOAH</span><small>AI 실전 훈련장</small></div>
          <button className="nx-home" onClick={onBack}>홈</button>
        </header>

        {activeView === "chat" ? (
          <section className="nx-chat" ref={chatAreaRef}>
            <div className="nx-hero"><p>NOAH EXPERIENCE</p><h1>꿈을 말하고, 현실처럼 연습해</h1><span>계획만 주는 AI가 아니라 상황을 만들어 실전 경험까지 시켜줄게.</span></div>
            <div className="nx-messages">
              {messages.map((message, index) => <div key={index} className={`nx-message ${message.role}`}><div className="nx-avatar">{message.role === "noah" ? "🌙" : "나"}</div><div className="nx-bubble">{message.role === "noah" ? <div className="nx-label">NOAH · 경험 설계 중</div> : null}{message.text.split("\n").map((line, i) => <Fragment key={i}>{line}<br /></Fragment>)}</div></div>)}
              {getSuggestedReplies().length ? <div className="nx-suggestions">{getSuggestedReplies().map((reply) => <button key={reply} onClick={() => setInput(reply)}>{reply}</button>)}</div> : null}
              <div ref={chatBottomRef} />
            </div>
          </section>
        ) : activeView === "plan" ? (
          <PlanExperienceView planItems={planItems} completedCount={completedCount} onProof={openProofPicker} onSimulation={(item) => { setActiveSimulationItem(item); setSimulation({ started: false, turn: 0, messages: [] }); setActiveView("simulation"); }} emotionOptions={emotionOptions} activeEmotion={profile.emotion} onEmotion={selectEmotion} />
        ) : activeView === "simulation" ? (
          <SimulationView scenario={scenario} simulation={simulation} startSimulation={startSimulation} simulationInput={simulationInput} setSimulationInput={setSimulationInput} submitSimulation={submitSimulation} markSimulationDone={markSimulationDone} />
        ) : (
          <ReviewView reviewText={reviewText} setReviewText={setReviewText} submitReview={submitReview} profile={profile} planItems={planItems} />
        )}

        {activeView === "chat" ? <footer className="nx-composer"><div className="nx-input-shell"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="노아에게 말해보세요..." rows={1} /><button onClick={sendMessage}>➜</button></div></footer> : null}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleProofImage} hidden />
      </main>
    </div>
  );
}

function PlanExperienceView({ planItems, completedCount, onProof, onSimulation, emotionOptions, activeEmotion, onEmotion }) {
  const emotion = getEmotionById(activeEmotion);
  return <section className="nx-page"><div className="nx-page-head"><p>TODAY PLAN</p><h1>오늘 계획</h1><span>오늘 계획 안에 실전 체험이 들어가 있어. 연습하고, 실행하고, 인증하고, 회고까지 이어가.</span></div>{planItems.length === 0 ? <div className="nx-empty"><h2>아직 오늘 계획이 없어.</h2><p>노아 채팅에서 꿈과 시간을 말하면 계획과 실전 상황을 만들어줄게.</p></div> : <div className="nx-plan-board"><div className="nx-emotion-card"><div><h2>오늘 기분은 어때?</h2><p>목표는 그대로 두고 오늘 행동의 크기만 조정할게.</p></div><div className="nx-emotion-grid">{emotionOptions.map((item) => <button key={item.id} className={activeEmotion === item.id ? "selected" : ""} onClick={() => onEmotion(item.id)}><span>{item.emoji}</span><strong>{item.label}</strong><small>{item.mode}</small></button>)}</div>{activeEmotion ? <p className="nx-emotion-result">오늘 상태: {emotion.emoji} {emotion.label}</p> : null}</div><div className="nx-progress"><span>오늘 완료</span><strong>{completedCount}/{planItems.length}</strong></div>{planItems.map((item, index) => <article key={item.id} className={`nx-plan-card ${item.status} ${item.phase}`}><div className="nx-plan-time"><strong>{formatTimeKorean(item.time)}</strong><span>{item.phase === "simulation" ? "실전 체험" : item.phase === "review" ? "회고" : "실행"}</span></div><p>{item.title}</p>{item.proofImage ? <img src={item.proofImage} alt="인증 사진" /> : null}{item.phase === "simulation" ? <button disabled={item.status === "locked"} onClick={() => onSimulation(item)}>{item.status === "done" ? "실전 완료" : item.status === "open" ? "실전 체험 시작" : "이전 계획 필요"}</button> : <button disabled={item.status !== "open"} onClick={() => onProof(index)}>{item.status === "done" ? "인증 완료" : item.status === "open" ? "사진 인증" : "이전 계획 인증 필요"}</button>}</article>)}</div>}</section>;
}

function SimulationView({ scenario, simulation, startSimulation, simulationInput, setSimulationInput, submitSimulation, markSimulationDone }) {
  const steps = scenario.steps || [scenario.opening, scenario.pressure, scenario.good];
  const totalSteps = Math.max(5, steps.length);
  const currentStep = simulation.started ? Math.min(totalSteps, simulation.turn + 1) : 0;
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <section className="nx-page nx-sim-page">
      <div className="nx-page-head">
        <p>PLAN BASED REAL EXPERIENCE</p>
        <h1>오늘 계획 실전 체험</h1>
        <span>오늘 계획을 그냥 읽는 게 아니라, 목표로 가는 길에서 생길 수 있는 예상치 못한 상황을 상대방과 대화하듯 연습해.</span>
      </div>

      <div className="nx-sim-grid">
        <div className="nx-scene">
          <video autoPlay muted loop playsInline poster={scenario.poster}>
            <source src={scenario.video} type="video/mp4" />
          </video>
          <div className="nx-scene-fallback">
            <div className="nx-scene-orb" />
            <h2>{scenario.title}</h2>
            <p>{scenario.location}</p>
          </div>
          <div className="nx-scene-caption">
            <span>오늘 계획 기반 상황</span>
            <strong>{scenario.planTitle || scenario.title}</strong>
            <p>{scenario.role}와 실제처럼 대화하는 중</p>
          </div>
        </div>

        <div className="nx-roleplay nx-real-chat-panel">
          <div className="nx-role-head nx-chat-opponent-head">
            <div>
              <span>실전 상대</span>
              <strong>{scenario.role}</strong>
            </div>
            <em>{currentStep}/{totalSteps}</em>
          </div>

          <div className="nx-sim-progress-bar">
            <i style={{ width: `${percent}%` }} />
          </div>

          <div className="nx-situation-card">
            <b>상황</b>
            <p>{scenario.title}</p>
            <small>계획: {scenario.planTitle}</small>
          </div>

          {!simulation.started ? (
            <div className="nx-start-box nx-chat-start-box">
              <p>지금부터 노아가 실제 상대 역할을 할게. 답을 맞히는 게 아니라, 현실에서 당황하지 않도록 미리 경험하는 거야.</p>
              <button onClick={startSimulation}>상대방과 대화 시작</button>
            </div>
          ) : (
            <div className="nx-sim-chat nx-real-chat">
              {simulation.messages.map((message, index) => (
                <div key={index} className={`nx-sim-msg ${message.role}`}>
                  <span>{message.role === "noah" ? scenario.role : "나"}</span>
                  <p>{message.text}</p>
                </div>
              ))}

              <div className="nx-sim-input nx-real-chat-input">
                <textarea
                  value={simulationInput}
                  onChange={(e) => setSimulationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitSimulation();
                    }
                  }}
                  placeholder="실제 상대에게 말하듯 답해봐..."
                  rows={3}
                />
                <button onClick={submitSimulation}>보내기</button>
              </div>

              <button className="nx-secondary" onClick={markSimulationDone}>실전 체험 완료</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewView({ reviewText, setReviewText, submitReview, profile, planItems }) {
  const done = planItems.filter((item) => item.status === "done").length;
  return <section className="nx-page"><div className="nx-page-head"><p>REVIEW</p><h1>회고</h1><span>실전에서 막힌 지점이 다음 계획의 재료가 돼.</span></div><div className="nx-review-card"><h2>{profile.name || "우리"}, 오늘 어땠어?</h2><p>완료한 것: {done}개. 가장 어려웠던 순간, 잘 된 점, 내일 바꿀 점을 편하게 적어줘.</p><textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="예: 고객 질문에 답하는 게 어려웠어. 다음엔 더 짧게 말하고 싶어." rows={6} /><button onClick={submitReview}>회고 저장하고 다음 계획으로 연결</button></div></section>;
}

const experienceStyles = `
*{box-sizing:border-box}html,body,#root{width:100%;height:100%;margin:0;overflow:hidden}body{background:#080a14;font-family:Inter,Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,textarea{font-family:inherit}.noah-experience-app{height:100vh;color:rgba(255,255,255,.92);background:radial-gradient(circle at 22% 8%,rgba(168,85,247,.22),transparent 28%),radial-gradient(circle at 78% 10%,rgba(96,165,250,.18),transparent 30%),linear-gradient(180deg,#080a14 0%,#0b1020 46%,#101322 100%);display:flex;overflow:hidden}.nx-sidebar{width:292px;height:100vh;overflow-y:auto;padding:24px 18px;border-right:1px solid rgba(255,255,255,.08);background:rgba(8,10,20,.78);backdrop-filter:blur(22px);z-index:10}.nx-logo{letter-spacing:.35em;font-size:18px;font-weight:900;margin:0 0 34px 8px}.nx-side-item{width:100%;border:0;color:rgba(255,255,255,.72);background:transparent;text-align:left;padding:15px 16px;border-radius:16px;cursor:pointer;margin-bottom:8px;font-weight:850}.nx-side-item.active,.nx-side-item:hover{background:rgba(255,255,255,.09);color:white}.nx-side-card,.nx-next{margin-top:24px;padding:18px;border-radius:22px;background:linear-gradient(135deg,rgba(168,85,247,.22),rgba(96,165,250,.14));border:1px solid rgba(255,255,255,.1)}.nx-side-card span,.nx-next span{display:block;font-size:12px;color:rgba(255,255,255,.58);margin-bottom:8px}.nx-next{background:rgba(255,255,255,.055)}.nx-next b{display:block;margin:8px 0}.nx-next p{margin:0;color:rgba(255,255,255,.76);font-size:13px;line-height:1.55}.nx-main{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;height:100vh;overflow:hidden}.nx-topbar{height:72px;flex:0 0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;z-index:5;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(8,10,20,.42);backdrop-filter:blur(18px)}.nx-icon{width:42px;height:42px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:white;border-radius:14px;cursor:pointer}.nx-brand{display:flex;flex-direction:column;align-items:center;gap:2px}.nx-brand span{letter-spacing:.28em;font-weight:900}.nx-brand small{color:rgba(255,255,255,.48);font-size:12px}.nx-home{padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.78);font-size:13px;border:1px solid rgba(255,255,255,.09);cursor:pointer;font-weight:800}.nx-chat{flex:1;overflow-y:auto;padding:34px 22px 150px;scroll-behavior:smooth}.nx-hero{max-width:880px;margin:0 auto 28px;text-align:center}.nx-hero p,.nx-page-head p{margin:0 0 8px;color:rgba(255,255,255,.48);letter-spacing:.28em;font-size:12px;font-weight:900}.nx-hero h1,.nx-page-head h1{margin:0;font-size:clamp(34px,5vw,62px);letter-spacing:-.06em;line-height:1.05}.nx-hero span,.nx-page-head span{display:block;margin-top:14px;color:rgba(255,255,255,.58)}.nx-messages{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:18px}.nx-message{display:flex;gap:12px;align-items:flex-start}.nx-message.user{flex-direction:row-reverse}.nx-avatar{flex:0 0 auto;width:38px;height:38px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);font-size:14px}.nx-bubble{max-width:min(720px,78vw);padding:18px 20px;border-radius:24px;line-height:1.78;color:rgba(255,255,255,.9);background:rgba(255,255,255,.14)}.nx-message.noah .nx-bubble{background:linear-gradient(135deg,rgba(255,255,255,.09),rgba(168,85,247,.09));border:1px solid rgba(255,255,255,.09);backdrop-filter:blur(18px)}.nx-label{font-size:12px;color:rgba(255,255,255,.44);margin-bottom:8px}.nx-suggestions{display:flex;gap:10px;flex-wrap:wrap;padding-left:50px}.nx-suggestions button{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);border-radius:999px;padding:11px 14px;cursor:pointer}.nx-composer{position:absolute;left:0;right:0;bottom:0;padding:20px 22px 28px;background:linear-gradient(180deg,transparent,rgba(8,10,20,.88) 34%,rgba(8,10,20,.98));z-index:6}.nx-input-shell{max-width:900px;margin:0 auto;min-height:62px;border-radius:26px;padding:10px 10px 10px 20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;gap:12px;backdrop-filter:blur(22px);box-shadow:0 24px 80px rgba(0,0,0,.25)}.nx-input-shell textarea{flex:1;resize:none;border:0;outline:none;color:white;background:transparent;font-size:16px;line-height:1.45;max-height:120px}.nx-input-shell button,.nx-plan-card button,.nx-start-box button,.nx-sim-input button,.nx-review-card button{border:0;border-radius:18px;cursor:pointer;color:white;font-weight:900;background:linear-gradient(135deg,rgba(168,85,247,.95),rgba(96,165,250,.9));padding:14px 18px}.nx-page{flex:1;overflow-y:auto;padding:40px 34px 80px}.nx-page-head{max-width:1080px;margin:0 auto 24px}.nx-empty,.nx-plan-board,.nx-review-card{max-width:1080px;margin:0 auto;padding:24px;border-radius:30px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(22px)}.nx-emotion-card{padding:20px;border-radius:24px;background:rgba(0,0,0,.16);border:1px solid rgba(255,255,255,.08);margin-bottom:18px}.nx-emotion-card h2{margin:0 0 8px}.nx-emotion-card p{margin:0;color:rgba(255,255,255,.62);line-height:1.65}.nx-emotion-grid{margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.nx-emotion-grid button{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.07);color:white;border-radius:18px;padding:14px 10px;cursor:pointer;display:flex;flex-direction:column;gap:4px}.nx-emotion-grid button.selected{background:rgba(96,165,250,.18);border-color:rgba(96,165,250,.45)}.nx-progress{display:flex;justify-content:space-between;align-items:center;margin:18px 0;color:rgba(255,255,255,.7)}.nx-plan-card{padding:18px;border-radius:24px;background:rgba(255,255,255,.065);border:1px solid rgba(255,255,255,.09);margin-bottom:14px}.nx-plan-card.open{border-color:rgba(96,165,250,.45);background:rgba(96,165,250,.09)}.nx-plan-card.done{border-color:rgba(52,211,153,.42);background:rgba(52,211,153,.08)}.nx-plan-card.locked{opacity:.45}.nx-plan-time{display:flex;justify-content:space-between;align-items:center;gap:12px}.nx-plan-time strong{font-size:18px}.nx-plan-time span{font-size:12px;color:rgba(255,255,255,.58)}.nx-plan-card p{line-height:1.65;color:rgba(255,255,255,.84)}.nx-plan-card img{width:90px;height:90px;object-fit:cover;border-radius:18px;display:block;margin-bottom:12px}.nx-plan-card button:disabled{opacity:.42;cursor:not-allowed;background:rgba(255,255,255,.14)}.nx-sim-grid{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:22px}.nx-scene,.nx-roleplay{border-radius:30px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.1);overflow:hidden;min-height:520px;position:relative}.nx-scene video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}.nx-scene-fallback{position:absolute;inset:0;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 50% 28%,rgba(96,165,250,.34),transparent 32%),linear-gradient(135deg,rgba(15,23,42,.95),rgba(88,28,135,.52),rgba(8,10,20,.95))}.nx-scene-orb{width:160px;height:160px;border-radius:999px;background:rgba(255,255,255,.12);filter:blur(10px);box-shadow:0 0 90px rgba(125,211,252,.32);margin:auto}.nx-scene-fallback h2{position:absolute;bottom:110px;left:28px;right:28px;font-size:38px;letter-spacing:-.04em}.nx-scene-fallback p{position:absolute;bottom:82px;left:28px;right:28px;color:rgba(255,255,255,.68)}.nx-scene-caption{position:absolute;left:22px;right:22px;bottom:22px;padding:18px;border-radius:22px;background:rgba(0,0,0,.32);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.12)}.nx-scene-caption span{color:rgba(255,255,255,.58);font-size:12px}.nx-scene-caption strong{display:block;margin:6px 0;font-size:20px}.nx-scene-caption p{margin:0;color:rgba(255,255,255,.68)}.nx-roleplay{padding:22px;overflow-y:auto}.nx-role-head span{display:block;color:rgba(255,255,255,.5);font-size:12px;margin-bottom:6px}.nx-role-head strong{font-size:22px}.nx-start-box{margin-top:24px;padding:20px;border-radius:24px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.08)}.nx-start-box p{line-height:1.75}.nx-sim-chat{margin-top:22px;display:flex;flex-direction:column;gap:14px}.nx-sim-msg{padding:14px 16px;border-radius:20px;background:rgba(255,255,255,.08)}.nx-sim-msg.user{background:rgba(96,165,250,.14)}.nx-sim-msg span{display:block;font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px}.nx-sim-msg p{margin:0;line-height:1.65}.nx-sim-input{display:flex;gap:10px;align-items:flex-end}.nx-sim-input textarea,.nx-review-card textarea{flex:1;width:100%;resize:vertical;border:1px solid rgba(255,255,255,.1);outline:none;color:white;background:rgba(255,255,255,.07);border-radius:18px;padding:14px;font-size:15px;line-height:1.55}.nx-secondary{background:rgba(255,255,255,.12)!important;border:1px solid rgba(255,255,255,.12)!important}.nx-review-card h2{font-size:28px;margin:0 0 10px}.nx-review-card p{color:rgba(255,255,255,.66);line-height:1.7}.nx-review-card textarea{margin:18px 0}.nx-real-chat-panel{display:flex;flex-direction:column}.nx-chat-opponent-head{display:flex;align-items:center;justify-content:space-between;gap:18px}.nx-chat-opponent-head em{font-style:normal;font-weight:900;color:white;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:8px 12px}.nx-sim-progress-bar{height:10px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden;margin:18px 0}.nx-sim-progress-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(135deg,rgba(168,85,247,.95),rgba(96,165,250,.9));transition:width .28s ease}.nx-situation-card{padding:16px;border-radius:20px;background:linear-gradient(135deg,rgba(168,85,247,.18),rgba(96,165,250,.12));border:1px solid rgba(255,255,255,.09);margin-bottom:16px}.nx-situation-card b{display:block;font-size:12px;color:rgba(255,255,255,.58);margin-bottom:8px}.nx-situation-card p{margin:0 0 6px;font-size:18px;font-weight:900}.nx-situation-card small{color:rgba(255,255,255,.62);line-height:1.5}.nx-chat-start-box p{font-size:17px}.nx-real-chat{flex:1;overflow-y:auto;padding-right:4px}.nx-real-chat .nx-sim-msg{max-width:86%}.nx-real-chat .nx-sim-msg.user{align-self:flex-end;background:rgba(96,165,250,.22);border:1px solid rgba(96,165,250,.18)}.nx-real-chat .nx-sim-msg.noah{align-self:flex-start;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}.nx-real-chat-input{position:sticky;bottom:0;background:rgba(15,23,42,.82);backdrop-filter:blur(18px);padding-top:12px}.nx-real-chat-input textarea{min-height:72px}@media(max-width:920px){.noah-experience-app{display:block;overflow:auto}.nx-sidebar{width:100%;height:auto;max-height:280px;border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.nx-main{height:calc(100vh - 280px);min-height:650px}.nx-sim-grid{grid-template-columns:1fr}.nx-scene,.nx-roleplay{min-height:390px}.nx-emotion-grid{grid-template-columns:repeat(2,1fr)}.nx-chat{padding:28px 14px 150px}.nx-bubble{max-width:82vw}.nx-suggestions{padding-left:0}}
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
