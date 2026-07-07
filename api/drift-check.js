const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, goal } = req.body || {};

  if (!messages?.length || !goal) {
    return res.status(400).json({ error: 'messages and goal required' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [
        ...messages,
        {
          role: 'user',
          content: `The user's stated goal is: "${goal}"\n\nReview the conversation above. Did the user primarily focus on a direction genuinely unrelated to this goal? Important: sub-tasks that serve the goal are NOT drift (e.g. "improve home studio setup" serves "build session-work income"). Only return drifting:true if the conversation was clearly about a different outcome or career direction entirely. Return ONLY valid JSON: {"drifting":true} or {"drifting":false}`
        }
      ]
    });

    const raw = response.content?.[0]?.text || '';
    let drifting = false;
    try {
      const match = raw.match(/\{[\s\S]*?\}/);
      if (match) drifting = JSON.parse(match[0]).drifting === true;
    } catch { /* malformed — fail safe: no drift */ }

    return res.status(200).json({ drifting });

  } catch (err) {
    console.error('drift-check error:', err);
    return res.status(200).json({ drifting: false }); // fail safe
  }
};
