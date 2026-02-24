export async function POST(request: Request) {
  const body = await request.json();
  // Generate room preview data
  const { color, woodType, furniture } = body;
  const preview = {
    imageUrl: '/room-preview.png',
    description: `Room with ${color} walls, ${woodType} furniture, including ${furniture.join(', ')}`
  };
  return Response.json({ preview });
}
