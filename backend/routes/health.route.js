import { Elysia, t } from "elysia";

export const HealthRoute = new Elysia({ name: "HealthRoute" })
	.get(
		"/api/v1",
		() => ({ success: true, message: "EZJOT API is Running" }),
		{
			response: t.Object({
				success: t.Boolean(),
				message: t.String(),
			}),
			detail: {
				summary: "API Health Check",
				description: "Simple endpoint to verify that the API is up and running",
				tags: ["General"],
			},
		},
	)
	.get("/api/v1/healthcheck", () => ({ message: "ok" }), {
		// Kept for the Docker HEALTHCHECK probe
		detail: { hide: true },
	});
