import { redirect } from 'next/navigation';
const Home = async () => {
  redirect('/signin')
}

export default Home;
export const runtime = "edge";