export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, concern, goal } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "너는 인생 상담 전문가야. 현실적이고 구체적으로 조언해.",
          },
          {
            role: "user",
            content: `
이름: ${name}
고민: ${concern}
목표: ${goal}

위 내용을 바탕으로:
1. 문제 분석
2. 해결 방향
3. 7일 행동 계획
을 알려줘.
            `,
          },
        ],
      }),
    });

    const data = await response.json();

    const result = data.choices?.[0]?.message?.content || "분석 실패";

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
