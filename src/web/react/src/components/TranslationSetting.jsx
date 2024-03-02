import { LANGUAGES} from "../global/globalVars";
import React from 'react';
import { useTranslation } from "react-i18next";

export default function TranslationSetting(){

    const {i18n} = useTranslation();
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        i18n.changeLanguage(newLang);
    };

    const languageOptions = LANGUAGES.map((value, index)=>{

        return (<option key={value.code} value={value.code} className="">
            {value.label}
        </option>);
    })
    return (
        <select defaultValue={'en'} onChange={handleLanguageChange} className="form-select form-select-sm">
            {languageOptions}
        </select>
    )
}