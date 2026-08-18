import crypto from "node:crypto";
import net from "node:net";
import { KEY_LENGTH } from "./config";

// ---- Client IP resolution (trust-aware) -----------------------------------
// Bun's Request has no .ip property; the socket peer is only reachable via
// server.requestIP(request) (Elysia injects `server` into hooks and handlers).

const isPrivateIpv4 = (ip) => {
	// ip is a validated IPv4 string
	const [a, b] = ip.split(".").map((x) => Number.parseInt(x, 10));

	// 0.0.0.0/8 (includes 0.0.0.0)
	if (a === 0) return true;

	// 10.0.0.0/8
	if (a === 10) return true;

	// 127.0.0.0/8 (loopback)
	if (a === 127) return true;

	// 169.254.0.0/16 (link-local, includes cloud metadata hops sometimes)
	if (a === 169 && b === 254) return true;

	// 172.16.0.0/12
	if (a === 172 && b >= 16 && b <= 31) return true;

	// 192.168.0.0/16
	if (a === 192 && b === 168) return true;

	// 100.64.0.0/10 (carrier-grade NAT)
	if (a === 100 && b >= 64 && b <= 127) return true;

	return false;
};

const isPrivateIpv6 = (ip) => {
	const normalized = ip.toLowerCase();

	// :: / ::1
	if (normalized === "::" || normalized === "::1") return true;

	// fc00::/7 (unique local addresses)
	if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

	// fe80::/10 (link-local unicast)
	if (normalized.startsWith("fe8") || normalized.startsWith("fe9")) return true;
	if (normalized.startsWith("fea") || normalized.startsWith("feb")) return true;

	// ::ffff:127.0.0.1 etc (IPv4-mapped IPv6) — treat as suspicious
	if (normalized.startsWith("::ffff:")) return true;

	return false;
};

const isIpDisallowed = (ip) => {
	const family = net.isIP(ip);

	if (family === 4) return isPrivateIpv4(ip);
	if (family === 6) return isPrivateIpv6(ip);

	// not an IP string
	return true;
};

export const getClientIp = (request, server) => {
	const directIp =
		server?.requestIP?.(request)?.address?.replace(/^::ffff:/, "") ?? null;

	const xff = request.headers.get("x-forwarded-for");
	// Only trust X-Forwarded-For when the direct peer is private/loopback
	// (i.e. a reverse proxy in front). Otherwise a public client could spoof
	// the header to bypass rate limiting.
	if (xff && directIp && isIpDisallowed(directIp)) {
		return xff.split(",")[0].trim();
	}

	return directIp ?? "unknown";
};

// ---- Key generation ---------------------------------------------------------

export const generateKey = () => crypto.randomBytes(KEY_LENGTH).toString("hex");

// bun:sqlite surfaces constraint errors with code SQLITE_CONSTRAINT_*; also
// match the message form in case the code is missing in some versions.
export const isUniqueViolation = (error) =>
	error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
	/UNIQUE constraint failed/i.test(error?.message ?? "");

// ---- Password hashing -------------------------------------------------------
// scrypt with a per-paste random salt, stored as "salt:hash". Constant-time
// comparison so timing can't leak whether the first bytes matched.

const SCRYPT_KEYLEN = 64;

export const hashPassword = (password) => {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
	return `${salt}:${hash}`;
};

export const verifyPassword = (password, stored) => {
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;

	const candidate = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
	const expected = Buffer.from(hash, "hex");

	return (
		candidate.length === expected.length &&
		crypto.timingSafeEqual(candidate, expected)
	);
};
