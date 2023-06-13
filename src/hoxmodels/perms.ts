import { useState } from 'react';
import { createModel } from 'hox';

function usePerms() {
  const [perms, setPerms] = useState(null);

  function onSetPerms(lang: any) {
    setPerms(lang);
  }

  return {
    perms,
    onSetPerms,
  };
}

export default createModel(usePerms);