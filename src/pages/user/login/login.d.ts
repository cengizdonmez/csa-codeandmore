export type smsVerifyResendRequest = {
  phoneNumber: string | null;
};

export type smsVerifyResendResponse = {
  success: boolean;
  message: string;
};
