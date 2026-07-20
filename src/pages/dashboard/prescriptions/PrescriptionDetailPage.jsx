import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Pencil, Trash2, CheckCircle2, Pill } from 'lucide-react';
import { Button, Card, ConfirmDialog, EmptyState, Modal, StatusBadge } from '../../../components/ui';
import { usePrescriptions, usePatients, useDoctors } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { formatDate } from '../../../utils/helpers';
import PrescriptionForm from './PrescriptionForm';
import './PrescriptionDetailPage.css';

const PrescriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prescriptions = usePrescriptions();
  const { list: listPatients } = usePatients();
  const { list: listDoctors } = useDoctors();
  const toast = useToast();

  const prescription = prescriptions.find(id);
  const patient = prescription ? listPatients().find((p) => p.id === prescription.patientId) : null;
  const doctor = prescription ? listDoctors().find((d) => d.id === prescription.doctorId) : null;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!prescription) {
    return (
      <EmptyState
        icon={Pill}
        title="Prescription not found"
        description={`No prescription with ID ${id}.`}
        action={
          <Link to="/dashboard/prescriptions">
            <Button variant="primary" leftIcon={ArrowLeft}>
              Back to prescriptions
            </Button>
          </Link>
        }
      />
    );
  }

  const handleSave = async (values) => {
    await prescriptions.update(prescription.id, values);
    toast.success('Prescription updated', `${prescription.id} saved.`);
    setEditOpen(false);
  };

  const handleDelete = async () => {
    await prescriptions.remove(prescription.id);
    toast.success('Prescription removed', `${prescription.id} was deleted.`);
    navigate('/dashboard/prescriptions', { replace: true });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="rx-detail-page">
      <Link to="/dashboard/prescriptions" className="rx-detail-page__back">
        <ArrowLeft size={16} aria-hidden="true" /> All prescriptions
      </Link>

      <header className="rx-detail-page__header">
        <div>
          <span className="rx-detail-page__eyebrow">Prescription</span>
          <h1>{prescription.id}</h1>
          <p>
            Issued to <strong>{patient?.name || 'Unknown patient'}</strong> on{' '}
            {formatDate(prescription.date)}.
          </p>
        </div>
        <div className="rx-detail-page__actions">
          <Button variant="outline" leftIcon={Printer} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="ghost" leftIcon={Pencil} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" leftIcon={Trash2} onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </header>

      <Card padding={false} className="rx-detail-page__card">
        <div className="rx-detail-page__card-header">
          <div>
            <p className="rx-detail-page__brand">Subhan Care Hospital</p>
            <p className="rx-detail-page__address">
              Block 5, Hospital Avenue, Lahore · +92 300 000 0000
            </p>
          </div>
          <div className="rx-detail-page__meta">
            <p>
              Prescription <strong>{prescription.id}</strong>
            </p>
            <p>Date {formatDate(prescription.date)}</p>
            <StatusBadge tone={prescription.status}>{prescription.status}</StatusBadge>
          </div>
        </div>

        <div className="rx-detail-page__parties">
          <div>
            <p className="rx-detail-page__parties-label">Patient</p>
            {patient ? (
              <p>
                <strong>{patient.name}</strong> ({patient.id})
                <br />
                {patient.phone}
              </p>
            ) : (
              <p>Patient not found.</p>
            )}
          </div>
          <div>
            <p className="rx-detail-page__parties-label">Doctor</p>
            {doctor ? (
              <p>
                <strong>{doctor.name}</strong>
                <br />
                {doctor.specialization}
              </p>
            ) : (
              <p>Doctor not found.</p>
            )}
          </div>
        </div>

        <div className="rx-detail-page__section">
          <p className="rx-detail-page__section-label">Diagnosis</p>
          <p className="rx-detail-page__diagnosis">{prescription.diagnosis}</p>
        </div>

        <div className="rx-detail-page__itemsWrap">
          <p className="rx-detail-page__section-label">Medicines</p>
          <table className="rx-detail-page__items">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((med, index) => (
                <tr key={index}>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.dosage}</td>
                  <td>{med.frequency}</td>
                  <td>{med.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {prescription.notes && (
          <div className="rx-detail-page__section">
            <p className="rx-detail-page__section-label">Notes</p>
            <p>{prescription.notes}</p>
          </div>
        )}

        <footer className="rx-detail-page__footer">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>
            This prescription was issued electronically via Subhan Care HMS. For questions,
            contact the issuing doctor's office.
          </span>
        </footer>
      </Card>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit prescription"
        subtitle={`Update ${prescription.id}.`}
        size="lg"
      >
        <PrescriptionForm
          initialValues={prescription}
          patients={listPatients()}
          doctors={listDoctors()}
          onSubmit={handleSave}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete prescription?"
        confirmLabel="Delete prescription"
        body={
          <>
            You&apos;re about to permanently remove prescription{' '}
            <strong>{prescription.id}</strong>. This action cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default PrescriptionDetailPage;
