import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, DateInput, Input, Select, Textarea } from '../../../components/ui';
import { validateRequired } from '../../../utils/validators';
import './PrescriptionForm.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const generateId = () =>
  `RX-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;

const EMPTY_MEDICINE = () => ({ name: '', dosage: '', frequency: '', duration: '' });

/**
 * PrescriptionForm - select patient + doctor, diagnosis, a dynamic list of
 * medicines (name/dosage/frequency/duration), status, and notes.
 * Mirrors the InvoiceForm line-item pattern used in Billing.
 */
const PrescriptionForm = ({ initialValues, patients = [], doctors = [], onSubmit, onCancel }) => {
  const [values, setValues] = useState(() => ({
    id: initialValues?.id || generateId(),
    patientId: initialValues?.patientId || patients[0]?.id || '',
    doctorId: initialValues?.doctorId || doctors[0]?.id || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    diagnosis: initialValues?.diagnosis || '',
    status: initialValues?.status || 'active',
    notes: initialValues?.notes || '',
    medicines: initialValues?.medicines?.length ? initialValues.medicines : [EMPTY_MEDICINE()],
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialization}` }));

  const validateAll = (vals) => {
    const errs = {
      patientId: validateRequired(vals.patientId, 'Patient'),
      doctorId: validateRequired(vals.doctorId, 'Doctor'),
      date: validateRequired(vals.date, 'Date'),
      diagnosis: validateRequired(vals.diagnosis, 'Diagnosis'),
    };
    if (!vals.medicines.some((m) => m.name.trim() && m.dosage.trim())) {
      errs.medicines = 'Add at least one medicine with a name and dosage';
    }
    return errs;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validateAll(next));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateAll(values));
  };

  const updateMedicine = (index, field, value) => {
    setValues((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m, idx) => (idx === index ? { ...m, [field]: value } : m)),
    }));
  };

  const addMedicine = () => {
    setValues((prev) => ({ ...prev, medicines: [...prev.medicines, EMPTY_MEDICINE()] }));
  };

  const removeMedicine = (index) => {
    setValues((prev) => ({
      ...prev,
      medicines: prev.medicines.length > 1 ? prev.medicines.filter((_, idx) => idx !== index) : prev.medicines,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const allErrors = validateAll(values);
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.values(allErrors).some(Boolean)) return;
    setIsSubmitting(true);
    try {
      const cleanMedicines = values.medicines.filter((m) => m.name.trim() && m.dosage.trim());
      await onSubmit({ ...values, medicines: cleanMedicines });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="prescription-form" onSubmit={handleSubmit} noValidate>
      <div className="prescription-form__grid">
        <Input label="Prescription ID" name="id" value={values.id} onChange={handleChange} disabled />
        <DateInput
          label="Date"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={touched.date ? errors.date : ''}
        />
        <Select
          label="Patient"
          name="patientId"
          value={values.patientId}
          options={patientOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={touched.patientId ? errors.patientId : ''}
          placeholder="Select patient"
        />
        <Select
          label="Doctor"
          name="doctorId"
          value={values.doctorId}
          options={doctorOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={touched.doctorId ? errors.doctorId : ''}
          placeholder="Select doctor"
        />
        <Input
          label="Diagnosis"
          name="diagnosis"
          value={values.diagnosis}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Essential hypertension"
          required
          error={touched.diagnosis ? errors.diagnosis : ''}
        />
        <Select
          label="Status"
          name="status"
          value={values.status}
          options={STATUS_OPTIONS}
          onChange={handleChange}
        />
      </div>

      <div className="prescription-form__medicines">
        <div className="prescription-form__medicines-header">
          <h3>Medicines</h3>
          <Button type="button" variant="outline" size="small" leftIcon={Plus} onClick={addMedicine}>
            Add medicine
          </Button>
        </div>

        <div className="prescription-form__medicines-tableWrap">
          <table className="prescription-form__medicines-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th aria-label="remove" />
              </tr>
            </thead>
            <tbody>
              {values.medicines.map((med, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={med.name}
                      placeholder="e.g. Amoxicillin 250mg"
                      onChange={(event) => updateMedicine(index, 'name', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={med.dosage}
                      placeholder="1 tablet"
                      onChange={(event) => updateMedicine(index, 'dosage', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={med.frequency}
                      placeholder="Twice daily"
                      onChange={(event) => updateMedicine(index, 'frequency', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={med.duration}
                      placeholder="7 days"
                      onChange={(event) => updateMedicine(index, 'duration', event.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="prescription-form__remove-btn"
                      onClick={() => removeMedicine(index)}
                      disabled={values.medicines.length === 1}
                      aria-label="Remove medicine"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.medicines && <p className="prescription-form__error">{errors.medicines}</p>}
      </div>

      <Textarea
        label="Notes"
        name="notes"
        rows={3}
        value={values.notes}
        onChange={handleChange}
        placeholder="Additional instructions for the patient…"
      />

      <div className="prescription-form__actions">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialValues ? 'Save changes' : 'Create prescription'}
        </Button>
      </div>
    </form>
  );
};

export default PrescriptionForm;
