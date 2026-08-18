import { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

import Spinner from "./Spinner";

const TextDisplay = ({ allInfo, setAllInfo, loading, handleSubmit }) => {
	const textareaRef = useRef(null);
	const gutterRef = useRef(null);

	const [showPassword, setShowPassword] = useState(false);

	const handleKeyChange = useCallback(
		(event) => {
			setAllInfo((prev) => ({
				...prev,
				key: event.target.value,
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

	const handleScroll = (event) => {
		if (gutterRef.current) {
			gutterRef.current.scrollTop = event.target.scrollTop;
		}
	};

	const handleClear = useCallback(() => {
		setAllInfo({
			key: "",
			password: "",
			text: "",
		});
	}, [setAllInfo]);

	const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

	const lineCount = allInfo.text ? allInfo.text.split("\n").length : 1;

	return (
		<div className="w-full bg-white border border-stone-200 rounded-xl shadow-sm">
			<div className="px-4 py-3 border-b border-stone-100">
				<h2 className="text-sm font-semibold text-stone-700">Retrieve a jot</h2>
			</div>

			<div className="p-4 space-y-3">
				<div>
					<label
						htmlFor="display-key"
						className="block text-xs font-medium text-stone-500 mb-1"
					>
						Key
					</label>
					<input
						id="display-key"
						type="text"
						className="w-full px-3 py-2 text-sm font-mono text-stone-800 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-500 transition-shadow"
						placeholder="Paste your key"
						value={allInfo.key}
						onChange={handleKeyChange}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleSubmit();
							}
						}}
						disabled={loading}
					/>
				</div>

				<div>
					<label
						htmlFor="display-password"
						className="block text-xs font-medium text-stone-500 mb-1"
					>
						Password <span className="font-normal text-stone-400">(if set)</span>
					</label>
					<div className="relative">
						<input
							id="display-password"
							type={showPassword ? "text" : "password"}
							className="w-full px-3 py-2 pr-16 text-sm font-mono text-stone-800 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-500 transition-shadow"
							placeholder="Enter password"
							value={allInfo.password}
							onChange={handlePasswordChange}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									handleSubmit();
								}
							}}
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

				<div className="flex gap-2 pt-1">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{loading ? <Spinner /> : null}
						{loading ? "Fetching…" : "Get text"}
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
			</div>

			{allInfo.text && (
				<div className="border-t border-stone-100">
					<div className="px-4 pt-3 flex items-center justify-between">
						<h3 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
							Content
						</h3>
						<button
							type="button"
							onClick={() => {
								navigator.clipboard
									.writeText(allInfo.text)
									.then(() => toast.success("Copied"))
									.catch(() => toast.error("Could not copy"));
							}}
							className="text-xs font-medium text-stone-500 hover:text-accent-600 transition-colors"
						>
							Copy all
						</button>
					</div>
					<label htmlFor="yoursoontobetext" className="sr-only">
						Text Output
					</label>
					<div className="relative flex m-4 mt-2" style={{ height: "12rem" }}>
						{/* Line numbers gutter */}
						<div
							ref={gutterRef}
							className="flex flex-col items-end rounded-l-lg select-none text-stone-400 font-mono text-sm leading-relaxed py-3 pr-2 overflow-y-auto hide-scrollbar border border-r-0 border-stone-200 bg-stone-50"
							style={{ minWidth: "2.5em", lineHeight: "1.5" }}
							aria-hidden="true"
						>
							{Array.from({ length: lineCount }, (_, i) => (
								<span key={i} className="px-1">
									{i + 1}
								</span>
							))}
						</div>
						<textarea
							id="yoursoontobetext"
							ref={textareaRef}
							readOnly
							className="w-full p-3 text-sm font-mono leading-relaxed text-stone-800 bg-paper rounded-r-lg border border-stone-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400/40"
							style={{ lineHeight: "1.5" }}
							value={allInfo.text}
							onScroll={handleScroll}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default TextDisplay;
