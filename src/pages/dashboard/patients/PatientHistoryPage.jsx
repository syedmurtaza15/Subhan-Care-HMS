import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Pill, Activity, Plus } from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  StatusBadge,
} from '../../../components/ui';
import {
  usePatients,
  useAppointments,
  useInvoices,
} from '../../../context/DataContext';
import { formatDate, formatTime } from '../../../utils/helpers';
import './PatientHistoryPage.css';

const HISTORY_TABS = [
  { id: 'visits', label: 'Visits', icon: FileText },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'labs', label: 'Lab results', icon: Activity },
];

const PatientHistoryPage = () => {
  const { id } = useParams();
  const patients = usePatients();
  const { list: listAppointments } = useAppointments();
  const { list: listInvoices } = useInvoices();
  const patient = patients.find(id);
  const [tab, setTab] = useState('visits');

  const visits = useMemo(
    () =>
      listAppointments()
        .filter((a) => a.patientId === id && a.status !== 'cancelled')
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [listAppointments, id],
  );

  const invoices = useMemo(
    () => listInvoices().filter((i) => i.patientId === id),
    [listInvoices, id],
  );

  if (!patient) {
    return (
      <EmptyState
        icon={FileText}
        title="Patient not found"
        description="Open the directory and pick a patient to view their history."
        action={
          <Link to="/dashboard/patients">
            <Button variant="primary" leftIcon={ArrowLeft}>
              Back to directory
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="patient-history">
      <Link to={`/dashboard/patients/${patient.id}`} className="patient-history__back">
        <ArrowLeft size={16} aria-hidden="true" /> Back to profile
      </Link>

      <header className="patient-history__header">
        <div>
          <span className="patient-history__eyebrow">Medical history</span>
          <h1>{patient.name}</h1>
          <p>
            Chronological view of visits, prescriptions and lab work for{' '}
            <strong>{patient.id}</strong>.
          </p>
        </div>
        <Link to={`/dashboard/patients/${patient.id}`}>
          <Button variant="outline">View profile</Button>
        </Link>
      </header>

      <div className="patient-history__tabs">
        {HISTORY_TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            type="button"
            className={`patient-history__tab ${tab === tabId ? 'is-active' : ''}`}
            onClick={() => setTab(tabId)}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'visits' && (
        <Card title="Visit timeline" subtitle={`${visits.length} visits on file`}>
          {visits.length === 0 ? (
            <EmptyState
              icon={FileText}
              size="sm"
              title="No visits yet"
              description="This patient hasn't been seen by a Subhan Care clinician."
            />
          ) : (
            <ol className="patient-history__timeline">
              {visits.map((visit) => (
                <li key={visit.id}>
                  <span className="patient-history__timeline-dot" />
                  <div>
                    <p className="patient-history__timeline-when">
                      {formatDate(visit.date)} ·{' '}
                      {formatTime(`1970-01-01T${visit.time}:00`)} · {visit.duration} min
                    </p>
                    <p className="patient-history__timeline-title">{visit.reason}</p>
                    {visit.notes && (
                      <p className="patient-history__timeline-notes">{visit.notes}</p>
                    )}
                    <StatusBadge tone={visit.status}>{visit.status}</StatusBadge>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      )}

      {tab === 'prescriptions' && (
        <Card title="Prescriptions" subtitle="Issued medications and dosage instructions.">
          <EmptyState
            icon={Pill}
            size="sm"
            title="Prescription module coming in Sprint 7"
            description="The prescriptions module will be built next sprint - this is your placeholder."
            action={
              <Button leftIcon={Plus} variant="primary" disabled>
                Add prescription
              </Button>
            }
          />
        </Card>
      )}

      {tab === 'labs' && (
        <Card title="Lab results" subtitle="Uploaded diagnostic reports.">
          <EmptyState
            icon={Activity}
            size="sm"
            title="No lab results uploaded"
            description="Lab integrations will be added in a later sprint."
          />
        </Card>
      )}

      <Card title="Billing summary" subtitle="Invoices generated for this patient.">
        {invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            size="sm"
            title="No invoices yet"
            description="Create one from the billing page."
          />
        ) : (
          <ul className="patient-history__invoices">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <div>
                  <p className="patient-history__invoice-when">{inv.id}</p>
                  <p className="patient-history__invoice-meta">
                    {inv.items.length} item(s) · Issued {formatDate(inv.issuedAt)}
                  </p>
                </div>
                <div className="patient-history__invoice-side">
                  <span className="patient-history__invoice-amount">
                    Rs {inv.total.toLocaleString()}
                  </span>
                  <StatusBadge tone={inv.status}>{inv.status}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default PatientHistoryPage;