import moment from "moment";
import { useRouter } from "next/router";
import Diary from "src/components/Diary";
import Layout from "src/components/Layout";

const DiaryPage: React.FC = () => {
  const { query } = useRouter();

  return (
    <Layout>
      <Diary selectMoment={moment(query.id)} />
    </Layout>
  );
};

export default DiaryPage;
