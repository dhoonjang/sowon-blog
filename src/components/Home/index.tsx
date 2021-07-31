import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authState from "src/context/auth";
import feedState, { postSelector } from "src/context/feed";
import Editor, { IEditor } from "../Editor";
import PostComponent from "../PostComponent";

const Home: React.FC = () => {
  const isLogin = useRecoilValue(authState);

  const posts = useRecoilValue(postSelector);
  const setFeedState = useSetRecoilState(feedState);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<IEditor>(null);

  const submitPost = useCallback(async () => {
    if (!titleRef.current || !contentRef.current) return;

    const post = await axios.post("/api/post", {
      title: titleRef.current.value,
      content: contentRef.current.value,
    });

    if (post.status === 200) {
      setFeedState((f) => {
        const postList = [...f.postList, post.data];
        return {
          ...f,
          postList,
        };
      });

      titleRef.current.value = "";
      contentRef.current.setValue("");
    }
  }, []);

  return (
    <div className="Home">
      {isLogin && (
        <div className="editor-area">
          제목: <input ref={titleRef} />
          <button onClick={submitPost}>글 올리기</button>
          <Editor className="editor" ref={contentRef} />
        </div>
      )}
      <main>
        {posts.map((post) => (
          <PostComponent post={post} key={post.id} />
        ))}
      </main>
    </div>
  );
};

export default Home;
