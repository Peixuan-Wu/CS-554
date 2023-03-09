import Layout from '../../../components/MyLayout';
import axios from 'axios';
import Image from 'next/image';
export default function show({data}) {
  return (
    <Layout>
      <div>
        <h1>{data.name} </h1>
        <p>
          {data.summary
            ? data.summary.replace(/(<([^>]+)>)/gi, '')
            : 'No Summary'}
        </p>
        <Image
          src={
            data.image
              ? data.image.medium
              : 'https://patrickhill.nyc/images/me.jpg'
          }
          height={294}
          width={209}
        />
      </div>

      <style jsx>{`
        p::first-letter {
          font-size: 200%;
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // console.log(context);
  const {id} = context.query;
  console.log(id);

  const {data} = await axios.get('http://api.tvmaze.com/shows/' + id);
  console.log(`Fetched a show (getServerSideProps): ${data.name}`);
  return {
    props: {data},
  };
}
