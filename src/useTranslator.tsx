import { useEffect, useState } from "react";

const useTranslator = (code: string, apiKey: string) => {
	const [loading, setLoading] = useState(false);

	const translate = async (value: string) => {
		try {
			setLoading(true);
			const response = await fetch(
				`https://translation.googleapis.com/language/translate/v2?source=en&target=${code}&key=${apiKey}&q=${value}&format=text`
			);
			const jsonResponse = await response.json();
			if (
				jsonResponse.data &&
				jsonResponse.data.translations &&
				jsonResponse.data.translations.length > 0
			) {
				const translatedText =
					jsonResponse.data.translations[0].translatedText;
				setLoading(false);
				return translatedText;
			} else {
				throw new Error("Translation error: Invalid response format");
			}
		} catch (e) {
			console.error("Translation error:", e);
			setLoading(false);
			return value;
		}
	};

	useEffect(() => {
		return () => {
			setLoading(false);
		};
	}, []);

	return { translate, loading };
};

export default useTranslator;
