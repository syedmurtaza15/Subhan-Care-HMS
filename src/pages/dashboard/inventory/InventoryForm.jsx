import { useState } from 'react';
import { Button, Input, Select } from '../../../components/ui';
import { validateRequired } from '../../../utils/validators';
import './InventoryForm.css';

const CATEGORY_OPTIONS = [
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Equipment', label: 'Equipment' },
];

const generateId = () =>
  `INV-ITM-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')}`;

/**
 * InventoryForm - add/edit an inventory item (medicine, consumable, or equipment).
 */
const InventoryForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState(() => ({
    id: initialValues?.id || generateId(),
    name: initialValues?.name || '',
    category: initialValues?.category || 'Medicine',
    unit: initialValues?.unit || '',
    quantity: initialValues?.quantity ?? '',
    reorderLevel: initialValues?.reorderLevel ?? '',
    price: initialValues?.price ?? '',
    supplier: initialValues?.supplier || '',
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAll = (vals) => ({
    name: validateRequired(vals.name, 'Item name'),
    unit: validateRequired(vals.unit, 'Unit'),
    quantity: vals.quantity === '' || Number(vals.quantity) < 0 ? 'Enter a valid quantity' : '',
    reorderLevel: vals.reorderLevel === '' || Number(vals.reorderLevel) < 0 ? 'Enter a valid reorder level' : '',
    price: vals.price === '' || Number(vals.price) < 0 ? 'Enter a valid price' : '',
    supplier: validateRequired(vals.supplier, 'Supplier'),
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const allErrors = validateAll(values);
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.values(allErrors).some(Boolean)) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        quantity: Number(values.quantity),
        reorderLevel: Number(values.reorderLevel),
        price: Number(values.price),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit} noValidate>
      <div className="inventory-form__grid">
        <Input
          label="Item name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Paracetamol 500mg"
          required
          error={touched.name ? errors.name : ''}
        />
        <Select
          label="Category"
          name="category"
          value={values.category}
          options={CATEGORY_OPTIONS}
          onChange={handleChange}
        />
        <Input
          label="Unit"
          name="unit"
          value={values.unit}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tablets / Boxes / Units"
          required
          error={touched.unit ? errors.unit : ''}
        />
        <Input
          label="Quantity in stock"
          name="quantity"
          type="number"
          min="0"
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={touched.quantity ? errors.quantity : ''}
        />
        <Input
          label="Reorder level"
          name="reorderLevel"
          type="number"
          min="0"
          value={values.reorderLevel}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText="Alerts trigger when stock falls to or below this level"
          required
          error={touched.reorderLevel ? errors.reorderLevel : ''}
        />
        <Input
          label="Unit price (Rs)"
          name="price"
          type="number"
          min="0"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={touched.price ? errors.price : ''}
        />
        <Input
          label="Supplier"
          name="supplier"
          value={values.supplier}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Supplier name"
          required
          error={touched.supplier ? errors.supplier : ''}
        />
      </div>

      <div className="inventory-form__actions">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialValues ? 'Save changes' : 'Add item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;
