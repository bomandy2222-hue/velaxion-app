export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API alive" }); // 👈 여기 중요
  }

  try {
    const { name, concern, goal, progress } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "목표 없음" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "API 키 없음" });
    }

    const prompt = `
너는 VELAXION의 AI 컨설턴트야.

이름: ${name || "사용자"}
고민: ${concern}
목표: ${goal}
진행률: ${progress || 0}%

다음 형식으로 답변:
1. 현재 상태 분석
2. 핵심 문제
3. 7일 실행 계획
4. 동기부여
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "너는 실행 코치다." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "응답 없음",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 에러" });
  }
}
