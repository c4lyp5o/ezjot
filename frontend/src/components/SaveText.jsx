import { useState } from "react";
import { toast } from "../ez/toast";
import { Collapse } from "../ez/motion";
import { btn, Chip, cx, panel, SectionLabel } from "../ez/ui";
import TextEditor from "./TextEditor";

const SaveText = () => {
	const [allInfo, setAllInfo] = useState({
		text: "",
		password: "",
		burnAfterReading: false,
		key: "",
	});
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleSubmit = async () => {
		if (allInfo.text.trim() === "") return toast.error("Nothing to save");

		setLoading(true);

		try {
			const response = await fetch("/api/v1/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: allInfo.text,
					password: allInfo.password,
					burnAfterReading: allInfo.burnAfterReading,
				}),
			});

			if (!response.ok) {
				let message = `HTTP error! status: ${response.status}`;
				try {
					const errorData = await response.json();
					if (errorData?.message) message = errorData.message;
				} catch {
					/* non-JSON error body */
				}
				throw new Error(message);
			}

			// API returns the key as a bare string (OpenAPI: t.String()).
			const key = await response.text();
			setAllInfo((prev) => ({ ...prev, key }));
			setCopied(false);
			toast.success("Saved");
		} catch (error) {
			toast.error(error.message || "Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	const handleCopyKey = async () => {
		try {
			await navigator.clipboard.writeText(allInfo.key);
			setCopied(true);
			toast.success("Key copied");
		} catch {
			toast.error("Could not copy key");
		}
	};

	return (
		<>
			<TextEditor
				allInfo={allInfo}
				setAllInfo={setAllInfo}
				loading={loading}
				handleSubmit={handleSubmit}
				aria-label="Text Editor"
			/>
			<Collapse open={!!allInfo?.key}>
				<div className={cx(panel, "mt-4")} aria-live="polite">
					<div className="flex items-center gap-2 border-b border-line px-5 py-3">
						<SectionLabel>Your key</SectionLabel>
						<span className="text-[12px] text-mute">The only way back to this jot.</span>
						<Chip tone="ok" className="ml-auto">
							Saved
						</Chip>
					</div>
					<div className="flex items-center gap-2 px-5 py-4">
						<code className="flex-1 break-all rounded-lg border border-line bg-inset px-3 py-2 text-[13px] text-accent">{allInfo.key}</code>
						<button type="button" onClick={handleCopyKey} className={cx(btn.base, btn.ghost)}>
							{copied ? "Copied" : "Copy"}
						</button>
					</div>
				</div>
			</Collapse>
		</>
	);
};

export default SaveText;
