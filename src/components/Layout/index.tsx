import React from "react";
import { useRecoilValue } from "recoil";
import userState from "../../context/user";
import Link from "next/link";

export interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { bgImageUrl, isLogin, name } = useRecoilValue(userState);

  return (
    <div className="Layout">
      <img src={bgImageUrl} alt="" className="bg-img" />
      <div className="window">
        <div className="side-bar">
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
