export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ message: "질문이 없습니다." });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const prompt = `
너는 사용자의 실행을 도와주는 AI 코치야.

사용자 상황:
${context || "없음"}

사용자 질문:
${question}

답변 규칙:
- 현실적이고 실행 가능한 조언
- 구체적으로 단계 제시
- 동기부여 포함
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
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const answer = data.choices?.[0]?.message?.content || "답변 생성 실패";

    return res.status(200).json({ answer });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러" });
  }
}
