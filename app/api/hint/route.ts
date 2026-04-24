import Anthropic from '@anthropic-ai/sdk'
import { getChallengeById } from '@/lib/challenges'

const SYSTEM_PROMPT = `You are a coding mentor helping a developer practice for a senior frontend interview.
Your role is to give HINTS, not solutions. Be concise (2-4 sentences max).
Point them in the right direction without giving away the answer.
Adjust based on hintNumber: hint 1 = conceptual nudge, hint 2 = more specific,
hint 3 = almost a direct pointer to the exact line/approach needed.
Never show code. Never reveal the full solution.`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response('Missing ANTHROPIC_API_KEY', { status: 500 })
    }

    const { challengeId, currentCode, hintNumber } = (await req.json()) as {
      challengeId?: string
      currentCode?: string
      hintNumber?: number
    }

    if (!challengeId || typeof currentCode !== 'string' || !hintNumber || hintNumber < 1 || hintNumber > 3) {
      return new Response('Invalid request payload', { status: 400 })
    }

    const challenge = getChallengeById(challengeId)
    if (!challenge) {
      return new Response('Challenge not found', { status: 404 })
    }

    const anthropic = new Anthropic({ apiKey })
    const userPrompt = `Challenge: ${challenge.title}
Category: ${challenge.category}

Instructions the user must complete:
${challenge.instructions.join('\n')}

Current user code:
${currentCode}

This is hint #${hintNumber} of 3. Give a hint appropriate for this stage.`

    const stream = await anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    return new Response(stream.toReadableStream(), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    return new Response(`Hint generation failed: ${(error as Error).message}`, { status: 500 })
  }
}
