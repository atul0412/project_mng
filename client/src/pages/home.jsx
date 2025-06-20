import Clients from '../components/client';
import Projects from '../components/project';
import AddClientModal from '../components/addClientModel';
import AddProjectModal from '../components/addProject';

export default function Home() {
  return (
    <>
      <div className='d-flex gap-3 mb-4'>
        <AddClientModal />
        <AddProjectModal />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
}