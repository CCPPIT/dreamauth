export async function POST(request: Request) {
  const body = await request.json();
  // Log analytics data
  console.log('Analytics:', body);
  return Response.json({ status: 'Analytics logged' });
}
