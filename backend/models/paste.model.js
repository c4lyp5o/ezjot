import db from "../db";

export const PasteModel = {
	create: ({ key, text, passwordHash, burnAfterReading }) => {
		db.prepare(
			"INSERT INTO pastes (key, text, password_hash, burn_after_reading) VALUES (?, ?, ?, ?)",
		).run(key, text, passwordHash, burnAfterReading ? 1 : 0);
	},

	findByKey: (key) => db.prepare("SELECT * FROM pastes WHERE key = ?").get(key),

	deleteByKey: (key) => {
		db.prepare("DELETE FROM pastes WHERE key = ?").run(key);
	},

	purgeAll: () => {
		const { changes } = db.prepare("DELETE FROM pastes").run();
		return changes;
	},
};
