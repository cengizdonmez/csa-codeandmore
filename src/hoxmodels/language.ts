import { useState } from 'react';
import { createModel } from 'hox';

interface LanguageListItem {
  id: number;
  flagPath: string;
  name: string;
  abbreviationName: string;
  status: boolean;
  createDate: Date;
  updateDate: null;
  createdBy: null;
  updatedBy: null;
  token: string;
}

function useLanguage() {
  const [language, setLanguage] = useState<LanguageListItem | null>(null);

  function onSetLanguage(lang: LanguageListItem) {
    setLanguage(lang);
  }

  return {
    language,
    onSetLanguage,
  };
}

export default createModel(useLanguage);
