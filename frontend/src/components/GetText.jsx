import { useState } from "react";
import { toast } from "react-toastify";
import TextDisplay from "./TextDisplay";

const GetText = () => {
	const [allInfo, setAllInfo] = useState({
		key: "",
		password: "",
		text: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!allInfo.key.trim()) return toast.error("Please enter a key");

		setLoading(true);

		try {
			const response = await fetch("/api/v1/get", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					key: allInfo.key.trim(),
					password: allInfo.password,
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

			// API returns the paste text as a bare string (OpenAPI: t.String()).
			const text = await response.text();
			setAllInfo((prev) => ({
				...prev,
				text,
			}));
			toast.success("Gottem!");
		} catch (error) {
			toast.error(error.message || "No text found using the key provided!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<TextDisplay
			allInfo={allInfo}
			setAllInfo={setAllInfo}
			loading={loading}
			handleSubmit={handleSubmit}
			aria-label="Text Display"
		/>
	);
};

export default GetText;
