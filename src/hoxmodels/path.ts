import { useState } from 'react';
import { createModel } from 'hox';


function usePath() {
  const [path, setPath] = useState<string | null>(null);

  function onSetPath(path: string) {
    setPath(path);
  }

  return {
    path,
    onSetPath,
  };
}

export default createModel(usePath)
