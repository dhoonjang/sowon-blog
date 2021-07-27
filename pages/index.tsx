import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "../src/components/Layout";
import Home from "../src/components/Home";
import prisma from "../src/lib/prisma";
import { IHomeProps } from "../src/components/Home";
import { useSetRecoilState } from "recoil";
import userState, { IUserState } from "../src/context/user";

export const getStaticProps: GetStaticProps = async () => {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
  });
  const feed = await prisma.post.findMany({
    where: { published: true },
  });
  return { props: { feed, user } };
};

export interface IHomePageProps extends IHomeProps {
  user: IUserState;
}

const HomePage: React.FC<IHomePageProps> = ({ user, ...props }) => {
  const setUserState = useSetRecoilState(userState);

  useEffect(() => {
    setUserState(({ isLogin }) => ({ isLogin, ...user }));
  }, [user]);

  return (
    <Layout>
      <Home {...props} />
    </Layout>
  );
};

export default HomePage;
