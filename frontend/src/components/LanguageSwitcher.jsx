import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="d-flex align-items-center ms-3">
            <select
                className="form-select form-select-sm border-0 bg-transparent text-light"
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ width: 'auto', cursor: 'pointer' }}
            >
                <option value="uz" className="text-dark">UZ</option>
                <option value="ru" className="text-dark">RU</option>
                <option value="en" className="text-dark">EN</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
