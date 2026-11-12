import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  return Response.json(
    { user: user ? { username: user.username } : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
