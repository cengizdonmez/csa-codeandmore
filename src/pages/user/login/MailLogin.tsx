import smsMailLogin from "@/hoxmodels/smsMailLogin";
import React, { useEffect, useState } from "react";
import { history, useModel } from "umi";
import { Link } from "umi";
import Footer from "@/components/Footer";
import LoginFrom from "./components/Login";
import styles from "./style.less";
import { useCreate, useGetOne } from "@/pages/CategoryPages/services";
import { message } from "antd";
import jwt from "jsonwebtoken";
import { getPageQuery } from "@/utils/utils";

const { Password, Submit } = LoginFrom;

type mailLoginPost = {
  emailToken: string;
  email: string | undefined;
};

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
const stringtoStar = (data: string) => {
  var i = data.indexOf("@");
  var startIndex = (i * 0.2) | 0;
  var endIndex = (i * 0.9) | 0;
  return (
    data.slice(0, startIndex) +
    data.slice(startIndex, endIndex).replace(/./g, "*") +
    data.slice(endIndex)
  );
};

const SmsLogin = () => {
  const [resendStatus, setResendStatus] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [mailWithStars, setMailWithStats] = useState<string | null>(null);
  const [onCreateAsync, response, status] = useCreate<
    mailLoginPost,
    API.LoginStateType
  >("/Auth/Verify");

  const [getOne, data, rstatus] = useGetOne<any>("/Auth/ResendMail?email=");
  const { smsMail, onSetSmsMail } = smsMailLogin();
  const { refresh } = useModel("@@initialState");

  useEffect(() => {
    if (!smsMail?.mailCheck) {
      return history.push("/user/login");
    } else {
      setMailWithStats(stringtoStar(smsMail?.userMail));
    }
  }, []);

  const handleSubmit = async (_fields: any) => {
    setLoginStatus(true);
    const postData: mailLoginPost = {
      email: smsMail?.userMail,
      emailToken: _fields.mailToken,
    };
    try {
      await onCreateAsync(postData).then((result) => {
        if (result.token) {
          message.success("Giriş Başarılı！");
          localStorage.setItem("token", result.token!);
          localStorage.setItem("userId", result.userId!.toString());
          localStorage.setItem(
            "perms",
            jwt.sign(result.operationClaims!, "codeandmore-secret-01")
          );

          setTimeout(() => {
            console.log("1sn");
            onSetSmsMail(null);
            refresh().then(() => {
              console.log("refresh method çalıştı");
              replaceGoto();
            });
          }, 100);
          return;
        }
      });
    } catch (error) {
      message.error("Mail Onay Kodu Yanlış/Geçersiz!");
    } finally {
      setLoginStatus(false);
    }
  };

  const handleResendToken = async () => {
    setResendStatus(true);
    if (smsMail) {
      try {
        await getOne(smsMail?.userMail).then((result) => {
          message.info(result);
          console.log(result);
        });
      } catch (error) {
        message.info("Hata Meydana Geldi!");
      } finally {
        setResendStatus(false);
      }
    }
  };

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
          <span className={styles.title}>MAIL DOĞRULAMA</span>
          <div>
            <span className={styles.desc}>
              {mailWithStars} 'a gelen doğrulama kodunu giriniz.
            </span>
          </div>
        </div>

        <div className={styles.main}>
          <LoginFrom onSubmit={handleSubmit}>
            <Password
              name="mailToken"
              placeholder="Mailinize Gelen Onay Kodunu Giriniz!"
              defaultValue=""
              type="text"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            />

            <Submit loading={loginStatus}>Giriş Yap</Submit>
            <Submit
              htmlType="button"
              loading={resendStatus}
              onClick={handleResendToken}
            >
              Kodu Tekrar Gönder
            </Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SmsLogin;
