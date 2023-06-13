declare namespace API {
  export interface CurrentUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    passwordSalt?: string;
    passwordHash?: string;
    status?: boolean;
    phoneNumber?: string;
    userGroupId?: number;
    filePath?: string;
  }

  export interface LoginStateType {
    userId?: number;
    token?: string;
    operationClaims?: Permission[];
  }

  export interface TwoFactorLogin {
    smsCheck: boolean;
    mailCheck: boolean;
    userMail: string;
    userPhone: string;
  }

  export interface Permission {
    id?: number;
    name?: string;
  }
  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
