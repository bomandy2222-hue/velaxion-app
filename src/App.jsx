import { useEffect, useMemo, useState } from "react";
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
        console.error(error);
        setMessage("데이터를 불러오지 못했어.");
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
      console.error(error);
      setMessage("로그인에 실패했어.");
    }
  };

  const handleLogout = async () => {
    try {
      setMessage("");
      await signOut(auth);
      setForm(initialForm);
      setChecks(initialChecks);
    } catch (error) {
      console.error(error);
      setMessage("로그아웃에 실패했어.");
    }
  };

  const toggleCheck = (index) => {
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
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

      setMessage("저장 완료!");
    } catch (error) {
      console.error(error);
      setMessage("저장에 실패했어.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
        <h1>로딩 중...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Velaxion 🚀</h1>

      {user ? (
        <>
          <p>{user.email}</p>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <button onClick={handleLogin}>Google 로그인</button>
      )}

      <hr />

      <input
        placeholder="이름"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />
      <br />

      <textarea
        placeholder="고민"
        value={form.concern}
        onChange={(e) => setForm({ ...form, concern: e.target.value })}
        rows={4}
        cols={40}
      />
      <br />
      <br />

      <textarea
        placeholder="목표"
        value={form.goal}
        onChange={(e) => setForm({ ...form, goal: e.target.value })}
        rows={4}
        cols={40}
      />

      <hr />

      <h3>7일 체크 ({progress}%)</h3>
      {checks.map((checked, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleCheck(index)}
            />
            {" "}Day {index + 1}
          </label>
        </div>
      ))}

      <br />

      <button onClick={handleSave} disabled={saving}>
        {saving ? "저장 중..." : "저장"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
