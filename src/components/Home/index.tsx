import Post, { PostProps } from "../Post";

export interface IHomeProps {
  feed: PostProps[];
}

const Home: React.FC<IHomeProps> = ({ feed }) => {
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
