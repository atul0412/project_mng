import Clients from '../components/client';
import Projects from '../components/project';

export default function Home() {
  return (
    <>
      <div className='d-flex gap-3 mb-4'>
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
}