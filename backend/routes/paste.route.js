import { Elysia, t } from "elysia";
import { PasteService } from "../services/paste.service";
import { rateLimitHandler } from "../plugins/rate-limit.plugin";
import { isLocalRequest } from "../plugins/local-auth.plugin";
import {
	MAX_KEY_LENGTH,
	MAX_PASSWORD_LENGTH,
	MAX_TEXT_LENGTH,
	RATE_LIMIT,
} from "../config";

export const PasteRoutes = new Elysia({ name: "PasteRoutes" })
	// Guard-level hook (not a plugin): scoped to these routes, fires for each.
	.onBeforeHandle(rateLimitHandler(RATE_LIMIT))

	.post(
		"/api/v1/save",
		async ({ body, set }) => {
			const key = await PasteService.saveText(body);
			set.status = 201;
			return key;
		},
		{
			body: t.Object({
				text: t.String({ minLength: 1, maxLength: MAX_TEXT_LENGTH }),
				password: t.Optional(t.String({ maxLength: MAX_PASSWORD_LENGTH })),
				burnAfterReading: t.Optional(t.Boolean()),
			}),
			response: t.String(),
			detail: {
				summary: "Save a paste",
				description: "Stores text and returns the share key",
				tags: ["Pastes"],
			},
		},
	)

	.post(
		"/api/v1/get",
		async ({ body }) => PasteService.getText(body),
		{
			body: t.Object({
				key: t.String({ minLength: 1, maxLength: MAX_KEY_LENGTH }),
				password: t.Optional(t.String({ maxLength: MAX_PASSWORD_LENGTH })),
			}),
			response: t.String(),
			detail: {
				summary: "Fetch a paste",
				description: "Returns the text for a key, enforcing its password if set",
				tags: ["Pastes"],
			},
		},
	)

	.delete("/api/v1/purge", async ({ set }) => {
		const count = await PasteService.purgeAll();
		return { message: "All keys purged", count };
	}, {
		beforeHandle: ({ request, server, set }) => {
			if (!isLocalRequest({ request, server })) {
				set.status = 403;
				return { message: "Forbidden" };
			}
		},
		detail: {
			summary: "Purge all pastes",
			description: "Deletes every paste. Loopback connections only (cron).",
			tags: ["Pastes"],
		},
	});
