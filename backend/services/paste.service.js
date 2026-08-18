import { PasteModel } from "../models/paste.model";
import {
	generateKey,
	hashPassword,
	isUniqueViolation,
	verifyPassword,
} from "../utils";
import { generalLogger as logger } from "../logger";

export const PasteService = {
	saveText: async ({ text, password = "", burnAfterReading = false }) => {
		// TypeBox's minLength accepts whitespace-only strings; the UI trims,
		// so the API must too.
		if (!text.trim()) {
			const error = new Error("Bad Request");
			error.status = 400;
			throw error;
		}

		const passwordHash = password ? hashPassword(password) : null;

		// Retry on UNIQUE collision instead of checking first: check-then-insert
		// races under concurrency, and the constraint is the source of truth.
		for (let attempt = 0; attempt < 10; attempt++) {
			const key = generateKey();
			try {
				PasteModel.create({ key, text, passwordHash, burnAfterReading });
				logger.info(`[paste] ✍️ New paste ${key} saved`);
				return key;
			} catch (error) {
				if (!isUniqueViolation(error)) throw error;
				logger.warn(`[paste] 🔁 Key ${key} collided, retrying…`);
			}
		}

		const error = new Error("Could not generate a unique key");
		error.status = 500;
		throw error;
	},

	getText: async ({ key, password = "" }) => {
		const row = PasteModel.findByKey(key);
		if (!row) {
			const error = new Error("Not Found");
			error.status = 404;
			throw error;
		}

		if (row.password_hash && !verifyPassword(password, row.password_hash)) {
			const error = new Error("Incorrect password");
			error.status = 403;
			throw error;
		}

		// Burn-after-reading: delete BEFORE returning so a racing second fetch
		// can't read the paste again after the first one burned it.
		if (row.burn_after_reading) {
			PasteModel.deleteByKey(key);
			logger.info(`[paste] 🔥 Burned paste ${key} after reading`);
		}

		return row.text;
	},

	purgeAll: async () => {
		const count = PasteModel.purgeAll();
		logger.warn(`[paste] 🧹 Purged ${count} pastes`);
		return count;
	},
};
