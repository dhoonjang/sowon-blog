import { useRecoilValue } from "recoil";
import userState from "../../context/user";
import Post, { PostProps } from "../Post";

export interface IHomeProps {
  feed: PostProps[];
}

const Home: React.FC<IHomeProps> = ({ feed }) => {
  const { isLogin } = useRecoilValue(userState);
  console.log(isLogin);
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
