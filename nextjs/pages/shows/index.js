import Layout from '../../components/MyLayout';
import axios from 'axios';
import Link from 'next/link';
export default function shows({data}) {
  return (
    <Layout>
      <h1>Shows (getStaticProps)</h1>
      <ul>
        {data.map((show) => (
          <li key={show.id}>
            <Link href={`/shows/${show.id}`}>{show.name}</Link>
          </li>
        ))}
      </ul>
      <h1>Shows (getServerSideProps)</h1>
      <ul>
        {data.map((show) => (
          <li key={show.id}>
            <Link href={`/show/${show.id}`}>{show.name}</Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          list-style-type: none;
        }
      `}</style>
    </Layout>
  );
}

async function getShowData() {
  const {data} = await axios.get('http://api.tvmaze.com/shows');
  return data;
}
export async function getStaticProps() {
  const data = await getShowData();
  return {
    props: {data},
    revalidate: 86400
  };
}
