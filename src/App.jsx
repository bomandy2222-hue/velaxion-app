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

export default function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [checks, setChecks] = useState(initialChecks);
  const [analysis, setAnalysis] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  const skipAutoSaveRef = useRef(true);

  const progress = useMemo(() => {
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [checks]);

  // 🔥 로그인 상태 + 데이터 불러오기
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setLoading(false);
        skipAutoSaveRef.current = false;
        return;
      }

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setForm(data.form || initialForm);
        setChecks(data.checks || initialChecks);
        setAnalysis(data.analysis || "");
      }

      setLoading(false);
      skipAutoSaveRef.current = false;
    });

    return () => unsub();
  }, []);

  // 🔥 자동 저장
  useEffect(() => {
    if (!user || loading || skipAutoSaveRef.current) return;

    const timer = setTimeout(() => {
      setDoc(
        doc(db, "users", user.uid),
        {
          form,
          checks,
          analysis,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [form, checks, analysis]);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setForm(initialForm);
    setChecks(initialChecks);
    setAnalysis("");
  };

  const handleAnalyze = async () => {
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

      if (!res.ok) throw new Error(data.error);

      setAnalysis(data.result);
      setMessage("AI 분석 완료");

      // 🔥 핵심: 분석 결과 Firestore 저장
      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            analysis: data.result,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      setMessage("AI 분석 실패: " + e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>Velaxion 🚀</h1>

      {/* 로그인 */}
      {!user ? (
        <button onClick={handleLogin}>Google 로그인</button>
      ) : (
        <>
          <p>{user.email}</p>
          <button onClick={handleLogout}>로그아웃</button>

          {/* 기본 정보 */}
          <input
            placeholder="이름"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            placeholder="고민"
            value={form.concern}
            onChange={(e) =>
              setForm({ ...form, concern: e.target.value })
            }
          />

          <textarea
            placeholder="목표"
            value={form.goal}
            onChange={(e) =>
              setForm({ ...form, goal: e.target.value })
            }
          />

          {/* 체크 */}
          <div>
            {checks.map((c, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={c}
                  onChange={() => {
                    const copy = [...checks];
                    copy[i] = !copy[i];
                    setChecks(copy);
                  }}
                />
                Day {i + 1}
              </label>
            ))}
          </div>

          <p>진행률: {progress}%</p>

          {/* AI */}
          <button onClick={handleAnalyze}>
            {analyzing ? "분석중..." : "AI 분석"}
          </button>

          <div style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
            {analysis || "아직 결과 없음"}
          </div>

          <p>{message}</p>
        </>
      )}
    </div>
  );
}
