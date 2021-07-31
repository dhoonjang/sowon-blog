import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userState from "src/context/user";
import authState from "src/context/auth";
import axios from "axios";
import { fileRequestConfig } from "src/lib/axios";
import LoginPopUp from "./LoginPopUp";
import cn from "classnames";
import Router, { useRouter } from "next/router";

export interface ILayoutProps {}

const imageInputProps = {
  type: "file",
  style: { display: "none" },
  accept: "image/*",
};

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const [isLogin, setAuthState] = useRecoilState(authState);
  const { pathname } = useRouter();

  const [{ bgImageUrl, profileImageUrl, name }, setUserState] =
    useRecoilState(userState);

  const [loginPop, setLoginPop] = useState<boolean>(false);

  const backRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const targetName = event.target.name;
    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(targetName, file);
    });

    const config = {
      ...fileRequestConfig,
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };

    const response = await axios.post(
      `/api/upload/${targetName}`,
      formData,
      config
    );

    setUserState((state) => ({
      ...state,
      bgImageUrl:
        targetName === "backgroundImg" ? response.data.path : state.bgImageUrl,
      profileImageUrl:
        targetName === "profileImg"
          ? response.data.path
          : state.profileImageUrl,
    }));
  };

  return (
    <div className="Layout">
      <img src={bgImageUrl} alt="" className="bg-img" />
      <input
        name="backgroundImg"
        ref={backRef}
        onChange={onChange}
        {...imageInputProps}
      />
      <input
        name="profileImg"
        ref={profileRef}
        onChange={onChange}
        {...imageInputProps}
      />
      <div className="window">
        <div className="side-bar">
          {profileImageUrl && (
            <img src={profileImageUrl} alt="" className="profile-img" />
          )}
          <div className="name">{name}</div>
          {isLogin && (
            <>
              <button onClick={() => backRef.current.click()}>
                배경 이미지 선택
              </button>
              <button
                onClick={async () => {
                  const res = await axios.delete("/api/upload/backgroundImg");
                  if (res.status === 202) {
                    setUserState((state) => ({
                      ...state,
                      bgImageUrl: null,
                    }));
                  }
                }}
              >
                배경 이미지 삭제
              </button>
              <button onClick={() => profileRef.current.click()}>
                프로필 이미지 선택
              </button>
              <button
                onClick={async () => {
                  const res = await axios.delete("/api/upload/profileImg");
                  if (res.status === 202) {
                    setUserState((state) => ({
                      ...state,
                      profileImageUrl: null,
                    }));
                  }
                }}
              >
                프로필 이미지 삭제
              </button>
            </>
          )}
          {isLogin ? (
            <button className="auth-area" onClick={() => setAuthState(false)}>
              로그아웃
            </button>
          ) : (
            <button
              className="auth-area"
              onClick={() => setLoginPop(!loginPop)}
            >
              {name} 님이신가요?
            </button>
          )}
          {loginPop && <LoginPopUp closeFunc={() => setLoginPop(false)} />}
        </div>
        <div className="content">{children}</div>
        <div className="nav">
          <div
            className={cn("nav-btn", { current: pathname === "/" })}
            onClick={() => Router.push("/")}
          >
            홈
          </div>
          <div
            className={cn("nav-btn", { current: pathname === "/diary" })}
            onClick={() => Router.push("/diary")}
          >
            다이어리
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
