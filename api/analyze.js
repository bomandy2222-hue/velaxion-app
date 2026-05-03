export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST 요청만 가능",
    });
  }

  try {
    const { name, concern, goal, progress } = req.body;

    if (!concern || !goal) {
      return res.status(400).json({
        error: "고민 또는 목표 없음",
      });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API 키 없음",
      });
    }

    const prompt = `
너는 VELAXION의 AI 컨설턴트야.

사용자 정보:
이름: ${name || "사용자"}
고민: ${concern}
목표: ${goal}
진행률: ${progress || 0}%

다음 형식으로 답변해:

1. 현재 상태 분석
2. 핵심 문제
3. 7일 실행 계획
Day 1:
Day 2:
Day 3:
Day 4:
Day 5:
Day 6:
Day 7:
4. 짧은 동기부여
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "JSON 파싱 실패",
        raw: text,
      });
    }

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "OpenAI 오류",
      });
    }

    const result =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "분석 실패";

    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({
      error: "서버 에러",
    });
  }
}
