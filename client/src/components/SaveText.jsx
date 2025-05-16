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
				const errorData = await response.json();
				throw new Error(
					errorData.message || `HTTP error! status: ${response.status}`,
				);
			}

			const key = await response.json();
			setAllInfo({
				...allInfo,
				key,
			});
			toast.success("Saved");
		} catch (error) {
			//   console.error('Error during save operation:', error);
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
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
				<div
					className="flex flex-col items-center justify-center p-5 bg-white border border-blue-300 rounded-lg shadow-lg w-11/12 mx-auto mt-3"
					aria-live="polite"
				>
					<h2 className="text-lg font-semibold text-blue-700 mb-2">
						Your Paste Credentials
					</h2>
					<div
						className={
							allInfo.password
								? "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
								: "flex flex-col items-center w-full max-w-md"
						}
					>
						<div className="flex flex-col items-start mb-1">
							<span className="text-gray-600 text-sm mb-1" id="key-label">
								Key:
							</span>
							<div className="flex items-center space-x-2 w-full">
								<span
									className="font-mono text-base bg-gray-200 px-2 py-1 rounded select-all"
									data-testid="key-value"
									aria-labelledby="key-label"
								>
									{allInfo.key}
								</span>
								<button
									className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
									onClick={() => navigator.clipboard.writeText(allInfo.key)}
									aria-label="Copy key to clipboard"
									type="button"
								>
									Copy
								</button>
							</div>
						</div>
						{allInfo?.password && (
							<div className="flex flex-col items-start mb-1">
								<span
									className="text-gray-600 text-sm mb-1"
									id="password-label"
								>
									Password:
								</span>
								<div className="flex items-center space-x-2 w-full">
									<span
										className="font-mono text-base bg-gray-200 px-2 py-1 rounded select-all"
										data-testid="password-value"
										aria-labelledby="password-label"
									>
										{allInfo.password}
									</span>
									<button
										className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
										onClick={() =>
											navigator.clipboard.writeText(allInfo.password)
										}
										aria-label="Copy password to clipboard"
										type="button"
									>
										Copy
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default SaveText;
