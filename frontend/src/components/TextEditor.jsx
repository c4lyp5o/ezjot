import { useState, useCallback } from "react";

import { btn, cx, inputCls, Kbd, labelCls, panel, SectionLabel, Toggle } from "../ez/ui";
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
		<div className={cx(panel, "w-full")}>
			<div className="flex items-center justify-between border-b border-line px-5 py-3">
				<SectionLabel>Save a jot</SectionLabel>
				<span className={cx("font-mono text-[12px]", characterCount >= maxCharacters ? "text-bad" : "text-mute")}>
					{characterCount.toLocaleString("en-US")} / {maxCharacters.toLocaleString("en-US")}
				</span>
			</div>
			<div className="h-px bg-line">
				<div
					className={cx("h-px origin-left transition-transform duration-300", characterCount >= maxCharacters ? "bg-bad" : "bg-accent")}
					style={{ transform: `scaleX(${characterCount / maxCharacters})` }}
				/>
			</div>

			<label htmlFor="yoursoontobetext" className="sr-only">
				Text area
			</label>
			<textarea
				id="yoursoontobetext"
				className="block w-full resize-none bg-inset px-5 py-4 font-code text-[13px] leading-relaxed text-ink placeholder:text-mute focus:outline-none"
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

			<div className="space-y-4 border-t border-line px-5 py-4">
				<div>
					<label htmlFor="editor-password" className={labelCls}>
						Password <span className="font-normal">(optional)</span>
					</label>
					<div className="relative">
						<input
							id="editor-password"
							type={showPassword ? "text" : "password"}
							className={cx(inputCls, "pr-16")}
							placeholder="Lock this jot"
							value={allInfo.password}
							onChange={handlePasswordChange}
							disabled={loading}
						/>
						<button
							type="button"
							onClick={handleShowPasswordToggle}
							className="absolute inset-y-0 right-0 px-3 text-[12px] text-mute hover:text-ink"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Toggle
						checked={allInfo.burnAfterReading}
						onChange={(v) => setAllInfo((prev) => ({ ...prev, burnAfterReading: v }))}
						label="Burn after reading"
						disabled={loading}
					/>
					<span className="text-[13px] text-dim">Burn after reading</span>
				</div>

				<div className="flex gap-2 pt-1">
					<button type="button" onClick={handleSubmit} disabled={loading} className={cx(btn.base, btn.primary, "flex-1")}>
						{loading ? <Spinner /> : null}
						{loading ? "Saving…" : "Save jot"}
					</button>
					<button type="button" onClick={handleClear} disabled={loading} className={cx(btn.base, btn.ghost)}>
						Clear
					</button>
				</div>
				<p className="flex items-center gap-1.5 text-[12px] text-mute">
					<Kbd>Enter</Kbd> to save · <Kbd>Shift Enter</Kbd> for a new line
				</p>
			</div>
		</div>
	);
};

export default TextEditor;
