import { useQuery } from '@apollo/client';
import { ClientRow } from './ClientRow';
import { GET_CLIENTS } from '../queries/clientQueries';
import Spinner from './spinner';

export default function Clients() {
    const { loading, error, data } = useQuery(GET_CLIENTS);

    if (loading) return <Spinner />;
    if (error) return <p>something went wrong  </p>;

    return <>
        {!loading && !error && data && (
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.clients.map(client => (
                        <ClientRow key={client.id} client={client} />
                    ))}
                </tbody>
            </table>
        )}
    </>
}
