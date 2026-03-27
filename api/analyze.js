export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
