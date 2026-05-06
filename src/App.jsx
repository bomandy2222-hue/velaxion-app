import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase.js";







const mobileCss = `
  * { box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100%; overflow-x: hidden; }
  body { margin: 0; }
  video, img { max-width: 100%; }

  @media (min-width: 1025px) {
    body { background: #dfe6ef; }
    input, textarea { font-size: 15px !important; }
  }

  @media (max-width: 760px) {
    input, textarea { font-size: 16px !important; }

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
      border-radius: 0 0 22px 22px !important;
      padding: 13px 15px !important;
      background: rgba(5, 10, 20, 0.96) !important;
      backdrop-filter: blur(16px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
    }

    header > div:first-child {
      font-size: 20px !important;
      letter-spacing: 0.18em !important;
      white-space: nowrap !important;
    }

    header > div:last-child {
      display: flex !important;
      gap: 6px !important;
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

    /* 모바일 첫 영상 영역 */
    section:first-of-type {
      padding: 18px 14px 30px !important;
      min-height: auto !important;
      background: linear-gradient(180deg, #05070d 0%, #070b14 68%, #141a22 100%) !important;
    }

    section:first-of-type > div {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 14px !important;
      padding: 0 !important;
      height: auto !important;
      min-height: 0 !important;
    }

    section:first-of-type > div > div {
      position: relative !important;
      height: 178px !important;
      min-height: 178px !important;
      aspect-ratio: auto !important;
      border-radius: 22px !important;
      overflow: hidden !important;
      box-shadow: 0 18px 44px rgba(0,0,0,0.32) !important;
    }

    section:first-of-type video {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      opacity: 0.72 !important;
    }

    section:first-of-type > div > div > div:last-child {
      position: absolute !important;
      left: 18px !important;
      right: 18px !important;
      bottom: 18px !important;
      top: auto !important;
      z-index: 5 !important;
      padding: 0 !important;
      display: block !important;
      overflow: visible !important;
    }

    section:first-of-type h2 {
      display: block !important;
      font-size: clamp(24px, 7.2vw, 34px) !important;
      line-height: 1.15 !important;
      letter-spacing: -0.05em !important;
      margin: 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow: visible !important;
      word-break: keep-all !important;
    }

    section:first-of-type p {
      display: block !important;
      font-size: 13px !important;
      line-height: 1.45 !important;
      margin: 8px 0 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow: visible !important;
      word-break: keep-all !important;
    }

    section#community {
      margin-top: 0 !important;
      padding-top: 34px !important;
      background: linear-gradient(180deg, #141a22 0%, #dfe8f2 18%, #e8eef6 100%) !important;
    }

    section#community h2 {
      font-size: clamp(30px, 9vw, 42px) !important;
      line-height: 1.08 !important;
    }

    section#community p {
      font-size: 15px !important;
      line-height: 1.75 !important;
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
      padding-left: 14px !important;
      padding-right: 14px !important;
    }

    button { max-width: 100% !important; }

    h1 {
      font-size: clamp(30px, 10vw, 44px) !important;
      line-height: 1.08 !important;
      letter-spacing: -0.05em !important;
    }

    h2 {
      font-size: clamp(26px, 8vw, 38px) !important;
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

    section:first-of-type > div > div {
      height: 166px !important;
      min-height: 166px !important;
    }

    section:first-of-type h2 {
      font-size: clamp(23px, 7vw, 31px) !important;
    }
  }
`;






const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ✅ 채팅방 소개 섹션 영상 주소
// 네가 원하는 동영상으로 바꾸려면 아래 URL만 교체하면 돼.
// 예: Firebase Storage, Vercel public 파일, YouTube가 아닌 직접 mp4 링크
const COMMUNITY_VIDEO_URL = "/videos/community.mp4";


const initialForm = {
  name: "",
  concern: "",
  goal: "",
};

const initialChecks = [false, false, false, false, false, false, false];
const initialPlan = ["", "", "", "", "", "", ""];
const initialDayImages = [null, null, null, null, null, null, null];

function cleanSectionText(text) {
  return String(text || "")
    .replace(/^#+\s*/gm, "")
    .replace(/^\d+\.\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^[\-–]\s*/gm, "")
    .trim();
}

function cleanAnalysisText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^[\s-]*$/gm, "")
    .trim()
    .replace(/^"+|"+$/g, "");
}

function getSectionByTitles(text, titles, nextTitles) {
  const escapedTitles = titles.map((title) =>
    title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const escapedNextTitles = nextTitles.map((title) =>
    title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const titlePattern = escapedTitles.join("|");
  const nextPattern = escapedNextTitles.join("|");

  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:#{1,6}\\s*)?(?:\\d+\\.\\s*)?(?:\\*\\*)?(${titlePattern})(?:\\*\\*)?\\s*\\n?([\\s\\S]*?)(?=(?:\\n\\s*(?:#{1,6}\\s*)?(?:\\d+\\.\\s*)?(?:\\*\\*)?(?:${nextPattern})(?:\\*\\*)?)|$)`,
    "i"
  );

  const match = text.match(regex);
  return cleanAnalysisText(match?.[2] || "");
}

function parsePlanItems(planText) {
  const cleanText = cleanAnalysisText(planText);
  if (!cleanText) return [];

  const normalized = cleanText
    .replace(/\*\*/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .trim();

  const dayRegex = /(?:^|\n)\s*(?:Day\s*([1-7])|([1-7])일차?)\s*[:：]?\s*/gi;
  const matches = [...normalized.matchAll(dayRegex)];

  if (matches.length === 0) {
    return normalized
      .split("\n")
      .map((line) => cleanAnalysisText(line))
      .filter(Boolean)
      .slice(0, 7);
  }

  const plan = [];

  matches.forEach((match, index) => {
    const dayNumber = Number(match[1] || match[2]);
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    const content = cleanAnalysisText(normalized.slice(start, end));
    if (dayNumber >= 1 && dayNumber <= 7) {
      plan[dayNumber - 1] = content || `Day ${dayNumber} 계획`;
    }
  });

  return plan.filter(Boolean);
}

function parseAnalysisSections(text) {
  if (!text || typeof text !== "string") {
    return {
      current: "",
      core: "",
      plan: [],
      cheer: "",
      raw: "",
    };
  }

  const normalized = text.replace(/\r/g, "").trim();

  const current = getSectionByTitles(
    normalized,
    ["현재 상태 분석", "현재 상태", "상태 분석"],
    ["가장 중요한 핵심 문제", "핵심 문제", "바로 실천할 수 있는 7일 행동 계획", "7일 실행 계획", "7일 행동 계획", "짧은 응원 한마디", "짧은 동기부여", "동기부여"]
  );

  const core = getSectionByTitles(
    normalized,
    ["가장 중요한 핵심 문제", "핵심 문제"],
    ["바로 실천할 수 있는 7일 행동 계획", "7일 실행 계획", "7일 행동 계획", "짧은 응원 한마디", "짧은 동기부여", "동기부여"]
  );

  const planSection = getSectionByTitles(
    normalized,
    ["바로 실천할 수 있는 7일 행동 계획", "7일 실행 계획", "7일 행동 계획"],
    ["짧은 응원 한마디", "짧은 동기부여", "동기부여"]
  );

  const cheer = getSectionByTitles(
    normalized,
    ["짧은 응원 한마디", "짧은 동기부여", "동기부여"],
    ["__END_OF_ANALYSIS__"]
  );

  return {
    current,
    core,
    plan: parsePlanItems(planSection),
    cheer,
    raw: normalized,
  };
}


function extractSevenDayPlan(planLines) {
  const plan = [...initialPlan];

  for (const rawLine of planLines) {
    const line = rawLine.replace(/\*\*/g, "").trim();

    let dayNumber = null;
    let content = line;

    const dayMatch = line.match(/^Day\s*([1-7])\s*[:：]?\s*(.*)$/i);
    const koreanMatch = line.match(/^([1-7])일차?\s*[:：]?\s*(.*)$/);

    if (dayMatch) {
      dayNumber = Number(dayMatch[1]);
      content = dayMatch[2].trim();
    } else if (koreanMatch) {
      dayNumber = Number(koreanMatch[1]);
      content = koreanMatch[2].trim();
    }

    if (dayNumber && dayNumber >= 1 && dayNumber <= 7) {
      plan[dayNumber - 1] = content || `Day ${dayNumber} 계획`;
    }
  }

  return plan;
}

function getCurrentDayIndex(checks) {
  return checks.findIndex((c) => c === false);
}

function canCheckAfter24Hours(lastCheckedAt) {
  if (!lastCheckedAt) return true;

  const last = new Date(lastCheckedAt).getTime();
  if (Number.isNaN(last)) return true;

  return Date.now() - last >= 24 * 60 * 60 * 1000;
}

function getRemainingTimeText(lastCheckedAt) {
  if (!lastCheckedAt) return "";

  const last = new Date(lastCheckedAt).getTime();
  if (Number.isNaN(last)) return "";

  const remainingMs = 24 * 60 * 60 * 1000 - (Date.now() - last);

  if (remainingMs <= 0) return "";

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분 후에 가능해.`;
  }

  if (hours > 0) {
    return `${hours}시간 후에 가능해.`;
  }

  return `${minutes}분 후에 가능해.`;
}

function sanitizeFileName(name) {
  return String(name || "image").replace(/[^\w.-]/g, "_");
}

async function compressImage(file, maxWidth = 720, quality = 0.65) {
  const imgUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imgUrl;
    });

    const ratio = Math.min(1, maxWidth / img.width);
    const width = Math.max(1, Math.round(img.width * ratio));
    const height = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result) {
          reject(new Error("이미지 압축 실패"));
          return;
        }
        resolve(result);
      }, "image/jpeg", quality);
    });

    return blob;
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}

function getFriendlyStorageError(error) {
  const code = error?.code || "";
  const message = error?.message || "unknown";

  if (code.includes("storage/retry-limit-exceeded")) {
    return "사진 용량이 크거나 네트워크가 불안정해서 업로드가 실패했어. 더 작은 사진으로 다시 시도해줘.";
  }

  if (code.includes("storage/unauthorized")) {
    return "Storage 권한 설정 때문에 업로드할 수 없어. Firebase Storage 규칙을 확인해줘.";
  }

  if (code.includes("storage/canceled")) {
    return "이미지 업로드가 취소됐어.";
  }

  if (code.includes("storage/unknown")) {
    return "Storage 설정 또는 버킷 연결 문제일 수 있어. Firebase 설정을 확인해줘.";
  }

  return `이미지 업로드 실패: ${message}`;
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
        <header style={landingStyles.detailNav}>
          <button style={landingStyles.detailBackButton} onClick={onBack}>← 홈으로</button>
          <div style={landingStyles.brandDark}>VELAXION</div>
          <button style={landingStyles.detailStartButton} onClick={onStart}>7일 먼저 체험하기</button>
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
      <header style={landingStyles.detailNav}>
        <button style={landingStyles.detailBackButton} onClick={onBack}>← 홈으로</button>
        <div style={landingStyles.brandDark}>VELAXION</div>
        <button style={landingStyles.detailStartButton} onClick={onStart}>7일 먼저 체험하기</button>
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
                <div
                  key={item.title}
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
            7일 먼저 체험하기
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
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
              <button style={landingStyles.megaItem} onClick={onStart}>7일 먼저 체험하기</button>
            </div>
          </div>
        </div>
      ) : null}

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
            7일 먼저 체험하기
          </button>
        </div>
      </section>
    </div>
  );
}


function CommunityChat({ user, form, onBack, onLogin }) {
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [chatImage, setChatImage] = useState(null);
  const [chatImagePreview, setChatImagePreview] = useState("");
  const [sending, setSending] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const chatFileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "communityMessages"),
      orderBy("createdAt", "asc"),
      limit(120)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextMessages = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setMessages(nextMessages);
      },
      (error) => {
        console.error("COMMUNITY SNAPSHOT ERROR:", error);
        setChatMessage("채팅을 불러오지 못했어. Firestore 규칙이나 인덱스를 확인해줘.");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!chatImage) {
      setChatImagePreview("");
      return;
    }

    const url = URL.createObjectURL(chatImage);
    setChatImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [chatImage]);

  const handleChatImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setChatMessage("이미지 파일만 올릴 수 있어.");
      event.target.value = "";
      return;
    }

    setChatImage(file);
    setChatMessage("");
    event.target.value = "";
  };

  const removeChatImage = () => {
    setChatImage(null);
    setChatImagePreview("");
  };

  const sendCommunityMessage = async () => {
    if (!user) {
      setChatMessage("채팅방을 사용하려면 먼저 로그인해줘.");
      return;
    }

    const cleanText = chatText.trim();
    if (!cleanText && !chatImage) {
      setChatMessage("메시지나 사진 중 하나는 입력해줘.");
      return;
    }

    try {
      setSending(true);
      setChatMessage("");

      let imageUrl = "";
      let imagePath = "";

      if (chatImage) {
        const safeName = sanitizeFileName(chatImage.name);
        imagePath = `community-images/${user.uid}/${Date.now()}-${safeName}.jpg`;
        const imageRef = storageRef(storage, imagePath);
        const compressedBlob = await compressImage(chatImage, 900, 0.7);

        await new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(imageRef, compressedBlob, {
            contentType: "image/jpeg",
          });
          uploadTask.on("state_changed", null, reject, resolve);
        });

        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "communityMessages"), {
        uid: user.uid,
        name: user.displayName || form?.name || "벨락시온 사용자",
        email: user.email || "",
        photoURL: user.photoURL || "",
        text: cleanText,
        imageUrl,
        imagePath,
        createdAt: serverTimestamp(),
        createdAtText: new Date().toISOString(),
      });

      setChatText("");
      setChatImage(null);
      setChatImagePreview("");
    } catch (error) {
      console.error("COMMUNITY SEND ERROR:", error);
      setChatMessage(getFriendlyStorageError(error));
    } finally {
      setSending(false);
    }
  };

  const formatChatTime = (message) => {
    const date = message.createdAt?.toDate?.() || new Date(message.createdAtText || Date.now());
    if (Number.isNaN(date.getTime())) return "방금 전";

    return date.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.page}>
      <style>{mobileCss}</style>
      <div style={styles.communityContainer}>
        <button style={styles.backToLandingButton} onClick={onBack}>
          ← 컨설팅 화면으로 돌아가기
        </button>

        <div style={styles.communityHeroCard}>
          <p style={styles.communityEyebrow}>VELAXION COMMUNITY</p>
          <h1 style={styles.communityTitle}>함께 성장하는 경험 공유방</h1>
          <p style={styles.communitySubtitle}>
            컨설팅을 받은 사람들이 서로의 실행 경험을 나누고, 조언하고, 다시 행동할 힘을 얻는 공간이야.
          </p>

          {!user ? (
            <button style={styles.primaryButton} onClick={onLogin}>
              Google 로그인 후 참여하기
            </button>
          ) : (
            <div style={styles.communityUserPill}>
              {user.photoURL ? <img src={user.photoURL} alt="프로필" style={styles.communityUserImage} /> : null}
              <span>{user.displayName || form?.name || "사용자"}님으로 참여 중</span>
            </div>
          )}
        </div>

        <div style={styles.communityChatCard}>
          <div style={styles.communityMessagesBox}>
            {messages.length === 0 ? (
              <div style={styles.communityEmptyBox}>
                아직 메시지가 없어. 첫 경험을 공유해봐.
              </div>
            ) : (
              messages.map((item) => {
                const isMine = user && item.uid === user.uid;
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.communityMessageRow,
                      ...(isMine ? styles.communityMessageMine : null),
                    }}
                  >
                    <div style={styles.communityAvatar}>
                      {item.photoURL ? (
                        <img src={item.photoURL} alt="프로필" style={styles.communityAvatarImage} />
                      ) : (
                        <span>{(item.name || "V").slice(0, 1)}</span>
                      )}
                    </div>

                    <div style={styles.communityBubbleWrap}>
                      <div style={styles.communityMetaRow}>
                        <strong>{item.name || "벨락시온 사용자"}</strong>
                        <span>{formatChatTime(item)}</span>
                      </div>

                      <div style={styles.communityBubble}>
                        {item.text ? <p style={styles.communityBubbleText}>{item.text}</p> : null}
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="공유 이미지" style={styles.communitySharedImage} />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div style={styles.communityComposer}>
            {chatImagePreview ? (
              <div style={styles.communityPreviewBox}>
                <img src={chatImagePreview} alt="업로드 미리보기" style={styles.communityPreviewImage} />
                <button style={styles.imageRemoveButton} onClick={removeChatImage} type="button">
                  사진 제거
                </button>
              </div>
            ) : null}

            <textarea
              style={styles.communityTextarea}
              placeholder="경험, 조언, 오늘 실행한 내용을 공유해줘."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              rows={3}
            />

            <input
              ref={chatFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChatImageChange}
            />

            <div style={styles.communityComposerActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => chatFileInputRef.current?.click()}
                disabled={sending}
              >
                사진 올리기
              </button>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={sendCommunityMessage}
                disabled={sending || !user}
              >
                {sending ? "공유 중..." : "공유하기"}
              </button>
            </div>

            {chatMessage ? <p style={{ ...styles.message, ...styles.messageInfo }}>{chatMessage}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [checks, setChecks] = useState(initialChecks);
  const [analysis, setAnalysis] = useState("");
  const [dailyPlan, setDailyPlan] = useState(initialPlan);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [dayImages, setDayImages] = useState(initialDayImages);

  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);
  const [removingImageIndex, setRemovingImageIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showExperience, setShowExperience] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  const skipAutoSaveRef = useRef(true);
  const galleryInputRefs = useRef([]);
  const cameraInputRefs = useRef([]);
  const coachBottomRef = useRef(null);

  const progress = useMemo(() => {
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [checks]);

  const parsedAnalysis = useMemo(() => parseAnalysisSections(analysis), [analysis]);

  useEffect(() => {
    const nextPlan = extractSevenDayPlan(parsedAnalysis.plan);
    setDailyPlan(nextPlan);
  }, [parsedAnalysis.plan]);

  useEffect(() => {
    coachBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachMessages.length]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        skipAutoSaveRef.current = false;
        return;
      }

      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          if (data.form) {
            setForm({
              name: data.form.name || "",
              concern: data.form.concern || "",
              goal: data.form.goal || "",
            });
          }

          if (Array.isArray(data.checks) && data.checks.length === 7) {
            setChecks(data.checks);
          }

          if (typeof data.analysis === "string") {
            setAnalysis(data.analysis);
          }

          if (typeof data.lastCheckedAt === "string") {
            setLastCheckedAt(data.lastCheckedAt);
          }

          if (Array.isArray(data.dayImages) && data.dayImages.length === 7) {
            setDayImages(
              data.dayImages.map((item) => {
                if (!item || typeof item !== "object") return null;
                return {
                  name: item.name || "",
                  preview: item.preview || item.url || "",
                  url: item.url || item.preview || "",
                  path: item.path || "",
                };
              })
            );
          }

          if (Array.isArray(data.aiCoachMessages)) {
            setCoachMessages(
              data.aiCoachMessages
                .filter((item) => item && typeof item === "object")
                .map((item) => ({
                  role: item.role === "assistant" ? "assistant" : "user",
                  content: String(item.content || ""),
                  createdAt: item.createdAt || new Date().toISOString(),
                }))
            );
          }
        }
      } catch (error) {
        console.error(error);
        setMessage("데이터를 불러오지 못했어.");
        setMessageType("error");
      } finally {
        setLoading(false);
        skipAutoSaveRef.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  const saveToFirestore = async (
    nextForm,
    nextChecks,
    nextAnalysis,
    nextLastCheckedAt = lastCheckedAt,
    nextDayImages = dayImages,
    successText = "저장 완료!"
  ) => {
    if (!user) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email || "",
          displayName: user.displayName || "",
          form: nextForm,
          checks: nextChecks,
          analysis: nextAnalysis,
          lastCheckedAt: nextLastCheckedAt,
          dayImages: nextDayImages.map((item) =>
            item
              ? {
                  name: item.name || "",
                  url: item.url || item.preview || "",
                  preview: item.preview || item.url || "",
                  path: item.path || "",
                }
              : null
          ),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (successText) {
        setMessage(successText);
        setMessageType("success");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        `저장 실패: ${error.code || "unknown"} / ${error.message || "no-message"}`
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (loading || !user || skipAutoSaveRef.current) return;

    const timer = setTimeout(() => {
      saveToFirestore(form, checks, analysis, lastCheckedAt, dayImages, "자동 저장 완료!");
    }, 500);

    return () => clearTimeout(timer);
  }, [form, checks, analysis, lastCheckedAt, dayImages, user, loading]);

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      setMessage("");
      await signInWithPopup(auth, provider);
      setMessage("로그인 성공!");
      setMessageType("success");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage(
        `로그인 실패: ${error.code || "unknown"} / ${error.message || "no-message"}`
      );
      setMessageType("error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setMessage("");
      await signOut(auth);
      setForm(initialForm);
      setChecks(initialChecks);
      setAnalysis("");
      setDailyPlan(initialPlan);
      setLastCheckedAt(null);
      setDayImages(initialDayImages);
      setCoachMessages([]);
      setCoachQuestion("");
      setMessage("로그아웃 완료.");
      setMessageType("info");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setMessage(
        `로그아웃 실패: ${error.code || "unknown"} / ${error.message || "no-message"}`
      );
      setMessageType("error");
    }
  };

  const handleInputChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("이미지 파일만 올릴 수 있어.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImageIndex(index);
      setMessage("");

      const prevImage = dayImages[index];
      const safeName = sanitizeFileName(file.name);
      const path = `users/${user.uid}/day-images/day-${index + 1}-${Date.now()}-${safeName}.jpg`;
      const imageRef = storageRef(storage, path);

      const compressedBlob = await compressImage(file, 720, 0.65);

      if (compressedBlob.size > 1024 * 1024) {
        throw new Error("압축 후에도 이미지가 너무 커. 더 작은 사진으로 다시 시도해줘.");
      }

      const uploadTask = uploadBytesResumable(imageRef, compressedBlob, {
        contentType: "image/jpeg",
      });

      await new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, resolve);
      });

      const downloadURL = await getDownloadURL(imageRef);

      if (prevImage?.path) {
        try {
          await deleteObject(storageRef(storage, prevImage.path));
        } catch (deleteError) {
          console.error("OLD IMAGE DELETE ERROR:", deleteError);
        }
      }

      const nextDayImages = [...dayImages];
      nextDayImages[index] = {
        name: file.name,
        preview: downloadURL,
        url: downloadURL,
        path,
      };

      setDayImages(nextDayImages);
      setUploadingImageIndex(null);

      saveToFirestore(form, checks, analysis, lastCheckedAt, nextDayImages, "");
      setMessage(`Day ${index + 1} 인증 이미지가 저장됐어.`);
      setMessageType("success");
    } catch (error) {
      console.error(error);
      if (error?.message === "압축 후에도 이미지가 너무 커. 더 작은 사진으로 다시 시도해줘.") {
        setMessage(error.message);
      } else {
        setMessage(getFriendlyStorageError(error));
      }
      setMessageType("error");
    } finally {
      setUploadingImageIndex(null);
      event.target.value = "";
    }
  };

  const openGalleryPicker = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    galleryInputRefs.current[index]?.click();
  };

  const openCameraPicker = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    cameraInputRefs.current[index]?.click();
  };

  const clearDayImage = async (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    const targetImage = dayImages[index];
    if (!targetImage) return;

    try {
      setRemovingImageIndex(index);

      if (targetImage.path) {
        try {
          await deleteObject(storageRef(storage, targetImage.path));
        } catch (deleteError) {
          console.error("IMAGE DELETE ERROR:", deleteError);
        }
      }

      const nextDayImages = [...dayImages];
      nextDayImages[index] = null;

      setDayImages(nextDayImages);
      await saveToFirestore(form, checks, analysis, lastCheckedAt, nextDayImages, "");
      setMessage(`Day ${index + 1} 인증 이미지를 제거했어.`);
      setMessageType("info");
    } catch (error) {
      console.error(error);
      setMessage(`이미지 제거 실패: ${error.message || "unknown"}`);
      setMessageType("error");
    } finally {
      setRemovingImageIndex(null);
    }
  };

  const toggleCheck = async (index) => {
    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    const currentIndex = getCurrentDayIndex(checks);

    if (currentIndex === -1) {
      setMessage("7일 계획을 모두 완료했어!");
      setMessageType("success");
      return;
    }

    if (index !== currentIndex) {
      return;
    }

    if (!dayImages[index]) {
      setMessage("체크하려면 먼저 사진 촬영 또는 갤러리 이미지를 등록해줘.");
      setMessageType("error");
      return;
    }

    if (!canCheckAfter24Hours(lastCheckedAt)) {
      setMessage(`다음 체크는 ${getRemainingTimeText(lastCheckedAt)}`);
      setMessageType("info");
      return;
    }

    const updatedChecks = [...checks];
    updatedChecks[index] = true;

    const nowIso = new Date().toISOString();

    setChecks(updatedChecks);
    setLastCheckedAt(nowIso);
    setMessage(`Day ${index + 1} 완료!`);
    setMessageType("success");

    await saveToFirestore(form, updatedChecks, analysis, nowIso, dayImages, "");
  };

  const saveCoachMessagesToFirestore = async (nextMessages) => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          aiCoachMessages: nextMessages.slice(-40),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("AI COACH SAVE ERROR:", error);
    }
  };

  const handleCoachAsk = async () => {
    const cleanQuestion = coachQuestion.trim();

    if (!user) {
      setMessage("AI 실행 피드백을 사용하려면 먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    if (!analysis) {
      setMessage("먼저 AI 분석을 완료한 뒤 추가 질문을 할 수 있어.");
      setMessageType("info");
      return;
    }

    if (!cleanQuestion) {
      setMessage("AI에게 물어볼 질문을 적어줘.");
      setMessageType("error");
      return;
    }

    const userMessage = {
      role: "user",
      content: cleanQuestion,
      createdAt: new Date().toISOString(),
    };

    const optimisticMessages = [...coachMessages, userMessage];
    setCoachMessages(optimisticMessages);
    setCoachQuestion("");

    try {
      setCoachLoading(true);
      setMessage("");

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
          name: form.name,
          concern: form.concern,
          goal: form.goal,
          analysis,
          dailyPlan,
          checks,
          progress,
          lastCheckedAt,
          completedDays: checks.filter(Boolean).length,
          coachMessages: coachMessages.slice(-8),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI 실행 피드백 실패");
      }

      const assistantMessage = {
        role: "assistant",
        content: data.result || "답변을 만들지 못했어. 다시 질문해줘.",
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...optimisticMessages, assistantMessage].slice(-40);
      setCoachMessages(nextMessages);
      await saveCoachMessagesToFirestore(nextMessages);
      setMessage("AI 실행 피드백 완료!");
      setMessageType("success");
    } catch (error) {
      console.error("AI COACH ERROR:", error);
      setCoachMessages(coachMessages);
      setMessage(`AI 실행 피드백 실패: ${error.message}`);
      setMessageType("error");
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    await saveToFirestore(form, checks, analysis, lastCheckedAt, dayImages, "수동 저장 완료!");
  };

  const handleAnalyze = async () => {
    if (!form.concern.trim() && !form.goal.trim()) {
      setMessage("고민이나 목표를 먼저 적어줘.");
      setMessageType("error");
      return;
    }

    try {
      setAnalyzing(true);
      setMessage("");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          concern: form.concern,
          goal: form.goal,
          progress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI 분석 실패");
      }

      const resultText = data.result || "분석 결과가 없어.";
      setAnalysis(resultText);
      setMessage("AI 분석 완료!");
      setMessageType("success");

      if (user) {
        await saveToFirestore(form, checks, resultText, lastCheckedAt, dayImages, "");
      }
    } catch (error) {
      console.error(error);
      setMessage(`AI 분석 실패: ${error.message}`);
      setMessageType("error");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!showExperience) {
    return (
      <LandingPage
        onStart={() => setShowExperience(true)}
        onCommunity={() => {
          setShowExperience(true);
          setShowCommunity(true);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Velaxion 🚀</h1>
            <p style={styles.subtleText}>불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showCommunity) {
    return (
      <CommunityChat
        user={user}
        form={form}
        onBack={() => setShowCommunity(false)}
        onLogin={handleLogin}
      />
    );
  }

  const hasStructuredAnalysis =
    parsedAnalysis.current ||
    parsedAnalysis.core ||
    parsedAnalysis.plan.length > 0 ||
    parsedAnalysis.cheer;

  const currentDayIndex = getCurrentDayIndex(checks);

  return (
    <div style={styles.page}>
      <style>{mobileCss}</style>
      <div style={styles.container}>
        <button style={styles.backToLandingButton} onClick={() => setShowExperience(false)}>
          ← 소개 화면으로 돌아가기
        </button>
        <div style={styles.header}>
          <div>
            <p style={styles.workspaceEyebrow}>VELAXION EXECUTION OS</p>
            <h1 style={styles.title}>나만의 실행 컨설팅룸</h1>
            <p style={styles.subtitle}>
              목표를 분석하고, 하루 행동으로 쪼개고, AI 코치와 함께 끝까지 실행해.
            </p>
          </div>
        </div>

        <div style={styles.commandCenter}>
          <div style={styles.commandGlow} />
          <div style={styles.commandContent}>
            <div>
              <p style={styles.commandLabel}>오늘의 실행 상태</p>
              <h2 style={styles.commandTitle}>
                {currentDayIndex === -1 ? "7일 실행 완료" : `Day ${currentDayIndex + 1} 실행 준비`}
              </h2>
              <p style={styles.commandText}>
                컨설팅은 방향을 만들고, 코칭은 실행을 계속 이어가게 합니다.
              </p>
            </div>

            <div style={styles.commandStats}>
              <div style={styles.commandStatCard}>
                <span>진행률</span>
                <strong>{progress}%</strong>
              </div>
              <div style={styles.commandStatCard}>
                <span>완료</span>
                <strong>{checks.filter(Boolean).length}/7</strong>
              </div>
              <div style={styles.commandStatCard}>
                <span>인증 사진</span>
                <strong>{dayImages.filter(Boolean).length}</strong>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>계정</h2>
          </div>

          {user ? (
            <div style={styles.userBox}>
              <div style={styles.userTop}>
                <div>
                  <p style={styles.userName}>
                    {user.displayName || form.name || "사용자"}
                  </p>
                  <p style={styles.userEmail}>{user.email}</p>
                </div>
                <button style={styles.secondaryButton} onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <button
              style={styles.primaryButton}
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? "로그인 중..." : "Google 로그인"}
            </button>
          )}
        </div>

        <div style={styles.communityEntryCard}>
          <div>
            <p style={styles.communityEntryEyebrow}>COMMUNITY</p>
            <h2 style={styles.communityEntryTitle}>함께 성장하기</h2>
            <p style={styles.communityEntryText}>
              컨설팅을 받은 사람끼리 경험을 공유하고, 사진과 메시지로 서로에게 조언을 주고받는 공간이야.
            </p>
          </div>
          <button style={styles.primaryButton} onClick={() => setShowCommunity(true)}>
            경험 공유방 들어가기
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>기본 정보</h2>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>이름</label>
            <input
              style={styles.input}
              placeholder="이름을 입력해"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>지금 가장 큰 고민</label>
            <textarea
              style={styles.textarea}
              placeholder="예: 진로, 공부, 창업, 관계"
              value={form.concern}
              onChange={(e) => handleInputChange("concern", e.target.value)}
              rows={5}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>목표</label>
            <textarea
              style={styles.textarea}
              placeholder="3개월 뒤 이루고 싶은 목표를 적어줘"
              value={form.goal}
              onChange={(e) => handleInputChange("goal", e.target.value)}
              rows={5}
            />
          </div>

          <div style={styles.autoSaveHint}>글을 쓰면 자동 저장돼.</div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>7일 실행 체크</h2>
            <span style={styles.progressText}>{progress}%</span>
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          <div style={styles.autoSaveHint}>
            AI가 만든 7일 계획과 연결돼. 체크하려면 사진 촬영 또는 갤러리 이미지를 먼저 등록해야 해.
          </div>

          <div style={styles.dayPlanGrid}>
            {checks.map((checked, index) => {
              const isCurrentDay = index === currentDayIndex;
              const canUploadImage = !checked && isCurrentDay;
              const isUploading = uploadingImageIndex === index;
              const isRemoving = removingImageIndex === index;

              return (
                <div key={index} style={styles.dayPlanCard}>
                  <div style={styles.dayPlanTop}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={checked || index !== currentDayIndex || !dayImages[index]}
                      onChange={() => toggleCheck(index)}
                    />
                    <span style={styles.dayLabel}>Day {index + 1}</span>
                  </div>

                  <div style={styles.dayContentRow}>
                    <div style={styles.dayLeftContent}>
                      <div style={styles.dayTaskText}>
                        {dailyPlan[index] || "AI 분석 후 이 날의 계획이 표시돼."}
                      </div>

                      <input
                        ref={(el) => {
                          galleryInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageChange(index, e)}
                      />

                      <input
                        ref={(el) => {
                          cameraInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageChange(index, e)}
                      />

                      <div style={styles.dayImageActions}>
                        <button
                          type="button"
                          style={{
                            ...styles.secondaryButton,
                            ...(canUploadImage && !isUploading ? null : styles.disabledButton),
                          }}
                          onClick={(e) => openCameraPicker(index, e)}
                          disabled={!canUploadImage || isUploading}
                        >
                          {isUploading ? "이미지 저장 중..." : "사진 촬영"}
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.secondaryButton,
                            ...(canUploadImage && !isUploading ? null : styles.disabledButton),
                          }}
                          onClick={(e) => openGalleryPicker(index, e)}
                          disabled={!canUploadImage || isUploading}
                        >
                          {isUploading ? "이미지 저장 중..." : "갤러리 선택"}
                        </button>

                        {dayImages[index] ? (
                          <button
                            type="button"
                            style={{
                              ...styles.imageRemoveButton,
                              ...(checked || isRemoving ? styles.disabledButton : null),
                            }}
                            onClick={(e) => clearDayImage(index, e)}
                            disabled={checked || isRemoving}
                          >
                            {isRemoving ? "제거 중..." : "이미지 제거"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div style={styles.dayRightPreview}>
                      {dayImages[index] ? (
                        <div style={styles.dayInlinePreviewBox}>
                          <img
                            src={dayImages[index].preview || dayImages[index].url}
                            alt={`Day ${index + 1} 인증`}
                            style={styles.dayInlinePreviewImage}
                          />
                          <div style={styles.dayImageName}>
                            {dayImages[index].name || `Day ${index + 1} 이미지`}
                          </div>
                        </div>
                      ) : (
                        <div style={styles.dayInlinePreviewEmpty}>
                          {checked
                            ? "완료된 Day야."
                            : isCurrentDay
                              ? "여기에 인증 사진이 보여."
                              : "이전 Day를 완료하면 사진 등록이 열려."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>AI 분석</h2>
          </div>

          <div style={styles.actionRow}>
            <button
              style={styles.primaryButton}
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "분석 중..." : "AI 분석하기"}
            </button>

            <button
              style={styles.secondaryButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "수동 저장"}
            </button>
          </div>

          {!analysis ? (
            <div style={styles.analysisEmptyBox}>
              아직 분석 결과가 없어. 내용을 적고 "AI 분석하기"를 눌러봐.
            </div>
          ) : hasStructuredAnalysis ? (
            <div style={styles.analysisLayout}>
              <div style={styles.analysisSummaryColumn}>
                <div style={styles.resultCard}>
                  <div style={styles.resultCardHeader}>
                    <span style={styles.resultBadge}>01</span>
                    <div>
                      <p style={styles.resultKicker}>CURRENT</p>
                      <h3 style={styles.resultTitle}>현재 상태 분석</h3>
                    </div>
                  </div>
                  <p style={styles.resultText}>
                    {parsedAnalysis.current || "분석 내용이 아직 없어."}
                  </p>
                </div>

                <div style={styles.resultCard}>
                  <div style={styles.resultCardHeader}>
                    <span style={styles.resultBadge}>02</span>
                    <div>
                      <p style={styles.resultKicker}>FOCUS</p>
                      <h3 style={styles.resultTitle}>가장 중요한 핵심 문제</h3>
                    </div>
                  </div>
                  <p style={styles.resultText}>
                    {parsedAnalysis.core || "핵심 문제 내용이 아직 없어."}
                  </p>
                </div>

                <div style={styles.resultCard}>
                  <div style={styles.resultCardHeader}>
                    <span style={styles.resultBadge}>04</span>
                    <div>
                      <p style={styles.resultKicker}>MESSAGE</p>
                      <h3 style={styles.resultTitle}>짧은 응원 한마디</h3>
                    </div>
                  </div>
                  <p style={styles.cheerText}>
                    {parsedAnalysis.cheer || "응원 메시지가 아직 없어."}
                  </p>
                </div>
              </div>

              <div style={styles.planResultCard}>
                <div style={styles.resultCardHeader}>
                  <span style={styles.resultBadge}>03</span>
                  <div>
                    <p style={styles.resultKicker}>ACTION PLAN</p>
                    <h3 style={styles.resultTitle}>7일 행동 계획</h3>
                  </div>
                </div>

                {parsedAnalysis.plan.length > 0 ? (
                  <div style={styles.planList}>
                    {parsedAnalysis.plan.map((item, index) => (
                      <div key={index} style={styles.planItem}>
                        <div style={styles.planDayBadge}>Day {index + 1}</div>
                        <div style={styles.planText}>{item}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.resultText}>행동 계획이 아직 없어.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.analysisBox}>{analysis}</div>
          )}

          <div style={styles.coachBox}>
            <div style={styles.coachHeader}>
              <div>
                <p style={styles.coachEyebrow}>AI EXECUTION COACH</p>
                <h3 style={styles.coachTitle}>AI 실행 피드백</h3>
              </div>
              <span style={styles.coachStatus}>{checks.filter(Boolean).length}/7 Day 진행 중</span>
            </div>

            <p style={styles.coachDescription}>
              분석이 끝난 뒤에도 AI에게 계속 질문할 수 있어. 무엇이 부족한지, 어떻게 더 효율적으로 실행할지, 오늘 막힌 부분을 바로 피드백 받아봐.
            </p>

            <div style={styles.coachQuickRow}>
              {[
                "내 계획에서 부족한 점 알려줘",
                "오늘 실행을 더 쉽게 쪼개줘",
                "더 효율적으로 실행하는 방법 알려줘",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  style={styles.coachQuickButton}
                  onClick={() => setCoachQuestion(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div style={styles.coachMessagesBox}>
              {coachMessages.length === 0 ? (
                <div style={styles.coachEmpty}>
                  아직 추가 피드백이 없어. AI 분석 후 궁금한 점을 질문해봐.
                </div>
              ) : (
                coachMessages.map((item, index) => (
                  <div
                    key={`${item.createdAt}-${index}`}
                    style={{
                      ...styles.coachMessageRow,
                      ...(item.role === "user" ? styles.coachMessageUser : styles.coachMessageAssistant),
                    }}
                  >
                    <div style={styles.coachMessageLabel}>
                      {item.role === "user" ? "나" : "VELAXION AI"}
                    </div>
                    <div style={styles.coachBubble}>{item.content}</div>
                  </div>
                ))
              )}
              <div ref={coachBottomRef} />
            </div>

            <div style={styles.coachComposer}>
              <textarea
                style={styles.coachTextarea}
                placeholder="예: 지금 내 실행 방식에서 가장 부족한 점이 뭐야?"
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                rows={3}
              />
              <button
                type="button"
                style={{
                  ...styles.primaryButton,
                  ...(coachLoading ? styles.disabledButton : null),
                }}
                onClick={handleCoachAsk}
                disabled={coachLoading}
              >
                {coachLoading ? "피드백 받는 중..." : "AI에게 추가 질문하기"}
              </button>
            </div>
          </div>

          {message ? (
            <p
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.messageSuccess
                  : messageType === "error"
                    ? styles.messageError
                    : styles.messageInfo),
              }}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 18% 0%, rgba(59,130,246,0.16), transparent 34%), radial-gradient(circle at 82% 12%, rgba(15,23,42,0.18), transparent 30%), linear-gradient(180deg, #e8edf5 0%, #dfe6ef 42%, #d7e0eb 100%)",
    padding: "clamp(18px, 5vw, 36px) clamp(10px, 4vw, 16px)",
    fontFamily:
      'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#0f172a",
  },
  container: {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  },
  header: {
    marginBottom: "18px",
    padding: "0 4px",
  },
  title: {
    fontSize: "clamp(34px, 5vw, 56px)",
    fontWeight: 950,
    margin: 0,
    lineHeight: 1.05,
    letterSpacing: "-0.055em",
    color: "#0b1120",
  },
  subtitle: {
    marginTop: "12px",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: 1.75,
    maxWidth: "660px",
  },
  subtleText: {
    color: "#6b7280",
    fontSize: "15px",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(245,248,252,0.82))",
    border: "1px solid rgba(100,116,139,0.22)",
    borderRadius: "clamp(22px, 7vw, 30px)",
    padding: "clamp(18px, 5vw, 26px)",
    boxShadow: "0 26px 76px rgba(15, 23, 42, 0.13)",
    marginBottom: "20px",
    backdropFilter: "blur(18px)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },
  userBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
  },
  userTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
  },
  userEmail: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.36)",
    fontSize: "15px",
    outline: "none",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(148,163,184,0.36)",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    background: "rgba(255,255,255,0.92)",
    lineHeight: 1.7,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  progressText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#2563eb",
  },
  progressBar: {
    width: "100%",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0f172a, #2563eb, #7dd3fc)",
    borderRadius: "999px",
    transition: "width 0.25s ease",
    boxShadow: "0 0 18px rgba(37, 99, 235, 0.35)",
  },
  autoSaveHint: {
    marginBottom: "16px",
    fontSize: "13px",
    color: "#6b7280",
  },
  dayPlanGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "14px",
  },
  dayPlanCard: {
    display: "block",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))",
    border: "1px solid rgba(148,163,184,0.26)",
    borderRadius: "22px",
    padding: "16px",
    boxShadow: "0 14px 36px rgba(15, 23, 42, 0.055)",
  },
  dayPlanTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  dayLabel: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
  },
  dayContentRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
    gap: "14px",
    alignItems: "start",
  },
  dayLeftContent: {
    minWidth: 0,
  },
  dayRightPreview: {
    width: "100%",
  },
  dayTaskText: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#4b5563",
    marginLeft: "26px",
    whiteSpace: "pre-wrap",
  },
  dayImageActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
    marginLeft: "26px",
  },
  dayInlinePreviewBox: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "8px",
  },
  dayInlinePreviewImage: {
    width: "100%",
    height: "118px",
    objectFit: "cover",
    borderRadius: "14px",
    display: "block",
  },
  dayInlinePreviewEmpty: {
    width: "100%",
    height: "118px",
    borderRadius: "16px",
    border: "1px dashed rgba(100,116,139,0.34)",
    background: "rgba(255,255,255,0.62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "12px",
    color: "#64748b",
    padding: "10px",
    boxSizing: "border-box",
  },
  dayImageName: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#6b7280",
    wordBreak: "break-all",
  },
  imageRemoveButton: {
    background: "#ffffff",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #0f172a 0%, #111827 45%, #334155 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "13px 18px",
    fontSize: "15px",
    fontWeight: 850,
    cursor: "pointer",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.22)",
  },
  secondaryButton: {
    background: "rgba(255,255,255,0.88)",
    color: "#0f172a",
    border: "1px solid rgba(148,163,184,0.34)",
    borderRadius: "16px",
    padding: "11px 15px",
    fontSize: "14px",
    fontWeight: 750,
    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
  },
  analysisBox: {
    marginTop: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px",
    lineHeight: 1.7,
    color: "#374151",
    whiteSpace: "pre-wrap",
  },
  analysisEmptyBox: {
    marginTop: "14px",
    background: "#f9fafb",
    border: "1px dashed #d1d5db",
    borderRadius: "12px",
    padding: "18px",
    lineHeight: 1.7,
    color: "#6b7280",
  },
  analysisCards: {
    marginTop: "18px",
    display: "grid",
    gap: "16px",
  },
  analysisLayout: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
    gap: "18px",
    alignItems: "start",
  },
  analysisSummaryColumn: {
    display: "grid",
    gap: "16px",
  },
  resultCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.92) 100%)",
    border: "1px solid rgba(148,163,184,0.26)",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  },
  planResultCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)",
    border: "1px solid rgba(148,163,184,0.26)",
    borderRadius: "26px",
    padding: "20px",
    boxShadow: "0 20px 54px rgba(15, 23, 42, 0.075)",
  },
  resultCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  resultBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #0f172a, #2563eb)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    flexShrink: 0,
    boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
  },
  resultTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-0.03em",
  },
  resultKicker: {
    margin: "0 0 3px",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: 950,
    letterSpacing: "0.14em",
  },
  resultText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.85,
    color: "#334155",
    whiteSpace: "pre-wrap",
  },
  planList: {
    display: "grid",
    gap: "10px",
  },
  planItem: {
    display: "grid",
    gridTemplateColumns: "minmax(68px, 82px) 1fr",
    gap: "10px",
    alignItems: "start",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(148,163,184,0.24)",
    borderRadius: "16px",
    padding: "12px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.035)",
  },
  planDayBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "36px",
    padding: "0 10px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: 700,
  },
  planText: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#374151",
    whiteSpace: "pre-wrap",
  },
  cheerText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.85,
    color: "#047857",
    background: "linear-gradient(180deg, #ecfdf5, #dcfce7)",
    border: "1px solid #a7f3d0",
    borderRadius: "18px",
    padding: "16px",
    whiteSpace: "pre-wrap",
  },
  coachBox: {
    marginTop: "20px",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,0.13), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
    border: "1px solid rgba(148,163,184,0.28)",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.095)",
  },
  coachHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },
  coachEyebrow: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.12em",
    color: "#6b7280",
  },
  coachTitle: {
    margin: "6px 0 0",
    fontSize: "22px",
    fontWeight: 850,
    color: "#111827",
  },
  coachStatus: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  coachDescription: {
    margin: "0 0 14px",
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  coachQuickRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  coachQuickButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "999px",
    padding: "9px 12px",
    fontSize: "13px",
    fontWeight: 750,
    cursor: "pointer",
  },
  coachMessagesBox: {
    minHeight: "220px",
    maxHeight: "360px",
    overflowY: "auto",
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 28%), linear-gradient(180deg, #eef3f9, #e3ebf4)",
    border: "1px solid rgba(100,116,139,0.26)",
    borderRadius: "24px",
    padding: "18px",
    display: "grid",
    alignContent: "start",
    gap: "14px",
  },
  coachEmpty: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px 10px",
  },
  coachMessageRow: {
    display: "grid",
    gap: "6px",
  },
  coachMessageUser: {
    justifyItems: "end",
  },
  coachMessageAssistant: {
    justifyItems: "start",
  },
  coachMessageLabel: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#6b7280",
  },
  coachBubble: {
    maxWidth: "88%",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(148,163,184,0.28)",
    borderRadius: "18px",
    padding: "14px 16px",
    fontSize: "14px",
    lineHeight: 1.75,
    color: "#334155",
    whiteSpace: "pre-wrap",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
  },
  coachComposer: {
    marginTop: "12px",
    display: "grid",
    gap: "10px",
  },
  coachTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: "20px",
    border: "1px solid rgba(148,163,184,0.36)",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    background: "rgba(255,255,255,0.95)",
    lineHeight: 1.7,
  },
  message: {
    marginTop: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },
  messageSuccess: {
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
  },
  messageError: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
  messageInfo: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
  backToLandingButton: {
    background: "rgba(255,255,255,0.72)",
    color: "#0f172a",
    border: "1px solid rgba(100,116,139,0.24)",
    borderRadius: "999px",
    padding: "11px 15px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "18px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.10)",
    backdropFilter: "blur(12px)",
  },
  workspaceEyebrow: {
    margin: "0 0 10px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  commandCenter: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "clamp(22px, 7vw, 32px)",
    marginBottom: "20px",
    background: "linear-gradient(135deg, #0f172a 0%, #111827 48%, #334155 100%)",
    color: "#ffffff",
    boxShadow: "0 32px 90px rgba(15, 23, 42, 0.24)",
  },
  commandGlow: {
    position: "absolute",
    width: "340px",
    height: "340px",
    right: "-120px",
    top: "-150px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(125,211,252,0.42), transparent 62%)",
    pointerEvents: "none",
  },
  commandContent: {
    position: "relative",
    zIndex: 1,
    padding: "clamp(20px, 5vw, 28px)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
    gap: "22px",
    alignItems: "center",
  },
  commandLabel: {
    margin: 0,
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  commandTitle: {
    margin: "10px 0 0",
    fontSize: "clamp(26px, 4vw, 42px)",
    lineHeight: 1.08,
    letterSpacing: "-0.05em",
    fontWeight: 950,
  },
  commandText: {
    margin: "12px 0 0",
    color: "#dbeafe",
    fontSize: "15px",
    lineHeight: 1.75,
    maxWidth: "560px",
  },
  commandStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 96px), 1fr))",
    gap: "10px",
  },
  commandStatCard: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    padding: "16px",
    backdropFilter: "blur(14px)",
  },
  communityContainer: {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  },
  communityEntryCard: {
    background: "linear-gradient(135deg, #111827 0%, #1f2937 52%, #374151 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.16)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
  },
  communityEntryEyebrow: {
    margin: 0,
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  communityEntryTitle: {
    margin: "8px 0 0",
    fontSize: "24px",
    fontWeight: 850,
  },
  communityEntryText: {
    margin: "8px 0 0",
    color: "#d1d5db",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "620px",
  },
  communityHeroCard: {
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,0.16), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.90), rgba(238,244,251,0.78))",
    border: "1px solid rgba(100,116,139,0.24)",
    borderRadius: "34px",
    padding: "32px",
    boxShadow: "0 30px 90px rgba(15, 23, 42, 0.14)",
    marginBottom: "20px",
    backdropFilter: "blur(18px)",
  },
  communityEyebrow: {
    margin: 0,
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  communityTitle: {
    margin: "10px 0 0",
    fontSize: "34px",
    lineHeight: 1.12,
    letterSpacing: "-0.04em",
    fontWeight: 900,
  },
  communitySubtitle: {
    margin: "12px 0 18px",
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: 1.75,
    maxWidth: "720px",
  },
  communityUserPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: 800,
  },
  communityUserImage: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    objectFit: "cover",
  },
  communityChatCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(100,116,139,0.24)",
    borderRadius: "34px",
    overflow: "hidden",
    boxShadow: "0 32px 100px rgba(15, 23, 42, 0.16)",
    backdropFilter: "blur(18px)",
  },
  communityMessagesBox: {
    minHeight: "min(62vh, 480px)",
    maxHeight: "620px",
    overflowY: "auto",
    padding: "clamp(14px, 4vw, 24px)",
    background:
      "radial-gradient(circle at 18% 0%, rgba(59,130,246,0.13), transparent 32%), radial-gradient(circle at 88% 8%, rgba(15,23,42,0.11), transparent 26%), linear-gradient(180deg, #edf3fa, #dfe8f2)",
    display: "grid",
    alignContent: "start",
    gap: "18px",
  },
  communityEmptyBox: {
    minHeight: "220px",
    border: "1px dashed #d1d5db",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: 700,
    background: "#ffffff",
  },
  communityMessageRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
  communityMessageMine: {
    flexDirection: "row-reverse",
  },
  communityAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 900,
    flexShrink: 0,
    overflow: "hidden",
  },
  communityAvatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  communityBubbleWrap: {
    maxWidth: "min(620px, calc(100% - 54px))",
    minWidth: 0,
  },
  communityMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
    color: "#6b7280",
    fontSize: "12px",
  },
  communityBubble: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(148,163,184,0.28)",
    borderRadius: "20px",
    padding: "14px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.07)",
  },
  communityBubbleText: {
    margin: 0,
    color: "#111827",
    fontSize: "15px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  communitySharedImage: {
    display: "block",
    width: "min(360px, 100%)",
    maxHeight: "360px",
    objectFit: "cover",
    borderRadius: "14px",
    marginTop: "10px",
    border: "1px solid #e5e7eb",
  },
  communityComposer: {
    padding: "18px",
    borderTop: "1px solid rgba(100,116,139,0.20)",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(12px)",
  },
  communityTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 18px",
    borderRadius: "22px",
    border: "1px solid rgba(100,116,139,0.28)",
    fontSize: "15px",
    lineHeight: 1.7,
    outline: "none",
    resize: "vertical",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
  },
  communityComposerActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  communityPreviewBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    padding: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    background: "#f9fafb",
  },
  communityPreviewImage: {
    width: "92px",
    height: "92px",
    objectFit: "cover",
    borderRadius: "12px",
  },

};

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
    background: "linear-gradient(180deg, #edf3fa 0%, #f5f7fb 100%)",
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
