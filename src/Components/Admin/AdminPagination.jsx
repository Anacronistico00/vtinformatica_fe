import { Pagination } from 'react-bootstrap';

/** Paginazione di una lista paginata dal server (totale da X-Total-Count). Nascosta se c'è una sola pagina. */
const AdminPagination = ({ page, pageSize, total, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className='d-flex flex-column align-items-center gap-2 my-3'>
      <span>
        Pagina {page} di {totalPages}
      </span>
      <Pagination className='mb-0'>
        <Pagination.Prev disabled={page === 1} onClick={() => onChange(page - 1)} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <Pagination.Item key={number} active={number === page} onClick={() => onChange(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={page === totalPages} onClick={() => onChange(page + 1)} />
      </Pagination>
    </div>
  );
};

export default AdminPagination;
