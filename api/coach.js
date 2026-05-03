export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST 요청만 가능",
    });
  }

  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "질문 없음",
      });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API 키 없음",
      });
    }

    const prompt = `
너는 사용자의 실행을 도와주는 AI 코치야.

사용자 상황:
${context || "없음"}

사용자 질문:
${question}

답변:
- 현실적인 조언
- 바로 실행 가능한 행동
- 짧고 강하게
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
      "응답 없음";

    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({
      error: "서버 에러",
    });
  }
}
