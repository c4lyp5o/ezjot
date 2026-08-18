import { useState } from "react";
import { toast } from "react-toastify";
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
			{allInfo?.key && (
				<div className="w-full mt-4 bg-white border border-stone-200 rounded-xl shadow-sm">
					<div className="px-4 py-3 border-b border-stone-100">
						<p className="text-sm font-semibold text-stone-700">Your key</p>
						<p className="text-xs text-stone-400 mt-0.5">
							Use it to retrieve the jot — it&apos;s the only way back.
						</p>
					</div>
					<div className="px-4 py-3 flex items-center gap-2">
						<code className="flex-1 px-3 py-2 font-mono text-sm text-accent-700 bg-accent-50 border border-accent-100 rounded-lg break-all">
							{allInfo.key}
						</code>
						<button
							type="button"
							onClick={handleCopyKey}
							className="px-3 py-2 text-sm font-medium text-accent-700 bg-accent-50 border border-accent-200 hover:bg-accent-100 rounded-lg transition-colors"
						>
							{copied ? "Copied" : "Copy"}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default SaveText;
