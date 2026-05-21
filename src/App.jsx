import React, { useMemo, useRef, useState } from "react";

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

function adjustPlanByEmotion(plan, emotionId) {
  const emotion = getEmotionById(emotionId);
  const cleanPlan = String(plan || "").trim();

  if (!cleanPlan) {
    if (emotion.id === "fire") return "오늘은 목표와 연결된 행동을 20분 실행하고, 끝나면 사진으로 남기기";
    if (emotion.id === "calm") return "오늘은 목표와 연결된 행동을 10분 실행하고, 끝나면 사진으로 남기기";
    return "오늘은 목표와 연결된 행동을 3분만 시작하고, 끝나면 사진으로 남기기";
  }

  if (emotion.id === "fire") {
    return `${cleanPlan}\n\n오늘은 컨디션이 좋아 보여. 가능하면 마지막에 5분만 더 해보자.`;
  }

  if (emotion.id === "calm") {
    return `${cleanPlan}\n\n오늘은 원래 계획 그대로 가도 괜찮아.`;
  }

  if (emotion.id === "anxious") {
    return `${cleanPlan}\n\n오늘은 불안을 줄이기 위해 계획을 절반으로 줄이자. 완벽보다 시작이 먼저야.`;
  }

  if (emotion.id === "tired") {
    return `${cleanPlan}\n\n오늘은 지친 날이니까 3분만 하자. 흐름만 지키면 충분해.`;
  }

  if (emotion.id === "stress") {
    return `${cleanPlan}\n\n오늘은 복잡하게 하지 말고 가장 쉬운 행동 하나만 끝내자.`;
  }

  return `${cleanPlan}\n\n오늘은 집중이 안 되는 날이니까 타이머 5분만 켜고 시작만 하자.`;
}

export default function App() {
  const [messages, setMessages] = useState([firstNoahMessage]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("name");
  const [profile, setProfile] = useState({
    name: "",
    dream: "",
    wantsIt: "",
    plan: "",
    emotion: "",
    adjustedPlan: "",
    proofImage: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmotionPanel, setShowEmotionPanel] = useState(false);
  const [showProofPanel, setShowProofPanel] = useState(false);
  const fileInputRef = useRef(null);

  const progressText = useMemo(() => {
    if (!profile.name) return "처음 만나는 중";
    if (!profile.dream) return `${profile.name}의 꿈을 찾는 중`;
    if (!profile.plan) return `${profile.name}의 계획을 만드는 중`;
    if (!profile.proofImage) return "오늘의 실행을 준비 중";
    return "오늘 한 걸음 완료";
  }, [profile]);

  const sendMessage = () => {
    const value = input.trim();
    if (!value) return;

    const nextMessages = [...messages, makeUserMessage(value)];
    let noahReply = "";
    let nextStep = step;
    const nextProfile = { ...profile };

    if (step === "name") {
      nextProfile.name = value;
      noahReply = `좋네, ${value}.\n이제 진짜 중요한 걸 물어볼게.\n\n너는 뭘 이루고 싶어?\n하고 싶은 게 뭐고, 달성하고 싶은 목표가 뭐야?\n아, 꿈은?`;
      nextStep = "dream";
    } else if (step === "dream") {
      nextProfile.dream = value;
      noahReply = `좋아. ${nextProfile.name}, 네가 말한 꿈 기억할게.\n\n그 목표 혹은 꿈을 정말 이루고 싶은 거지?`;
      nextStep = "confirmDream";
    } else if (step === "confirmDream") {
      nextProfile.wantsIt = value;
      noahReply =
        "가능해. 무조건 말이야.\n\n내가 너를 거기에 좀 더 빠르게 데려다줄 뿐이지.\n다시 한번 말해줄게.\n\n너는 갈 수 있어.\n그 이유는 네가 이미 달라졌기 때문이야.\n나를 찾아왔잖아.\n\n그럼 현실적으로 물어볼게.\n네가 그 목표 혹은 꿈을 이루기 위해서 세운 설정하고 계획이 있어?\n구체적으로 시간까지 적어줘!";
      nextStep = "plan";
    } else if (step === "plan") {
      const hasNoPlan =
        value.includes("없") ||
        value.includes("몰라") ||
        value.includes("아직") ||
        value.length < 6;

      if (hasNoPlan) {
        nextProfile.plan = "";
        noahReply =
          "좋아. 그럼 나와 설정하고 계획부터 시작해볼까?\n\n먼저 오늘 기준으로 아주 작게 잡자.\n예를 들어 이렇게 적어줘.\n\n“20:00에 목표와 관련된 행동 10분 하기”";
        nextStep = "plan";
      } else {
        nextProfile.plan = value;
        noahReply =
          `좋아. 이 계획을 실행 흐름에 넣을게.\n\n오늘 계획:\n${value}\n\n실행하기 전에 오늘 기분을 먼저 확인하자.\n기분에 따라서 계획을 조금 줄이거나 늘릴게.`;
        nextStep = "emotion";
        setShowEmotionPanel(true);
      }
    } else {
      noahReply =
        "좋아. 지금은 네 계획을 실행하는 흐름이야.\n오늘 기분을 고르고, 조정된 계획을 실행한 뒤 사진으로 증명하면 다음으로 넘어갈 수 있어.";
      setShowEmotionPanel(true);
    }

    setProfile(nextProfile);
    setMessages([...nextMessages, makeNoahMessage(noahReply)]);
    setStep(nextStep);
    setInput("");
  };

  const selectEmotion = (emotionId) => {
    const emotion = getEmotionById(emotionId);
    const adjusted = adjustPlanByEmotion(profile.plan, emotionId);

    setProfile((prev) => ({
      ...prev,
      emotion: emotionId,
      adjustedPlan: adjusted,
    }));

    setMessages((prev) => [
      ...prev,
      makeUserMessage(`${emotion.emoji} ${emotion.label}`),
      makeNoahMessage(
        `오늘 기분은 ${emotion.emoji} ${emotion.label}이구나.\n\n좋아. 오늘은 이렇게 조정해서 가자.\n\n${adjusted}\n\n끝나면 사진으로 증명해줘.\n사진 인증을 해야 다음 계획으로 넘어갈 수 있어.`
      ),
    ]);

    setShowEmotionPanel(false);
    setShowProofPanel(true);
    setStep("proof");
  };

  const handleProofImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      proofImage: url,
    }));

    setMessages((prev) => [
      ...prev,
      makeUserMessage("사진 인증 완료"),
      makeNoahMessage(
        `좋아, ${profile.name || "우리"}.\n오늘 한 걸음 갔네.\n\n완벽해서가 아니라 실제로 움직였기 때문에 의미 있는 거야.\n이렇게 쌓이면 네 꿈은 점점 현실에 가까워져.`
      ),
    ]);

    setShowProofPanel(false);
    setStep("done");
  };

  const askFeedback = (type) => {
    const replies = {
      relation:
        "사람 관계에서는 이기는 말보다 얻는 태도가 더 중요해.\n상대를 바꾸려 하기 전에 먼저 그 사람이 왜 그렇게 반응했는지 봐야 해.\n오늘 할 수 있는 행동은 하나야. 먼저 이해하려는 질문 하나를 던져봐.",
      money:
        "돈은 단순히 많이 버는 문제가 아니라 구조의 문제야.\n시간을 팔고 있는지, 자산이 쌓이는 구조를 만들고 있는지 봐야 해.\n오늘은 네가 반복해서 돈을 만들 수 있는 작은 구조 하나를 적어보자.",
      dream:
        "꿈은 크게 가져도 돼. 대신 행동은 작아야 해.\n큰 꿈을 한 번에 이루려 하면 멈추지만, 작은 행동을 반복하면 결국 도착해.\n오늘은 꿈을 증명하는 행동 하나만 하자.",
    };

    setMessages((prev) => [
      ...prev,
      makeUserMessage(type === "relation" ? "인간관계 피드백" : type === "money" ? "돈/사업 피드백" : "꿈/실행 피드백"),
      makeNoahMessage(replies[type]),
    ]);
  };

  return (
    <div className="noah-app">
      <style>{styles}</style>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="side-logo">NOAH</div>
        <button className="side-item active">오늘 대화</button>
        <button className="side-item">내 목표</button>
        <button className="side-item">오늘 계획</button>
        <button className="side-item">설정</button>

        <div className="side-card">
          <span>현재 상태</span>
          <strong>{progressText}</strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen((v) => !v)}>
            ☰
          </button>
          <div className="brand">
            <span>NOAH</span>
            <small>오늘도 같이</small>
          </div>
          <div className="top-pill">꿈을 행동으로</div>
        </header>

        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="stars" />

        <section className="chat-area">
          <div className="hero-title">
            <p>NOAH</p>
            <h1>조용히, 같이 걸어가는 AI</h1>
            <span>꿈은 멀리 보되 오늘 행동은 아주 작게.</span>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message-row ${message.role}`}>
                <div className="avatar">{message.role === "noah" ? "🌙" : "나"}</div>
                <div className="bubble">
                  {message.role === "noah" && <div className="bubble-label">NOAH · 함께 가는 중</div>}
                  {message.text.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {showEmotionPanel && (
            <div className="panel">
              <div>
                <h3>오늘 기분은 어때?</h3>
                <p>기분에 따라 계획 강도를 조정할게.</p>
              </div>
              <div className="emotion-grid">
                {emotionOptions.map((emotion) => (
                  <button key={emotion.id} onClick={() => selectEmotion(emotion.id)}>
                    <span>{emotion.emoji}</span>
                    <strong>{emotion.label}</strong>
                    <small>{emotion.mode}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showProofPanel && (
            <div className="panel proof-panel">
              <div>
                <h3>사진으로 오늘 행동을 증명해줘</h3>
                <p>사진 인증을 해야 다음 계획으로 넘어갈 수 있어.</p>
              </div>

              {profile.adjustedPlan && (
                <div className="today-plan">
                  <span>오늘 조정된 계획</span>
                  <p>{profile.adjustedPlan}</p>
                </div>
              )}

              <button className="proof-btn" onClick={() => fileInputRef.current?.click()}>
                사진 촬영 또는 업로드
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleProofImage}
                hidden
  

          {profile.proofImage && (
            <div className="proof-preview">
              <img src={profile.proofImage} alt="오늘의 인증" />
              <div>
                <strong>오늘 인증 완료</strong>
                <p>좋아. 이게 네가 실제로 움직였다는 증거야.</p>
              </div>
            </div>
          )}

          <div className="feedback-row">
            <button onClick={() => askFeedback("relation")}>인간관계 피드백</button>
            <button onClick={() => askFeedback("money")}>돈/사업 피드백</button>
            <button onClick={() => askFeedback("dream")}>꿈/실행 피드백</button>
          </div>
        </section>

        <footer className="composer">
          <div className="input-shell">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="노아에게 말해보세요..."
              rows={1}
            />
            <button onClick={sendMessage}>➜</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

const styles = `
* { box-sizing: border-box; }
html, body, #root { width: 100%; min-height: 100%; margin: 0; }
body { background: #080a14; font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
button, textarea { font-family: inherit; }
.noah-app { min-height: 100vh; color: rgba(255,255,255,0.92); background: radial-gradient(circle at 22% 8%, rgba(168,85,247,0.22), transparent 28%), radial-gradient(circle at 78% 10%, rgba(96,165,250,0.18), transparent 30%), linear-gradient(180deg, #080a14 0%, #0b1020 46%, #101322 100%); display: flex; overflow: hidden; position: relative; }
.sidebar { width: 280px; padding: 24px; border-right: 1px solid rgba(255,255,255,0.08); background: rgba(8,10,20,0.72); backdrop-filter: blur(22px); z-index: 10; }
.side-logo { letter-spacing: 0.35em; font-size: 18px; font-weight: 800; margin-bottom: 34px; }
.side-item { width: 100%; border: 0; color: rgba(255,255,255,0.68); background: transparent; text-align: left; padding: 13px 14px; border-radius: 16px; cursor: pointer; margin-bottom: 6px; }
.side-item.active, .side-item:hover { background: rgba(255,255,255,0.08); color: white; }
.side-card { margin-top: 28px; padding: 18px; border-radius: 22px; background: linear-gradient(135deg, rgba(168,85,247,0.22), rgba(96,165,250,0.14)); border: 1px solid rgba(255,255,255,0.1); }
.side-card span { display: block; font-size: 12px; color: rgba(255,255,255,0.58); margin-bottom: 8px; }
.side-card strong { font-size: 15px; }
.main { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; height: 100vh; }
.topbar { height: 72px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; z-index: 5; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(8,10,20,0.42); backdrop-filter: blur(18px); }
.icon-btn { width: 42px; height: 42px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; border-radius: 14px; cursor: pointer; }
.brand { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.brand span { letter-spacing: 0.28em; font-weight: 800; }
.brand small { color: rgba(255,255,255,0.48); font-size: 12px; }
.top-pill { padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.72); font-size: 13px; }
.aurora { position: absolute; width: 420px; height: 420px; border-radius: 999px; filter: blur(70px); opacity: 0.42; animation: float 11s ease-in-out infinite alternate; pointer-events: none; }
.aurora-one { left: 16%; top: 8%; background: rgba(168,85,247,0.34); }
.aurora-two { right: 8%; top: 28%; background: rgba(125,211,252,0.22); animation-delay: 1.8s; }
.stars { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px); background-size: 120px 120px, 190px 190px; opacity: 0.16; pointer-events: none; }
@keyframes float { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(22px,28px,0) scale(1.08); } }
.chat-area { flex: 1; overflow-y: auto; padding: 44px 22px 160px; z-index: 2; }
.hero-title { max-width: 760px; margin: 0 auto 28px; text-align: center; }
.hero-title p { margin: 0 0 8px; color: rgba(255,255,255,0.48); letter-spacing: 0.35em; font-size: 13px; }
.hero-title h1 { margin: 0; font-size: clamp(34px,5vw,64px); letter-spacing: -0.06em; line-height: 1.05; }
.hero-title span { display: block; margin-top: 16px; color: rgba(255,255,255,0.58); }
.messages { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
.message-row { display: flex; gap: 12px; align-items: flex-start; }
.message-row.user { flex-direction: row-reverse; }
.avatar { flex: 0 0 auto; width: 38px; height: 38px; border-radius: 14px; display: grid; place-items: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08); font-size: 14px; }
.bubble { max-width: min(680px,78vw); padding: 18px 20px; border-radius: 24px; line-height: 1.75; color: rgba(255,255,255,0.88); }
.message-row.noah .bubble { background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(168,85,247,0.09)); border: 1px solid rgba(255,255,255,0.09); backdrop-filter: blur(18px); box-shadow: 0 24px 80px rgba(0,0,0,0.18); }
.message-row.user .bubble { background: rgba(255,255,255,0.14); }
.bubble-label { font-size: 12px; color: rgba(255,255,255,0.44); margin-bottom: 8px; }
.panel, .proof-preview { max-width: 860px; margin: 18px auto 0; padding: 22px; border-radius: 28px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(22px); }
.panel h3 { margin: 0 0 6px; font-size: 21px; }
.panel p { margin: 0; color: rgba(255,255,255,0.58); line-height: 1.65; }
.emotion-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.emotion-grid button { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.07); color: white; border-radius: 20px; padding: 16px 12px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: transform 160ms ease, background 160ms ease; }
.emotion-grid button:hover { transform: translateY(-2px); background: rgba(255,255,255,0.11); }
.emotion-grid span { font-size: 24px; }
.emotion-grid small { color: rgba(255,255,255,0.48); }
.today-plan { margin-top: 16px; padding: 16px; border-radius: 20px; background: rgba(0,0,0,0.18); }
.today-plan span { display: block; font-size: 12px; color: rgba(255,255,255,0.48); margin-bottom: 8px; }
.today-plan p { color: rgba(255,255,255,0.88); white-space: pre-line; }
.proof-btn { margin-top: 18px; width: 100%; border: 0; background: linear-gradient(135deg, rgba(168,85,247,0.9), rgba(96,165,250,0.86)); color: white; padding: 16px 18px; border-radius: 18px; cursor: pointer; font-weight: 800; }
.proof-preview { display: flex; gap: 16px; align-items: center; }
.proof-preview img { width: 92px; height: 92px; border-radius: 22px; object-fit: cover; }
.proof-preview strong { display: block; margin-bottom: 6px; }
.proof-preview p { margin: 0; color: rgba(255,255,255,0.58); 
.feedback-row { max-width: 860px; margin: 18px auto 0; display: flex; gap: 10px; flex-wrap: wrap; }
.feedback-row button { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); border-radius: 999px; padding: 11px 14px; cursor: pointer; }
.composer { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px 22px 28px; background: linear-gradient(180deg, transparent, rgba(8,10,20,0.88) 34%, rgba(8,10,20,0.98)); z-index: 6; }
.input-shell { max-width: 860px; margin: 0 auto; min-height: 62px; border-radius: 26px; padding: 10px 10px 10px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; gap: 12px; backdrop-filter: blur(22px); box-shadow: 0 24px 80px rgba(0,0,0,0.25); }
.input-shell textarea { flex: 1; resize: none; border: 0; outline: none; color: white; background: transparent; font-size: 16px; line-height: 1.45; max-height: 120px; }
.input-shell textarea::placeholder { color: rgba(255,255,255,0.42); }
.input-shell button { width: 46px; height: 46px; border: 0; border-radius: 18px; cursor: pointer; color: white; font-size: 20px; background: linear-gradient(135deg, rgba(168,85,247,0.95), rgba(96,165,250,0.9)); }
@media (max-width: 860px) { .sidebar { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%); transition: transform 220ms ease; } .sidebar.open { transform: translateX(0); } .topbar { height: 66px; padding: 0 14px; } .top-pill { display: none; } .chat-area { padding: 34px 14px 150px; } .hero-title h1 { font-size: 36px; } .hero-title { margin-bottom: 24px; } .message-row { gap: 9px; } .bubble { max-width: 82vw; padding: 15px 16px; border-radius: 21px; font-size: 15px; } .emotion-grid { grid-template-columns: repeat(2, 1fr); } .feedback-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; } .feedback-row button { flex: 0 0 auto; } .composer { padding: 16px 12px 20px; } }
