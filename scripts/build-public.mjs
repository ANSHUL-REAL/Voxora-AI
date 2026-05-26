import { execFileSync, spawn } from "node:child_process";

const child = spawn("npx", ["react-router", "build"], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
let finished = false;

const finish = (code) => {
  if (finished) return;
  finished = true;
  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/pid", String(child.pid), "/f", "/t"], {
        stdio: "ignore",
      });
    } catch {}
  } else {
    child.kill("SIGTERM");
  }
  process.exit(code);
};

const handle = (chunk, stream) => {
  const text = chunk.toString();
  output += text;
  stream.write(text);
  if (/Build failed|error during build|\[vite:/i.test(text)) {
    finish(1);
  }
  if (
    output.includes("build/server/assets/server-build.js") &&
    output.includes("asset cleaned from React Router server build")
  ) {
    setTimeout(() => finish(0), 500);
  }
};

child.stdout.on("data", (chunk) => handle(chunk, process.stdout));
child.stderr.on("data", (chunk) => handle(chunk, process.stderr));
child.on("exit", (code) => {
  if (!finished) finish(code ?? 1);
});

setTimeout(() => {
  if (output.includes("build/server/assets/server-build.js")) {
    finish(0);
  } else {
    console.error("Build timed out before server bundle was emitted.");
    finish(1);
  }
}, 120000);
