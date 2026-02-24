export async function GET() {
  // Return live counter for people interacting
  const count = Math.floor(Math.random() * 500) + 500;
  return Response.json({ count });
}
