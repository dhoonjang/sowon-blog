import React from "react";
import Router from "next/router";
import { IPost, postSelector } from "src/context/feed";
import moment from "moment";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authState from "src/context/auth";
import { useCallback } from "react";
import axios from "axios";
import produce from "immer";

const PostComponent: React.FC<{ post: IPost }> = ({ post }) => {
  const isLogin = useRecoilValue(authState);
  const setPosts = useSetRecoilState(postSelector);

  const updateFunc = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const dp = await axios.patch("/api/post", {
      id: post.id,
      published: !post.published,
    });
    setPosts((posts) => {
      return produce(posts, (draft) => {
        const index = draft.findIndex((f) => f.id === dp.data.id);
        draft.splice(index, 1, dp.data);
      });
    });
  }, []);

  const deleteFunc = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const dp = await axios.delete("/api/post", { params: { id: post.id } });
    setPosts((posts) => {
      return produce(posts, (draft) => {
        const index = draft.findIndex((f) => f.id === dp.data.id);
        draft.splice(index, 1);
      });
    });
  }, []);

  return (
    <div
      className="PostComponent"
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
    >
      <div className="title-area">
        <div className="left">
          <h3 className="title">{post.title}</h3>
          <div className="date">
            {moment(post.createdAt).format("YYYY년 M월 D일 HH:mm")}
          </div>
        </div>
        {isLogin && (
          <div className="right">
            <button onClick={updateFunc}>
              {post.published ? "비공개" : "공개"}
            </button>
            <button onClick={deleteFunc}>삭제</button>
          </div>
        )}
      </div>
      <div
        className="ql-editor content-inner"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostComponent;
