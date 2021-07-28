import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import authState from "src/context/auth";
import Editor, { IEditor } from "../Editor";
import Post, { PostProps } from "../Post";

export interface IHomeProps {
  feed: PostProps[];
}

const Home: React.FC<IHomeProps> = ({ feed }) => {
  const isLogin = useRecoilValue(authState);
  const [value, setValue] = useState<string>("");
  const ref = useRef<IEditor>(null);

  return (
    <div className="Home">
      <main>
        {feed.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
      <Editor ref={ref} value={value} onChange={setValue} />
    </div>
  );
};

export default Home;
