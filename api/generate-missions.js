const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userProfile, conversationSummary } = req.body || {};

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const profileLines = [
      userProfile?.goal             && `Goal: ${userProfile.goal}`,
      userProfile?.career_stage     && `Career stage: ${userProfile.career_stage}`,
      userProfile?.primary_obstacle && `Primary obstacle: ${userProfile.primary_obstacle}`,
      userProfile?.current_decision && `Current decision: ${userProfile.current_decision}`,
      userProfile?.profile_code     && `Income profile: ${userProfile.profile_code}`,
    ].filter(Boolean);

    const contextSection = profileLines.length
      ? `About this musician:\n${profileLines.join('\n')}`
      : 'No profile data yet — generate broadly useful missions for an early-career UK musician.';

    const summarySection = conversationSummary
      ? `\nConversation context:\n${conversationSummary}`
      : '';

    const prompt = `You are helping an early-career musician in the UK plan their week. Generate exactly 3 specific, achievable missions for this week.

${contextSection}${summarySection}

Rules:
- Each mission must be completable in 1-3 hours this week
- Be specific: not "network more" but "message 3 venue bookers on Instagram this week"
- Vary across: practical tasks, creative work, and relationship-building
- Reference the person's actual situation where you can
- Never give generic advice that could apply to anyone

Return ONLY a JSON array with exactly 3 objects, no other text:
[
  {"title": "short action title", "description": "1-2 sentences on why this matters for them specifically"},
  {"title": "...", "description": "..."},
  {"title": "...", "description": "..."}
]`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content?.[0]?.text || '';
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return res.status(200).json({ missions: [] });

    const missions = JSON.parse(match[0]);
    return res.status(200).json({ missions: missions.slice(0, 3) });

  } catch (err) {
    console.error('generate-missions error:', err);
    return res.status(200).json({ missions: [] });
  }
};
