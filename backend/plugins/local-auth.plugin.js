// Guards admin-only endpoints so they only answer loopback traffic
// (e.g. the container's weekly cron purge). X-Forwarded-For is deliberately
// NOT trusted here: only a real local socket connection passes.
export const isLocalRequest = ({ request, server }) => {
	const ip =
		server?.requestIP?.(request)?.address?.replace(/^::ffff:/, "") ?? null;

	return ip === "127.0.0.1" || ip === "::1";
};
