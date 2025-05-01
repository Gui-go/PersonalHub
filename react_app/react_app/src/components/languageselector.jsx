import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select
      className="language-selector bg-gray-800 p-2 rounded"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="pt">Português</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="zh">中文</option>
    </select>
  );
};

export default LanguageSelector;