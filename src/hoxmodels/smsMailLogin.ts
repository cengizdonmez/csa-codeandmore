import { useState } from "react";
import { createModel } from "hox";

interface smsMailLoginItem {
  smsCheck: boolean;
  mailCheck: boolean;
  userMail: string;
  userPhone: string;
}

function useSmsMailLogin() {
  const [smsMail, setSmsMail] = useState<API.TwoFactorLogin | null>(null);

  function onSetSmsMail(data: smsMailLoginItem | null) {
    setSmsMail(data);
  }

  return {
    smsMail,
    onSetSmsMail,
  };
}

export default createModel(useSmsMailLogin);
