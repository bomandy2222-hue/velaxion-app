import { useEffect, useMemo, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import app from "./firebase";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const progress = useMemo(() => {
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [checks]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setMessage("");

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          if (data.form) setForm(data.form);
          if (Array.isArray(data.checks) && data.checks.length === 7) {
            setChecks(data.checks);
          }
        }
      } catch (error) {
        setMessage("불러오기에 실패했어.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setMessage("");
      await signInWithPopup(auth, provider);
    } catch (error) {
      setMessage("로그인에 실패했어.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      setMessage("");
      await signOut(auth);
      setForm(initialForm);
      setChecks(initialChecks);
    } catch (error) {
      setMessage("로그아웃에 실패했어.");
      console.error(error);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCheck = (index) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) {
      setMessage("먼저 로그인해줘.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          form,
          checks,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setMessage("저장 완료.");
    } catch (error) {
      setMessage("저장에 실패했어.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>VELAXION</h1>
          <p style={styles.text}>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.badge}>VELAXION</div>
          <h1 style={styles.title}>AI 성장 실행 앱 🚀</h1>
          <p style={styles.subtitle}>
            로그인, 저장, 실행 체크까지 되는 첫 버전
          </p>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>계정</h2>

            {user ? (
              <>
                <div style={styles.infoBox}>
                  <div>
                    <strong>로그인됨</strong>
                  </div>
                  <div>{user.email}</div>
                </div>
                <button style={styles.secondaryButton} onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <button style={styles.primaryButton} onClick={handleLogin}>
                Google 로그인
              </button>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>진단 입력</h2>

            <input
              style={styles.input}
              placeholder="이름"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <textarea
              style={styles.textarea}
              placeholder="현재 가장 큰 고민"
              value={form.concern}
              onChange={(e) => handleChange("concern", e.target.value)}
            />

            <textarea
              style={styles.textarea}
              placeholder="3개월 뒤 목표"
              value={form.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
            />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>7일 실행 체크</h2>

            <div style={styles.progressRow}>
              <span>진행률</span>
              <strong>{progress}%</strong>
            </div>

            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>

            {checks.map((checked, index) => (
              <label key={index} style={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheck(index)}
                />
                <span>Day {index + 1} 실행 완료</span>
              </label>
            ))}
          </div>

          <div style={styles.section}>
            <button
              style={styles.primaryButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "Firebase에 저장"}
            </button>
          </div>

          {message ? <p style={styles.message}>{message}</p> : null}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #111111 0%, #1b140d 100%)",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    padding: "32px 16px",
  },
  container: {
    maxWidth: "760px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  badge: {
    display: "inline-block",
    background: "#f4c34d",
    color: "#111",
    fontWeight: 700,
    borderRadius: "999px",
    padding: "8px 12px",
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
  },
  subtitle: {
    color: "#d5d5d5",
    lineHeight: 1.6,
  },
  text: {
    color: "#e5e5e5",
  },
  section: {
    marginTop: "28px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "12px",
  },
  infoBox: {
    background: "#171717",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "14px",
    lineHeight: 1.6,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#171717",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "110px",
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#171717",
    color: "#fff",
    resize: "vertical",
  },
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "#f4c34d",
    color: "#111",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    marginTop: "12px",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "#1b1b1b",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  progressBar: {
    width: "100%",
    height: "12px",
    background: "#222",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "16px",
  },
  progressFill: {
    height: "100%",
    background: "#f4c34d",
  },
  checkRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  message: {
    marginTop: "16px",
    color: "#f4c34d",
  },
};
