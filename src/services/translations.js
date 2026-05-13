import { EN, ES } from "../enums/languages";

const PROJECT_ID = "66b7b7b3-5bdc-410d-bee1-c24bc800859e";
let translations = null;
let language = ES;

export async function getTranslations(lang, callback) {
    localStorage.clear();
    translations = null;
    language = lang;

    if (language === ES) {
        return callback ? callback() : false;
    }

      const mode = import.meta.env.VITE_MODE;
        if (mode === 'arcade') {
            console.warn('VITE_MODE is set to "arcade". External fetch to Traducila API is disabled.');
            if (callback) callback();
            return;
        }

    return await fetch(
        `https://traducila.vercel.app/api/translations/${PROJECT_ID}/${language}`
    )
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("translations", JSON.stringify(data));
            translations = data;
            if (callback) callback();
        });
}

export function getPhrase(key) {
    if (!translations) {
        const locals = localStorage.getItem("translations");
        translations = locals ? JSON.parse(locals) : null;
    }

    let phrase = key;
    const keys = translations?.data?.words;

    if (keys && Array.isArray(keys)) {
        const translation = keys.find((item) => item.key === key);
        if (translation && translation.translate) {
            phrase = translation.translate;
        }
    }

    return phrase;
}