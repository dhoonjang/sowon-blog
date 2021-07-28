import { useRecoilValue } from "recoil";
import authState from "src/context/auth";
import Post, { PostProps } from "../Post";

export interface IHomeProps {
  feed: PostProps[];
}

const Home: React.FC<IHomeProps> = ({ feed }) => {
  const isLogin = useRecoilValue(authState);

  return (
    <div className="Home">
      <main>
        {feed.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
