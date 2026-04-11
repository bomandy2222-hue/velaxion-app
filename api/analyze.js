export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, concern, goal, progress } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 청소년과 초보 창업자에게 현실적이고 따뜻한 조언을 해주는 상담 코치야. 너무 과장하지 말고, 구체적이고 실행 가능한 분석을 제공해.",
          },
          {
            role: "user",
            content: `
이름: ${name}
현재 고민: ${concern}
목표: ${goal}
실행 진행률: ${progress}%

위 내용을 바탕으로 아래 형식으로 한국어로 답해줘.

1. 현재 상태 분석
2. 가장 중요한 핵심 문제
3. 바로 실천할 수 있는 7일 행동 계획
4. 짧은 응원 한마디
            `,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: data.error?.message || "OpenAI 응답 오류",
      });
    }

    const result = data.choices?.[0]?.message?.content || "응답 없음";

    return res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI 요청 실패" });
  }
}
