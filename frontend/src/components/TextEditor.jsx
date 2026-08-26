import { useState, useCallback } from "react";

import Spinner from "./Spinner";

const TextEditor = ({ allInfo, setAllInfo, loading, handleSubmit }) => {
	const [showPassword, setShowPassword] = useState(false);

	const maxCharacters = 1000;
	const characterCount = allInfo.text.length;

	const handleTextChange = useCallback(
		(event) => {
			setAllInfo((prev) => ({
				...prev,
				text: event.target.value,
			}));
		},
		[setAllInfo],
	);

	const handlePasswordChange = useCallback(
		(event) => {
			setAllInfo((prev) => ({
				...prev,
				password: event.target.value,
			}));
		},
		[setAllInfo],
	);

	const handleBurnAfterReadingChange = useCallback(
		(event) => {
			setAllInfo((prev) => ({
				...prev,
				burnAfterReading: event.target.checked,
			}));
		},
		[setAllInfo],
	);

	const handleClear = async () => {
		setAllInfo({
			text: "",
			password: "",
			burnAfterReading: false,
			key: "",
		});
	};

	const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

	return (
		<div className="w-full bg-white border border-stone-200 rounded-xl shadow-sm">
			<div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
				<h2 className="text-sm font-semibold text-stone-700">Save a jot</h2>
				<span
					className={`font-mono text-xs ${
						characterCount >= maxCharacters ? "text-rose-600" : "text-stone-400"
					}`}
				>
					{characterCount}/{maxCharacters}
				</span>
			</div>

			<label htmlFor="yoursoontobetext" className="sr-only">
				Text Area
			</label>
			<textarea
				id="yoursoontobetext"
				className="w-full p-4 text-sm font-mono leading-relaxed text-stone-800 bg-paper resize-none focus:outline-none focus:ring-2 focus:ring-accent-400/40 transition-shadow"
				style={{ height: "12rem" }}
				value={allInfo.text}
				onChange={handleTextChange}
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();
						handleSubmit();
					}
				}}
				placeholder="Jot something down…"
				maxLength={maxCharacters}
				disabled={loading}
			/>

			<div className="px-4 py-3 border-t border-stone-100 space-y-3">
				<div>
					<label
						htmlFor="editor-password"
						className="block text-xs font-medium text-stone-500 mb-1"
					>
						Password{" "}
						<span className="font-normal text-stone-400">(optional)</span>
					</label>
					<div className="relative">
						<input
							id="editor-password"
							type={showPassword ? "text" : "password"}
							className="w-full px-3 py-2 pr-16 text-sm font-mono text-stone-800 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-500 transition-shadow"
							placeholder="Lock this jot"
							value={allInfo.password}
							onChange={handlePasswordChange}
							disabled={loading}
						/>
						<button
							type="button"
							onClick={handleShowPasswordToggle}
							className="absolute inset-y-0 right-0 px-3 text-[11px] font-semibold tracking-wide text-stone-400 hover:text-accent-600 transition-colors"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? "HIDE" : "SHOW"}
						</button>
					</div>
				</div>

				<label className="flex items-center gap-2 text-sm text-stone-600 select-none cursor-pointer">
					<input
						type="checkbox"
						checked={allInfo.burnAfterReading}
						onChange={handleBurnAfterReadingChange}
						disabled={loading}
						className="w-4 h-4 rounded accent-accent-600"
					/>
					Burn after reading
				</label>

				<div className="flex gap-2 pt-1">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{loading ? <Spinner /> : null}
						{loading ? "Saving…" : "Save jot"}
					</button>
					<button
						type="button"
						onClick={handleClear}
						disabled={loading}
						className="px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors disabled:opacity-60"
					>
						Clear
					</button>
				</div>
				<p className="text-[11px] text-stone-400">
					Enter to save · Shift+Enter for a new line
				</p>
			</div>
		</div>
	);
};

export default TextEditor;
