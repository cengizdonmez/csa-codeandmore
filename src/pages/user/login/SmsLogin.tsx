import smsMailLogin from "@/hoxmodels/smsMailLogin";
import React, { useEffect, useState } from "react";
import { history, useModel } from "umi";
import { Link } from "umi";
import Footer from "@/components/Footer";
import LoginFrom from "./components/Login";
import styles from "./style.less";
import { useCreate } from "@/pages/CategoryPages/services";
import { message } from "antd";
import jwt from "jsonwebtoken";
import { getPageQuery } from "@/utils/utils";
import { smsVerifyResendRequest, smsVerifyResendResponse } from "./login";
import CountUp, { useCountUp } from "react-countup";

const { Password, Submit } = LoginFrom;

type SmsLoginPost = {
  smsToken: string;
  phonenumber: string | undefined;
};

const stringtoStar = (data: string) => {
  return data.replace(
    data.substr(5, data.length - 10),
    data.substr(3, data.length - 10).replace(/./g, "*")
  );
};
const SmsLogin = () => {
  const [resendStatus, setResendStatus] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [phoneWithStars, setPhoneWithStars] = useState<string | null>(null);
  const [onCreateAsync, response, status] = useCreate<
    SmsLoginPost,
    API.LoginStateType
  >("/Auth/SmsVerify");
  const [ResendSms, ResendSmsResponse, resendSmsStatus] = useCreate<
    smsVerifyResendRequest,
    smsVerifyResendResponse
  >("/Auth/ResendSms");
  const { smsMail, onSetSmsMail } = smsMailLogin();
  const { refresh } = useModel("@@initialState");
    const [disabledResendCodeButton, setDisabledResendCodeButton] = useState(false);

  const {
    start: verifyCounterStart,
    reset: verifyCounterReset,
  } = useCountUp({
    ref: "counter",
    start: 120,
    end: 0,
    duration: 120,
    useEasing: false,
    suffix: " saniye içinde giriş sayfasına yönlendirileceksiniz!",
    onEnd: () => {
      history.push("/login")
    }
  });
  const {
    start: resendCounterButtonStart,
  } = useCountUp({
    ref: "disabledButtonCounter",
    start: 15,
    end: 0,
    duration: 15,
    useEasing: false,
    onEnd: () => {
      setDisabledResendCodeButton(false);
    }
  });

  const replaceGoto = () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!smsMail?.smsCheck) {
      return history.push("/user/login");
    } else {
      setPhoneWithStars(stringtoStar(smsMail.userPhone));
    }
  }, []);

  const handleSubmit = async (_fields: any) => {
    setLoginStatus(true);
    const postData: SmsLoginPost = {
      phonenumber: smsMail?.userPhone,
      smsToken: _fields.smsToken,
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
          onSetSmsMail(null);
          replaceGoto();

          setTimeout(() => {
            refresh();
          }, 0);
          //   setTimeout(() => {
          //     onSetSmsMail(null);
          //     //refresh();
          //   }, 100);
          //   setTimeout(() => {
          //     replaceGoto();
          //   }, 1000);
          //   return;
        }
      });
    } catch (error) {
      message.error("Sms Onay Kodu Yanlış/Geçersiz!");
    } finally {
      setLoginStatus(false);
    }
  };

  const handleResendToken = async () => {
    setResendStatus(true);
    if (smsMail) {
      try {
        await ResendSms({ phoneNumber: smsMail?.userPhone }).then(
          (result: smsVerifyResendResponse) => {
            if (result.success) {
              message.info(result.message);
            } else {
              message.warning(result.message);
            }
          }
        );
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
          <span className={styles.title}>SMS DOĞRULAMA</span>
          <div>
            <span>
              {phoneWithStars} numaranıza gelen doğrulama kodunu giriniz.
            </span>
          </div>
          <div id="counter"/>

        </div>

        <div className={styles.main}>
          <LoginFrom onSubmit={handleSubmit}>
            <Password
              name="smsToken"
              placeholder="Telefonunuza Gelen Sms Kodunu Giriniz!"
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
              disabled={disabledResendCodeButton}
              onClick={() => {
                handleResendToken();
                verifyCounterReset();
                verifyCounterStart();
                resendCounterButtonStart();
                setDisabledResendCodeButton(true);
              }}
            >
              <div style={{ display: "none" }} id="disabledButtonCounter"/>
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
