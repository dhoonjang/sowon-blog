import React from "react";
import { GetServerSideProps } from "next";
import Layout from "src/components/Layout";
import prisma from "src/lib/prisma";
import cn from "classnames";
import { IPost } from "src/context/feed";
import { useRecoilValue } from "recoil";
import authState from "src/context/auth";
import { useEffect } from "react";
import Router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });
  return {
    props: {
      ...post,
      createdAt: post.createdAt.toString(),
      updatedAt: post.createdAt.toString(),
    },
  };
};

const PostPage: React.FC<IPost> = ({ title, published, content }) => {
  const isLogin = useRecoilValue(authState);

  useEffect(() => {
    if (!isLogin && !published) {
      Router.push("/");
    }
  }, []);

  return (
    <Layout>
      <div className={cn("PostPage", { published })}>
        <h2>{title}</h2>
        <div
          className="ql-editor content-inner"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </Layout>
  );
};

export default PostPage;
