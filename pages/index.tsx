import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "../src/components/Layout";
import Home from "../src/components/Home";
import prisma from "../src/lib/prisma";
import { useSetRecoilState } from "recoil";
import userState from "../src/context/user";
import feedState, { IDateSummary, IPost } from "src/context/feed";
import { User } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
  });

  const postList = await prisma.post.findMany();
  const dateSummaryList = await prisma.dateSummary.findMany();

  return {
    props: {
      feed: {
        postList: postList.map((p) => ({
          ...p,
          createdAt: p.createdAt.toString(),
          updatedAt: p.updatedAt.toString(),
        })),
        dateSummaryList: dateSummaryList.map((d) => ({
          ...d,
          createdAt: d.createdAt.toString(),
          updatedAt: d.updatedAt.toString(),
        })),
      },
      user,
    },
  };
};

export interface IHomePageProps {
  user: User;
  feed: {
    postList: IPost[];
    dateSummaryList: IDateSummary[];
  };
}

const HomePage: React.FC<IHomePageProps> = ({ user, feed }) => {
  const setFeedState = useSetRecoilState(feedState);
  const setUserState = useSetRecoilState(userState);

  useEffect(() => {
    setFeedState(feed);
    setUserState(user);
  }, [user]);

  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default HomePage;
