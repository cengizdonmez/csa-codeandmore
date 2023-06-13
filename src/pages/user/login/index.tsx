import { Alert, Checkbox, message } from "antd";
import React, { useState } from "react";
import { Link, useModel } from "umi";
import { getPageQuery } from "@/utils/utils";
import { accountLogin, LoginParamsType } from "@/services/login";
import jwt from "jsonwebtoken";
import Footer from "@/components/Footer";
import LoginFrom from "./components/Login";
import styles from "./style.less";
import { history } from "umi";
import smsMailLogin from "@/hoxmodels/smsMailLogin";

const { Tab, Email, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf("#"));
      }
    } else {
      window.location.href = "/";
      return;
    }
  }
  window.location.href =
    urlParams.href.split(urlParams.pathname)[0] + (redirect || "/");
};

const Login: React.FC<{}> = () => {
  const { onSetSmsMail } = smsMailLogin();
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);
  const { refresh } = useModel("@@initialState");
  const [type, setType] = useState<string>("account");

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      const msg = await accountLogin({ ...values });
      if (msg.token) {
        message.success("Giriş Başarılı！");
        localStorage.setItem("token", msg.token!);
        localStorage.setItem("userId", msg.userId!.toString());
        localStorage.setItem(
          "perms",
          jwt.sign(msg.operationClaims, "codeandmore-secret-01")
        );
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        setUserLoginState(msg);
        return;
      }
      if (msg.smsCheck) {
        onSetSmsMail(msg);
        history.push({
          pathname: "/user/smsLogin",
        });
        return;
      }
      if (msg.mailCheck) {
        onSetSmsMail(msg);
        history.push({
          pathname: "/user/mailLogin",
        });
        return;
      }
    } catch (error) {
      message.error("Giriş Başarısız，Lütfen tekrar deneyiniz！");
    }
    setSubmitting(false);
  };

  const { token } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img
                alt="logo"
                className={styles.logo}
                src="https://www.codeandmore.com.tr//assets/images/logo.jpg"
              />
            </Link>
          </div>
          <span className={styles.title}>YÖNETİM PANELİ</span>
        </div>

        <div className={styles.main}>
          <LoginFrom
            activeKey={type}
            onTabChange={setType}
            onSubmit={handleSubmit}
          >
            <Tab key="account" tab="GİRİŞ YAP">
              {token && !submitting && (
                <LoginMessage content="Incorrect account or password" />
              )}

              <Email
                name="email"
                placeholder="E-Posta Giriniz"
                defaultValue=""
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="Parola Giriniz"
                defaultValue=""
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              />
            </Tab>
            {/* <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                Beni Hatırla
              </Checkbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                Şifremi Unuttum
              </a>
            </div> */}
            <Submit loading={submitting}>Giriş Yap</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
