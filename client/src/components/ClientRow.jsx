import { FaTrash } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT } from '../Mutation/clientMutation';
import { GET_CLIENTS } from '../queries/clientQueries';

export function ClientRow({ client }) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.id },
        // refetchQueries: [{ query: GET_CLIENTS }]
        update(cache, { data: { deleteClient } }) {
            const { clients } = cache.readQuery({ query: GET_CLIENTS });
            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: clients.filter(c => c.id !== deleteClient.id) },
            });
        },

    });
    return (
        <tr>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={deleteClient}>Delete <FaTrash /></button>
            </td>
        </tr>
    );
}
