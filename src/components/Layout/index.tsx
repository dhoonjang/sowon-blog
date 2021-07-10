import React from "react";
import { useRecoilValue } from "recoil";
import userState from "../../context/user";

export interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { bgImageUrl } = useRecoilValue(userState);
  return (
    <div className="Layout">
      <img src={bgImageUrl} alt="" className="bg-img" />
      <div className="window">
        <div className="side-bar"></div>
        <div className="content">{children}</div>
        <div className="nav"></div>
      </div>
    </div>
  );
};

export default Layout;
