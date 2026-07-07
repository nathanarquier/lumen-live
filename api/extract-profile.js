const Anthropic = require('@anthropic-ai/sdk');

const EXTRACTION_INSTRUCTION = `Based on the conversation above, extract structured profile data about the user.
Return ONLY a valid JSON object with exactly these fields (use null for any field where you do not have clear evidence):

{
  "goal": "what the user ultimately wants to achieve from their music (string or null)",
  "goal_is_specific": "boolean or null — true if the goal has BOTH a clear direction (what outcome they want) AND a mechanism or context (how they plan to get there, or what specific area they are working in). Examples that ARE specific: 'earn £500/month from session work', 'build live performance income in Manchester', 'release and monetise original music on streaming'. Examples that are NOT specific: 'make more money from music', 'be more successful', 'get better at music'. Set to null when goal is null. Return as a JSON boolean (true/false), not a string",
  "career_stage": "one of: early / developing / established (string or null)",
  "primary_obstacle": "the main thing getting in their way right now (string or null)",
  "current_decision": "a specific decision they are currently weighing, if any (string or null)",
  "profile_code": "one of: LIVE / FREELANCE / STREAMING / BALANCED — based on their income focus (string or null)"
}

Rules:
- Only populate fields where you have explicit evidence from the conversation
- Do not infer, guess, or fill in from general assumptions
- Return null for any field without clear evidence
- goal_is_specific must be a JSON boolean (true or false) or null — never a string
- Output valid JSON only, no other text`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length < 4) {
    return res.status(200).json({ profile: null });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        ...messages,
        { role: 'user', content: EXTRACTION_INSTRUCTION }
      ]
    });

    const raw = response.content?.[0]?.text || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(200).json({ profile: null });
    }

    const profile = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ profile });

  } catch (err) {
    console.error('Profile extraction error:', err);
    return res.status(200).json({ profile: null });
  }
};
