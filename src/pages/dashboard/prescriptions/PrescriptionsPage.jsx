import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Pill,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Pagination,
  SearchInput,
  Select,
  StatusBadge,
} from '../../../components/ui';
import { usePrescriptions, usePatients, useDoctors } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { formatDate } from '../../../utils/helpers';
import PrescriptionForm from './PrescriptionForm';
import './PrescriptionsPage.css';

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const prescriptions = usePrescriptions();
  const { list: listPatients } = usePatients();
  const { list: listDoctors } = useDoctors();
  const toast = useToast();

  const patients = listPatients();
  const doctors = listDoctors();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [editing, setEditing] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const patientName = (id) => patients.find((p) => p.id === id)?.name || 'Unknown patient';
  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Unknown doctor';

  const stats = useMemo(() => {
    const list = prescriptions.list();
    const active = list.filter((rx) => rx.status === 'active').length;
    const completed = list.filter((rx) => rx.status === 'completed').length;
    const thisMonth = list.filter((rx) => {
      const created = new Date(rx.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
    return { total: list.length, active, completed, thisMonth };
  }, [prescriptions]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return prescriptions.list().filter((rx) => {
      if (term) {
        const haystack = `${rx.id} ${patientName(rx.patientId)} ${doctorName(rx.doctorId)} ${rx.diagnosis}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (filters.status !== 'all' && rx.status !== filters.status) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptions, searchTerm, filters, patients, doctors]);

  const sorted = useMemo(
    () => filtered.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    [filtered],
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleCreate = async (values) => {
    const created = await prescriptions.create(values);
    toast.success('Prescription created', `${created.id} added for ${patientName(created.patientId)}.`);
    setCreateOpen(false);
  };

  const handleEdit = async (values) => {
    const updated = await prescriptions.update(editing.id, values);
    toast.success('Prescription updated', `${updated.id} has been saved.`);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await prescriptions.remove(deleting.id);
    toast.success('Prescription removed', `${deleting.id} was deleted.`);
    setDeleting(null);
  };

  return (
    <div className="prescriptions-page">
      <header className="prescriptions-page__header">
        <div>
          <span className="prescriptions-page__eyebrow">Prescription Management</span>
          <h1>Prescriptions</h1>
          <p>
            Create, review, and manage patient prescriptions across every doctor at Subhan
            Care.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={Plus}
          onClick={() => {
            setEditing(null);
            setCreateOpen(true);
          }}
        >
          New Prescription
        </Button>
      </header>

      <section className="prescriptions-page__stats">
        <div className="prescriptions-page__stat">
          <FileText size={18} aria-hidden="true" />
          <div>
            <p className="prescriptions-page__stat-label">Total prescriptions</p>
            <p className="prescriptions-page__stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="prescriptions-page__stat">
          <Clock size={18} aria-hidden="true" />
          <div>
            <p className="prescriptions-page__stat-label">Active</p>
            <p className="prescriptions-page__stat-value">{stats.active}</p>
          </div>
        </div>
        <div className="prescriptions-page__stat">
          <CheckCircle2 size={18} aria-hidden="true" />
          <div>
            <p className="prescriptions-page__stat-label">Completed</p>
            <p className="prescriptions-page__stat-value">{stats.completed}</p>
          </div>
        </div>
        <div className="prescriptions-page__stat">
          <Pill size={18} aria-hidden="true" />
          <div>
            <p className="prescriptions-page__stat-label">Issued this month</p>
            <p className="prescriptions-page__stat-value">{stats.thisMonth}</p>
          </div>
        </div>
      </section>

      <Card padding={false}>
        <div className="prescriptions-page__toolbar">
          <SearchInput
            value={searchTerm}
            placeholder="Search by ID, patient, doctor, or diagnosis…"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            name="status"
            value={filters.status}
            options={STATUS_FILTERS}
            onChange={(event) => {
              setFilters({ status: event.target.value });
              setCurrentPage(1);
            }}
            placeholder="Status"
          />
        </div>

        <div className="prescriptions-page__tableWrap">
          <table className="prescriptions-page__table">
            <thead>
              <tr>
                <th>Prescription</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Medicines</th>
                <th>Status</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {pageItems.map((rx) => (
                <tr key={rx.id}>
                  <td>
                    <Link to={`/dashboard/prescriptions/${rx.id}`} className="prescriptions-page__rx-id">
                      <span className="prescriptions-page__pill">{rx.id}</span>
                    </Link>
                    <div className="prescriptions-page__diagnosis">{rx.diagnosis}</div>
                  </td>
                  <td>{patientName(rx.patientId)}</td>
                  <td>{doctorName(rx.doctorId)}</td>
                  <td>{formatDate(rx.date)}</td>
                  <td>{rx.medicines.length}</td>
                  <td>
                    <StatusBadge tone={rx.status}>{rx.status}</StatusBadge>
                  </td>
                  <td>
                    <div className="prescriptions-page__row-actions">
                      <button
                        type="button"
                        className="prescriptions-page__icon-btn"
                        onClick={() => navigate(`/dashboard/prescriptions/${rx.id}`)}
                        title="View prescription"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="prescriptions-page__icon-btn"
                        onClick={() => {
                          setEditing(rx);
                          setCreateOpen(false);
                        }}
                        title="Edit prescription"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="prescriptions-page__icon-btn prescriptions-page__icon-btn--danger"
                        onClick={() => setDeleting(rx)}
                        title="Delete prescription"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageItems.length === 0 && (
            <EmptyState
              icon={Pill}
              title="No prescriptions found"
              description="Try clearing filters or create a new prescription."
              action={
                <Button
                  variant="primary"
                  leftIcon={Plus}
                  onClick={() => {
                    setEditing(null);
                    setCreateOpen(true);
                  }}
                >
                  New Prescription
                </Button>
              }
            />
          )}
        </div>

        {sorted.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </Card>

      <Modal
        isOpen={createOpen || Boolean(editing)}
        onClose={() => {
          setCreateOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit prescription' : 'New prescription'}
        subtitle={editing ? `Update ${editing.id}.` : 'Create a prescription for a patient visit.'}
        size="lg"
      >
        <PrescriptionForm
          initialValues={editing}
          patients={patients}
          doctors={doctors}
          onSubmit={editing ? handleEdit : handleCreate}
          onCancel={() => {
            setCreateOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete prescription?"
        confirmLabel="Delete prescription"
        body={
          <>
            You&apos;re about to permanently remove <strong>{deleting?.id}</strong> for{' '}
            <strong>{deleting ? patientName(deleting.patientId) : ''}</strong>. This action
            cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default PrescriptionsPage;
