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
		<div className="flex flex-col items-center justify-center p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-md w-11/12 mx-auto">
			<label htmlFor="yoursoontobetext" className="sr-only">
				Text Area
			</label>
			<textarea
				className="w-full h-48 p-3 text-base font-mono text-gray-800 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
				style={{ lineHeight: "1.5", height: "12rem" }}
				value={allInfo.text}
				onChange={handleTextChange}
				onKeyDown={(event) => {
					if (
						(event.key === "Enter" && event.shiftKey) ||
						(event.key === "Enter" && event.ctrlKey)
					) {
						event.preventDefault();
						handleSubmit();
					}
				}}
				rows={4}
				cols={50}
				name="yoursoontobetext"
				id="yoursoontobetext"
				readOnly={false}
				autoComplete="off"
				autoCorrect="off"
				spellCheck="false"
				autoCapitalize="none"
				maxLength={maxCharacters}
				placeholder="Paste your text here..."
				aria-label="Text Area"
			/>
			<div className="w-full text-right text-xs text-gray-500 mb-2">
				{characterCount}/{maxCharacters} characters
			</div>
			<div className="relative w-full">
				<input
					type={showPassword ? "text" : "password"}
					className="w-full p-1 text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
					value={allInfo.password}
					onChange={handlePasswordChange}
					placeholder="Enter a password (optional)"
					id="password-input"
					aria-label="Password (optional)"
					autoComplete="off"
					disabled={loading}
				/>
				<button
					type="button"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 bg-gray-200 rounded px-2 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					onClick={handleShowPasswordToggle}
					disabled={loading || allInfo.password === ""}
					tabIndex={-1}
					aria-pressed={showPassword}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{showPassword ? "Hide" : "Show"}
				</button>
			</div>
			<div className="flex items-center mt-4 mb-4">
				<input
					type="checkbox"
					id="burnAfterReading"
					className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					checked={allInfo.burnAfterReading}
					onChange={handleBurnAfterReadingChange}
					aria-checked={allInfo.burnAfterReading}
					aria-label="Burn after reading"
				/>
				<label htmlFor="burnAfterReading" className="text-gray-700">
					Burn after reading
				</label>
			</div>
			<div className="flex space-x-2 w-full">
				<button
					type="button"
					className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
					onClick={handleSubmit}
					disabled={loading}
					aria-label="Save Text"
					aria-disabled={loading}
				>
					{/* {loading ? <Spinner /> : null} */}
					{loading ? "Saving..." : "Save"}
				</button>
				<button
					type="button"
					className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-150"
					onClick={handleClear}
					aria-label="Clear File"
				>
					Clear
				</button>
			</div>
			<div className="w-full text-xs text-gray-600 text-left mt-1">
				Use Shift+Enter or Ctrl+Enter to save.
			</div>
		</div>
	);
};

export default TextEditor;
