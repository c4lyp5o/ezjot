import { describe, it, expect, beforeEach } from "bun:test";
import { app } from "../index.js";
import { resetRateLimitBuckets } from "../plugins/rate-limit.plugin";

// Synthetic requests go through app.handle (no real socket). For anything
// that needs a real loopback connection (the purge guard), use fetch against
// the live listener instead.
const baseUrl = `http://127.0.0.1:${app.server?.port}`;

const api = (path, init) =>
	app.handle(new Request(`http://localhost${path}`, init));

const savePaste = (body) =>
	api("/api/v1/save", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

const getPaste = (body) =>
	api("/api/v1/get", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

describe("EZJOT API", () => {
	beforeEach(() => resetRateLimitBuckets());

	it("GET /api/v1 - health check", async () => {
		const res = await api("/api/v1");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			success: true,
			message: "EZJOT API is Running",
		});
	});

	it("GET /api/v1/healthcheck - docker probe", async () => {
		const res = await api("/api/v1/healthcheck");
		expect(res.status).toBe(200);
	});

	it("POST /api/v1/save - returns a share key", async () => {
		const res = await savePaste({ text: "hello world" });
		expect(res.status).toBe(201);
		expect(await res.text()).toMatch(/^[0-9a-f]{6}$/);
	});

	it("save then get - roundtrips the text", async () => {
		const key = await (await savePaste({ text: "roundtrip me" })).text();
		const res = await getPaste({ key });
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("roundtrip me");
	});

	it("whitespace-only text is rejected", async () => {
		const res = await savePaste({ text: "   " });
		expect(res.status).toBe(400);
	});

	it("text over the size cap is rejected", async () => {
		const res = await savePaste({ text: "x".repeat(100_001) });
		expect(res.status).toBe(400);
	});

	it("missing text is rejected", async () => {
		const res = await savePaste({});
		expect(res.status).toBe(400);
	});

	it("password-protected paste denies wrong password", async () => {
		const key = await (
			await savePaste({ text: "secret", password: "hunter2" })
		).text();

		const denied = await getPaste({ key, password: "wrong" });
		expect(denied.status).toBe(403);

		const deniedEmpty = await getPaste({ key });
		expect(deniedEmpty.status).toBe(403);
	});

	it("password-protected paste grants the right password", async () => {
		const key = await (
			await savePaste({ text: "secret", password: "hunter2" })
		).text();

		const res = await getPaste({ key, password: "hunter2" });
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("secret");
	});

	it("unknown key returns 404", async () => {
		const res = await getPaste({ key: "deadbeefdead" });
		expect(res.status).toBe(404);
	});

	it("missing key on get is rejected", async () => {
		const res = await getPaste({});
		expect(res.status).toBe(400);
	});

	it("burn-after-reading paste is deleted after one read", async () => {
		const key = await (
			await savePaste({ text: "one time only", burnAfterReading: true })
		).text();

		const first = await getPaste({ key });
		expect(first.status).toBe(200);
		expect(await first.text()).toBe("one time only");

		const second = await getPaste({ key });
		expect(second.status).toBe(404);
	});

	it("burn-after-reading respects the password", async () => {
		const key = await (
			await savePaste({
				text: "burn with password",
				password: "p4ss",
				burnAfterReading: true,
			})
		).text();

		const denied = await getPaste({ key, password: "nope" });
		expect(denied.status).toBe(403);

		// Wrong password must NOT burn the paste
		const second = await getPaste({ key, password: "p4ss" });
		expect(second.status).toBe(200);
		expect(await second.text()).toBe("burn with password");

		const gone = await getPaste({ key, password: "p4ss" });
		expect(gone.status).toBe(404);
	});

	it("DELETE /api/v1/purge - refuses synthetic (non-loopback) requests", async () => {
		const res = await api("/api/v1/purge", { method: "DELETE" });
		expect(res.status).toBe(403);
	});

	it("DELETE /api/v1/purge - works from a real loopback connection", async () => {
		const key = await (await savePaste({ text: "purge me" })).text();

		const res = await fetch(`${baseUrl}/api/v1/purge`, { method: "DELETE" });
		expect(res.status).toBe(200);

		const gone = await getPaste({ key });
		expect(gone.status).toBe(404);
	});

	it("password hashes are never returned", async () => {
		const key = await (
			await savePaste({ text: "no leak", password: "peekaboo" })
		).text();

		const res = await getPaste({ key, password: "peekaboo" });
		const body = await res.text();
		expect(body).toBe("no leak");
		expect(body).not.toContain("peekaboo");
		expect(body).not.toContain(":");
	});
});
