import { useState } from 'react';
import { createModel } from 'hox';


function useSystemValues() {
  const [systemValues, setSystemValues] = useState<any | null>(null);

  function onSetSystemValues(systemValues: any) {
    setSystemValues(systemValues);
  }

  return {
    systemValues,
    onSetSystemValues,
  };
}

export default createModel(useSystemValues)
