export async function POST(request: Request) {
  const body = await request.json();
  const { sleepHours, age } = body;
  // Calculate sleep score
  let score = 50;
  if (sleepHours >= 7 && sleepHours <= 9) score = 90;
  else if (sleepHours >= 6) score = 70;
  if (age > 50) score += 10;
  return Response.json({ sleepScore: score });
}
