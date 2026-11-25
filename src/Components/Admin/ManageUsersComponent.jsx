import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUsers, suspendUser, unsuspendUser } from '../../Redux/Actions/usersActions';
import { messageFor } from '../../Utils/errorMessages';

const statusOf = (user) => {
  if (user.isActive) return 'Attivo';
  return user.deactivationReason === 'Admin' ? 'Sospeso' : 'Disattivato dal cliente';
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('it-IT') : '');

const ManageUsersComponent = () => {
  const currentEmail = useSelector((state) => state.auth.user?.email);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(null);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    try {
      setUsers(await fetchUsers());
    } catch (error) {
      toast.error(messageFor(error, 'Impossibile caricare gli utenti.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeSuspend = () => {
    setSuspending(null);
    setNote('');
  };

  const confirmSuspend = async () => {
    try {
      await suspendUser(suspending.id, note.trim());
      toast.success(`Account di ${suspending.email} sospeso.`);
      closeSuspend();
      await load();
    } catch (error) {
      toast.error(messageFor(error, 'Sospensione non riuscita.'));
    }
  };

  const revoke = async (user) => {
    try {
      await unsuspendUser(user.id);
      toast.success(`Sospensione di ${user.email} revocata.`);
      await load();
    } catch (error) {
      toast.error(messageFor(error, 'Revoca della sospensione non riuscita.'));
    }
  };

  // Il BE rifiuta azioni su un Admin e su se stessi: non le offriamo.
  const canAct = (user) => user.role !== 'Admin' && user.email !== currentEmail;

  return (
    <Container className='mt-4 pb-5'>
      <h2 className='mb-4'>Gestione Utenti</h2>

      {loading ? (
        <div className='d-flex justify-content-center'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <Table striped bordered hover responsive size='sm'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Ruolo</th>
              <th>Stato</th>
              <th>Nota</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>
                  {statusOf(user)}
                  {user.deactivatedAt && <small className='d-block text-muted'>dal {formatDate(user.deactivatedAt)}</small>}
                </td>
                <td>{user.deactivationNote}</td>
                <td>
                  {canAct(user) &&
                    (user.deactivationReason === 'Admin' ? (
                      <Button size='sm' variant='outline-primary' onClick={() => revoke(user)}>
                        Revoca sospensione
                      </Button>
                    ) : (
                      <Button size='sm' variant='outline-danger' onClick={() => setSuspending(user)}>
                        Sospendi
                      </Button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={suspending !== null} onHide={closeSuspend}>
        <Modal.Header closeButton>
          <Modal.Title>Sospendi {suspending?.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>L&apos;utente non potrà più accedere finché la sospensione non viene revocata.</p>
          <Form.Group controlId='suspendNote'>
            <Form.Label>Nota per lo staff (obbligatoria, non visibile al cliente)</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeSuspend}>
            Annulla
          </Button>
          <Button variant='danger' disabled={note.trim() === ''} onClick={confirmSuspend}>
            Conferma sospensione
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsersComponent;
