import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "react-quill/dist/quill.snow.css";
import "src/components/Home/style.scss";
import "src/components/Diary/style.scss";
import "src/components/Layout/style.scss";
import "./p/style.scss";
import "./reset.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App;
