export async function POST(request: Request) {
  const body = await request.json();
  const { currentRoom, years } = body;
  // Predict future room based on current
  let prediction = 'Upgraded ' + currentRoom;
  if (years > 5) prediction = 'Luxury Suite';
  return Response.json({ futureRoom: prediction });
}
