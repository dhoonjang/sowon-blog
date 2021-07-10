import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "../src/components/Home/style.scss";
import "../src/components/Layout/style.scss";
import "./reset.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App;
