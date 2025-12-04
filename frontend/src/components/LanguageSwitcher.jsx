import React from "react";
import { languageOptions } from "../i18n";

export default function LanguageSwitcher({ language, setLanguage }) {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-1 rounded bg-gray-200 dark:bg-gray-700"
    >
      {Object.entries(languageOptions).map(([code, label]) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  );
}
