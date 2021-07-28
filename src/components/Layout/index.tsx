import React, { useRef } from "react";
import { useRecoilValue } from "recoil";
import userState from "src/context/user";
import Link from "next/link";
import authState from "src/context/auth";
import axios from "axios";

export interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const isLogin = useRecoilValue(authState);

  const { bgImageUrl, name } = useRecoilValue(userState);

  const backRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file);
    });

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total),
        );
      },
    };

    const response = await axios.post(
      `/api/upload/${event.target.name}`,
      formData,
      config,
    );

    console.log("response", response.data);
  };

  console.log(bgImageUrl);

  return (
    <div className="Layout">
      <img src={bgImageUrl} alt="" className="bg-img" />
      <input
        type="file"
        name="backgroundImg"
        ref={backRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={onChange}
      />
      <input
        type="file"
        name="profileImg"
        ref={profileRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={onChange}
      />
      <div className="window">
        <div className="side-bar">
          <div className="name">{name}</div>
          {isLogin && (
            <>
              <button onClick={() => backRef.current.click()}>
                배경 이미지 선택
              </button>
              <button onClick={() => profileRef.current.click()}>
                프로필 이미지 선택
              </button>
            </>
          )}
          {isLogin ? (
            <div className="auth-area">로그인!</div>
          ) : (
            <Link href="/login">
              <div className="auth-area">로그인?</div>
            </Link>
          )}
        </div>
        <div className="content">{children}</div>
        <div className="nav"></div>
      </div>
    </div>
  );
};

export default Layout;
