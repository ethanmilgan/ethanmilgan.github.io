import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  server.get("/health", (_request, response) => {
    response.json({
      ok: true,
      stack: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "Express", "MongoDB", "PostgreSQL"]
    });
  });

  server.all(/.*/, (request, response) => {
    return handle(request, response);
  });

  server.listen(port, hostname, () => {
    console.log(`Style Edit by Reena running at http://${hostname}:${port}`);
  });
});
