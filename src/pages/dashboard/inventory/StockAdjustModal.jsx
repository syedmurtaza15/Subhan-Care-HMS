import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button, Modal } from '../../../components/ui';
import './InventoryForm.css';

/**
 * StockAdjustModal - quick increment/decrement of an item's quantity
 * (e.g. after receiving new stock or dispensing to a patient).
 */
const StockAdjustModal = ({ isOpen, item, onClose, onAdjust }) => {
  const [delta, setDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const projected = Math.max(0, item.quantity + delta);

  const handleClose = () => {
    setDelta(0);
    onClose();
  };

  const handleConfirm = async () => {
    if (delta === 0) return handleClose();
    setIsSubmitting(true);
    try {
      await onAdjust(delta);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Adjust stock — ${item.name}`} size="sm">
      <div className="stock-adjust">
        <p className="stock-adjust__current">
          Current stock: <strong>{item.quantity} {item.unit}</strong>
        </p>

        <div className="stock-adjust__controls">
          <button
            type="button"
            className="stock-adjust__btn"
            onClick={() => setDelta((d) => d - 1)}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="stock-adjust__delta">{delta > 0 ? `+${delta}` : delta}</span>
          <button
            type="button"
            className="stock-adjust__btn"
            onClick={() => setDelta((d) => d + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="stock-adjust__projected">
          New quantity: <strong>{projected} {item.unit}</strong>
        </p>

        <div className="stock-adjust__actions">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} isLoading={isSubmitting}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StockAdjustModal;
