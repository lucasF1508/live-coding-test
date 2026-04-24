import { notFound } from 'next/navigation'
import { getChallengeById } from '@/lib/challenges'
import ChallengeWorkspace from '@/components/ChallengeWorkspace'

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const challenge = getChallengeById(id)
  if (!challenge) notFound()

  return <ChallengeWorkspace challenge={challenge} />
}
