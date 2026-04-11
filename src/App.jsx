import { useEffect, useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    concern: "",
    goal: "",
  });

  const [checks, setChecks] = useState(Array(7).fill(false));
  const [aiResult, setAiResult] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 자동 저장 (디바운스)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("form", JSON.stringify(form));
      localStorage.setItem("checks", JSON.stringify(checks));
    }, 500);

    return () => clearTimeout(timeout);
  }, [form, checks]);

  // 🔥 초기 불러오기
  useEffect(() => {
    const savedForm = localStorage.getItem("form");
    const savedChecks = localStorage.getItem("checks");

    if (savedForm) setForm(JSON.parse(savedForm));
    if (savedChecks) setChecks(JSON.parse(savedChecks));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCheck = (i) => {
    const newChecks = [...checks];
    newChecks[i] = !newChecks[i];
    setChecks(newChecks);
  };

  const progress = Math.round(
    (checks.filter(Boolean).length / 7) * 100
  );

  // 🔥 AI 분석
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setMessage("");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAiResult(data.result);
      setMessage("AI 분석 완료!");
    } catch (err) {
      setMessage("AI 분석 실패 😢");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>기본 정보</h2>

      <input
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
      />

      <textarea
        name="concern"
        placeholder="지금 고민"
        value={form.concern}
        onChange={handleChange}
        style={styles.textarea}
      />

      <textarea
        name="goal"
        placeholder="목표"
        value={form.goal}
        onChange={handleChange}
        style={styles.textarea}
      />

      <button onClick={handleAnalyze} style={styles.button}>
        {analyzing ? "분석 중..." : "AI 분석하기"}
      </button>

      {message && <p>{message}</p>}

      {aiResult && (
        <div style={styles.resultBox}>
          {aiResult}
        </div>
      )}

      <h2>7일 실행 체크 ({progress}%)</h2>

      <div style={styles.checkGrid}>
        {checks.map((c, i) => (
          <button
            key={i}
            onClick={() => toggleCheck(i)}
            style={{
              ...styles.checkButton,
              background: c ? "#4caf50" : "#eee",
            }}
          >
            Day {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    width: "100%",
    background: "black",
    color: "white",
    border: "none",
    marginBottom: 20,
  },
  resultBox: {
    background: "#f5f5f5",
    padding: 15,
    marginBottom: 20,
    whiteSpace: "pre-wrap",
  },
  checkGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  checkButton: {
    padding: 10,
    border: "none",
    borderRadius: 8,
  },
};

export default App;
