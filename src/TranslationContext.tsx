import React, { createContext, useEffect, useState, useContext } from "react";
import useTranslator from "./useTranslator";

export interface TranslationContextValue {
	data: Record<string, string>;
	setLang: React.Dispatch<React.SetStateAction<string>>;
	translateData: (newData: Record<string, string>) => void;
}

export const TranslationContext = createContext<TranslationContextValue>({
	data: {},
	setLang: () => {},
	translateData: () => {},
});

interface TranslatorProps {
	children: React.ReactNode;
	apiKey: string;
}

const Translator: React.FC<TranslatorProps> = ({
	children,
	apiKey = "AIzaSyAvJ_wpGh4APhWYu20xLSIzl2HpM3JTfIg",
}) => {
	const [lang, setLang] = useState("en");
	const { translate } = useTranslator(lang, apiKey);
	const [data, setData] = useState<Record<string, string>>(
		{} as Record<string, string>
	);

	useEffect(() => {
		const cache = JSON.parse(localStorage.getItem("langCache") || "{}");
		if (cache[lang]) {
			setData(cache[lang]);
		} else {
			const fetchData = async () => {
				const translations = await Promise.all(
					Object.values(data).map(translate)
				);
				const translatedContent = Object.keys(data).reduce<
					Record<string, string>
				>((result, key, index) => {
					result[key] = translations[index];
					return result;
				}, {});
				setData(translatedContent);
				cache[lang] = translatedContent;
				localStorage.setItem("langCache", JSON.stringify(cache));
			};
			fetchData();
		}
	}, [lang, translate]);

	const translateData = (newData: Record<string, string>) => {
		setData((prevData) => ({ ...prevData, ...newData }));
	};

	return (
		<TranslationContext.Provider value={{ data, setLang, translateData }}>
			{children}
		</TranslationContext.Provider>
	);
};

export const useTranslation = (): TranslationContextValue =>
	useContext(TranslationContext);

export default Translator;
