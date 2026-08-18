import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import staticPlugin from "@elysiajs/static";

import { PORT, PUBLIC_DIR } from "./config";
import { generalLogger as logger } from "./logger";

import { HealthRoute } from "./routes/health.route";
import { PasteRoutes } from "./routes/paste.route";

// The static plugin errors on a missing assets dir; make sure it exists even
// before the client has been built (dev mode, fresh checkout).
mkdirSync(PUBLIC_DIR, { recursive: true });

export const app = new Elysia()
	.onError(({ code, error, set, request }) => {
		if (code === "VALIDATION") {
			set.status = 400;
			return { message: "Bad Request" };
		}
		if (code === "NOT_FOUND") {
			// SPA fallback: unknown non-API paths go to the client router so
			// deep links (e.g. /paste/abc123) keep working after a refresh.
			// Returning file() from onError keeps the error's status, so build
			// the Response ourselves with an explicit 200.
			const { pathname } = new URL(request.url);
			if (!pathname.startsWith("/api")) {
				const indexHtml = path.join(PUBLIC_DIR, "index.html");
				if (existsSync(indexHtml)) {
					return new Response(Bun.file(indexHtml), {
						status: 200,
						headers: {
							"Content-Type": "text/html; charset=utf-8",
							"Cache-Control": "no-cache",
						},
					});
				}
			}
			set.status = 404;
			return { message: "Not Found" };
		}

		// Service-level errors carry their own status; anything else is a 500.
		if (error?.status) {
			set.status = error.status;
			return { message: error.message };
		}

		set.status = 500;
		logger.error(`[server] 💥 [${code}] Server Error: `, error);
		return { message: "Internal Server Error" };
	})

	// Minimal security headers — the core value helmet used to provide.
	.onRequest(({ set, request }) => {
		set.headers["X-Content-Type-Options"] = "nosniff";
		set.headers["X-Frame-Options"] = "DENY";
		set.headers["Referrer-Policy"] = "no-referrer";
		set.headers["Permissions-Policy"] =
			"camera=(), microphone=(), geolocation=()";
		// Strict CSP. style-src allows 'unsafe-inline' because react-toastify
		// injects its stylesheet at runtime; everything else stays locked to
		// same-origin (no CDNs, no inline scripts — Vite emits external files).
		set.headers["Content-Security-Policy"] =
			"default-src 'none'; base-uri 'none'; form-action 'self'; " +
			"frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; " +
			"style-src 'self' 'unsafe-inline'; font-src 'self'; " +
			"script-src 'self'; connect-src 'self'";
		// The SPA entry must never be cached long (hashed assets get their
		// long max-age from the static plugin instead).
		const { pathname } = new URL(request.url);
		if (pathname === "/" || pathname.endsWith("index.html")) {
			set.headers["Cache-Control"] = "no-cache";
		}
	})

	.use(HealthRoute)
	.use(PasteRoutes)

	.use(
		staticPlugin({
			assets: PUBLIC_DIR,
			prefix: "/",
			indexHTML: true,
			alwaysStatic: true,
			maxAge: 7 * 24 * 60 * 60,
		}),
	);

// OpenAPI UI only in development, matching the eziarr baseline.
if (process.env.NODE_ENV === "development") {
	app.use(
		openapi({
			exclude: {
				paths: ["/", "/*", ""],
			},
			documentation: {
				info: {
					title: "EZJOT API",
					description: "Simple secure text sharing",
					version: "2.1.0",
				},
			},
		}),
	);
	logger.info("[server] 📘 EZJOT OpenAPI UI enabled at /openapi");
}

try {
	app.listen(PORT);
	logger.info(`[server] ✨ EZJOT is running on port ${app.server?.port}`);
} catch (err) {
	logger.error("[server] Failed to start server: ", err);
	process.exit(1);
}
