export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    stack: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB", "PostgreSQL"]
  });
}
