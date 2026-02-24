export async function GET() {
  // Fetch current offers
  const offers = ['10% discount', 'Free installation', 'Bundle deal'];
  return Response.json({ offers });
}
