import { Link, useParams } from 'react-router-dom';
import Spinner from '../components/spinner.jsx';
import ClientInfo from '../components/clientInfo.jsx';
import DeleteProjectButton from '../components/deleteProjectBtn.jsx';
import EditProjectForm from '../components/UpdateProjectForm.jsx';
import { useQuery } from '@apollo/client';
import { GET_PROJECT } from '../queries/projectQueries.js';

export default function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, { variables: { id } });

  if (loading) return <Spinner />;
  if (error) return <p>Something Went Wrong</p>;
  if (!data || !data.project) return <p>Project not found</p>;



  return (
    <div className='mx-auto w-75 card p-5'>
      <Link to='/' className='btn btn-light btn-sm w-25 d-inline ms-auto'>
        Back
      </Link>

      <h1>{data.project.name}</h1>
      <p>{data.project.description}</p>

      <ClientInfo client={data.project.client} />

      <EditProjectForm project={data.project} />

      <DeleteProjectButton projectId={data.project.id} />
    </div>
  );
}
