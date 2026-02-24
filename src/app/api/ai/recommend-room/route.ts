export async function POST(request: Request) {
  const body = await request.json();
  // AI logic for room recommendation based on sleep hours, personality, age
  const { sleepHours, personality, age } = body;
  let recommendation = 'Standard Room';
  if (sleepHours > 8) recommendation = 'King Size Room';
  if (personality === 'family') recommendation = 'Family Suite';
  if (age < 25) recommendation = 'Modern Studio';
  return Response.json({ recommendation });
}
