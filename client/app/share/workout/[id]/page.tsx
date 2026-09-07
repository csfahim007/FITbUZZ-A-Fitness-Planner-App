import { SharedWorkoutClient } from '@/components/workouts/SharedWorkoutClient';

export default async function SharedWorkoutPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <SharedWorkoutClient id={id} />; }
