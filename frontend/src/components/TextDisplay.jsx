import { useState, useRef, useCallback } from "react";
import { toast } from "../ez/toast";

import { Collapse } from "../ez/motion";
import { btn, cx, inputCls, labelCls, panel, SectionLabel } from "../ez/ui";
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

	const onEnter = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className={cx(panel, "w-full")}>
			<div className="border-b border-line px-5 py-3">
				<SectionLabel>Retrieve a jot</SectionLabel>
			</div>

			<div className="space-y-4 p-5">
				<div>
					<label htmlFor="display-key" className={labelCls}>
						Key
					</label>
					<input
						id="display-key"
						type="text"
						className={cx(inputCls, "font-code")}
						placeholder="Paste your key"
						value={allInfo.key}
						onChange={handleKeyChange}
						onKeyDown={onEnter}
						disabled={loading}
					/>
				</div>

				<div>
					<label htmlFor="display-password" className={labelCls}>
						Password <span className="font-normal">(if one was set)</span>
					</label>
					<div className="relative">
						<input
							id="display-password"
							type={showPassword ? "text" : "password"}
							className={cx(inputCls, "pr-16")}
							placeholder="Enter password"
							value={allInfo.password}
							onChange={handlePasswordChange}
							onKeyDown={onEnter}
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

				<div className="flex gap-2 pt-1">
					<button type="button" onClick={handleSubmit} disabled={loading} className={cx(btn.base, btn.ghost, "flex-1")}>
						{loading ? <Spinner /> : null}
						{loading ? "Fetching…" : "Get text"}
					</button>
					<button type="button" onClick={handleClear} disabled={loading} className={cx(btn.base, btn.ghost)}>
						Clear
					</button>
				</div>
			</div>

			<Collapse open={!!allInfo.text}>
				<div className="border-t border-line">
					<div className="flex items-center gap-3 px-5 pt-4">
						<SectionLabel>Content</SectionLabel>
						<span className="mr-auto font-mono text-[12px] text-mute">{lineCount.toLocaleString("en-US")} lines</span>
						<button
							type="button"
							onClick={() => {
								navigator.clipboard
									.writeText(allInfo.text)
									.then(() => toast.success("Copied"))
									.catch(() => toast.error("Could not copy"));
							}}
							className={cx(btn.sm, btn.ghost)}
						>
							Copy all
						</button>
					</div>
					<label htmlFor="yourtextoutput" className="sr-only">
						Text output
					</label>
					<div className="relative m-5 mt-3 flex overflow-hidden rounded-lg border border-line" style={{ height: "12rem" }}>
						<div
							ref={gutterRef}
							className="hide-scrollbar flex select-none flex-col items-end overflow-y-auto border-r border-line bg-raised py-3 pr-2 font-code text-[13px] text-mute"
							style={{ minWidth: "2.75em", lineHeight: "1.5" }}
							aria-hidden="true"
						>
							{Array.from({ length: lineCount }, (_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional
								<span key={i} className="px-1">
									{i + 1}
								</span>
							))}
						</div>
						<textarea
							id="yourtextoutput"
							ref={textareaRef}
							readOnly
							className="w-full resize-none bg-inset p-3 font-code text-[13px] text-ink focus:outline-none"
							style={{ lineHeight: "1.5" }}
							value={allInfo.text}
							onScroll={handleScroll}
						/>
					</div>
				</div>
			</Collapse>
		</div>
	);
};

export default TextDisplay;
