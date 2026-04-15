import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import app from "../firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const initialForm = {
  name: "",
  concern: "",
  goal: "",
};

const initialChecks = [false, false, false, false, false, false, false];
const initialPlan = ["", "", "", "", "", "", ""];

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

  const currentMatch = normalized.match(
    /1\.\s*\*\*현재 상태 분석\*\*([\s\S]*?)(?=2\.\s*\*\*가장 중요한 핵심 문제\*\*|$)/
  );
  const coreMatch = normalized.match(
    /2\.\s*\*\*가장 중요한 핵심 문제\*\*([\s\S]*?)(?=3\.\s*\*\*바로 실천할 수 있는 7일 행동 계획\*\*|$)/
  );
  const planMatch = normalized.match(
    /3\.\s*\*\*바로 실천할 수 있는 7일 행동 계획\*\*([\s\S]*?)(?=4\.\s*\*\*짧은 응원 한마디\*\*|$)/
  );
  const cheerMatch = normalized.match(
    /4\.\s*\*\*짧은 응원 한마디\*\*([\s\S]*?)$/
  );

  const planLines = (planMatch?.[1] || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-+\s*/, "").trim());

  return {
    current: (currentMatch?.[1] || "").trim(),
    core: (coreMatch?.[1] || "").trim(),
    plan: planLines,
    cheer: (cheerMatch?.[1] || "").trim().replace(/^"+|"+$/g, ""),
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

function isSameDay(dateStr) {
  if (!dateStr) return false;

  const today = new Date();
  const saved = new Date(dateStr);

  return (
    today.getFullYear() === saved.getFullYear() &&
    today.getMonth() === saved.getMonth() &&
    today.getDate() === saved.getDate()
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [checks, setChecks] = useState(initialChecks);
  const [analysis, setAnalysis] = useState("");
  const [dailyPlan, setDailyPlan] = useState(initialPlan);
  const [lastCheckedDate, setLastCheckedDate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const skipAutoSaveRef = useRef(true);

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

          if (typeof data.lastCheckedDate === "string") {
            setLastCheckedDate(data.lastCheckedDate);
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
    nextLastCheckedDate = lastCheckedDate,
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
          lastCheckedDate: nextLastCheckedDate,
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
      saveToFirestore(form, checks, analysis, lastCheckedDate, "자동 저장 완료!");
    }, 500);

    return () => clearTimeout(timer);
  }, [form, checks, analysis, lastCheckedDate, user, loading]);

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
      setLastCheckedDate(null);
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

  const toggleCheck = async (index) => {
    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    const currentIndex = getCurrentDayIndex(checks);

    if (isSameDay(lastCheckedDate)) {
      setMessage("오늘은 이미 체크했어. 내일 다시 진행해.");
      setMessageType("info");
      return;
    }

    if (currentIndex === -1) {
      setMessage("7일 계획을 모두 완료했어!");
      setMessageType("success");
      return;
    }

    if (index !== currentIndex) {
      setMessage(`지금은 Day ${currentIndex + 1}만 체크할 수 있어.`);
      setMessageType("info");
      return;
    }

    const updatedChecks = [...checks];
    updatedChecks[index] = true;

    const nowIso = new Date().toISOString();

    setChecks(updatedChecks);
    setLastCheckedDate(nowIso);
    setMessage(`Day ${index + 1} 완료!`);
    setMessageType("success");

    await saveToFirestore(form, updatedChecks, analysis, nowIso, "");
  };

  const handleSave = async () => {
    if (!user) {
      setMessage("먼저 로그인해줘.");
      setMessageType("error");
      return;
    }

    await saveToFirestore(form, checks, analysis, lastCheckedDate, "수동 저장 완료!");
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
        await saveToFirestore(form, checks, resultText, lastCheckedDate, "");
      }
    } catch (error) {
      console.error(error);
      setMessage(`AI 분석 실패: ${error.message}`);
      setMessageType("error");
    } finally {
      setAnalyzing(false);
    }
  };

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

  const hasStructuredAnalysis =
    parsedAnalysis.current ||
    parsedAnalysis.core ||
    parsedAnalysis.plan.length > 0 ||
    parsedAnalysis.cheer;

  const currentDayIndex = getCurrentDayIndex(checks);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Velaxion 🚀</h1>
            <p style={styles.subtitle}>
              성장 기록, 실행 체크, AI 분석을 한 곳에서 관리해.
            </p>
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
            AI가 만든 7일 계획과 연결돼. 체크박스를 누르면 자동 저장돼.
          </div>

          <div style={styles.dayPlanGrid}>
            {checks.map((checked, index) => (
              <label key={index} style={styles.dayPlanCard}>
                <div style={styles.dayPlanTop}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={
                      index !== getCurrentDayIndex(checks) ||
                      (!checked && isSameDay(lastCheckedDate))
                    }
                    onChange={() => toggleCheck(index)}
                  />
                  <span style={styles.dayLabel}>Day {index + 1}</span>
                </div>
                <div style={styles.dayTaskText}>
                  {dailyPlan[index] || "AI 분석 후 이 날의 계획이 표시돼."}
                </div>
              </label>
            ))}
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
            <div style={styles.analysisCards}>
              <div style={styles.resultCard}>
                <div style={styles.resultCardHeader}>
                  <span style={styles.resultBadge}>01</span>
                  <h3 style={styles.resultTitle}>현재 상태 분석</h3>
                </div>
                <p style={styles.resultText}>
                  {parsedAnalysis.current || "분석 내용이 아직 없어."}
                </p>
              </div>

              <div style={styles.resultCard}>
                <div style={styles.resultCardHeader}>
                  <span style={styles.resultBadge}>02</span>
                  <h3 style={styles.resultTitle}>가장 중요한 핵심 문제</h3>
                </div>
                <p style={styles.resultText}>
                  {parsedAnalysis.core || "핵심 문제 내용이 아직 없어."}
                </p>
              </div>

              <div style={styles.resultCard}>
                <div style={styles.resultCardHeader}>
                  <span style={styles.resultBadge}>03</span>
                  <h3 style={styles.resultTitle}>7일 행동 계획</h3>
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

              <div style={styles.resultCard}>
                <div style={styles.resultCardHeader}>
                  <span style={styles.resultBadge}>04</span>
                  <h3 style={styles.resultTitle}>짧은 응원 한마디</h3>
                </div>
                <p style={styles.cheerText}>
                  {parsedAnalysis.cheer || "응원 메시지가 아직 없어."}
                </p>
              </div>
            </div>
          ) : (
            <div style={styles.analysisBox}>{analysis}</div>
          )}

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
    background: "#f5f7fb",
    padding: "32px 16px",
    fontFamily:
      'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "40px",
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "16px",
  },
  subtleText: {
    color: "#6b7280",
    fontSize: "15px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
    marginBottom: "16px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
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
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
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
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    borderRadius: "999px",
    transition: "width 0.25s ease",
  },
  autoSaveHint: {
    marginBottom: "16px",
    fontSize: "13px",
    color: "#6b7280",
  },
  dayPlanGrid: {
    display: "grid",
    gap: "12px",
  },
  dayPlanCard: {
    display: "block",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
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
  dayTaskText: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#4b5563",
    marginLeft: "26px",
    whiteSpace: "pre-wrap",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#ffffff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
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
    marginTop: "16px",
    display: "grid",
    gap: "14px",
  },
  resultCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "16px",
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
    width: "32px",
    height: "32px",
    borderRadius: "999px",
    background: "#111827",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  resultTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },
  resultText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#374151",
    whiteSpace: "pre-wrap",
  },
  planList: {
    display: "grid",
    gap: "10px",
  },
  planItem: {
    display: "grid",
    gridTemplateColumns: "88px 1fr",
    gap: "10px",
    alignItems: "start",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
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
    lineHeight: 1.8,
    color: "#047857",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "12px",
    padding: "14px",
    whiteSpace: "pre-wrap",
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
};
