import { useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
  PackageX,
  Wallet,
  SlidersHorizontal,
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
import { useInventory } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { formatDate } from '../../../utils/helpers';
import InventoryForm from './InventoryForm';
import StockAdjustModal from './StockAdjustModal';
import './InventoryPage.css';

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All categories' },
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Equipment', label: 'Equipment' },
];

const STOCK_FILTERS = [
  { value: 'all', label: 'All stock levels' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
];

const getStockStatus = (item) => {
  if (item.quantity <= 0) return 'out-of-stock';
  if (item.quantity <= item.reorderLevel) return 'low-stock';
  return 'in-stock';
};

const STOCK_LABEL = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

const STOCK_TONE = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'danger',
};

const formatCurrency = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-PK')}`;

const InventoryPage = () => {
  const inventory = useInventory();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: 'all', stock: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [editing, setEditing] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [adjusting, setAdjusting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const stats = useMemo(() => {
    const list = inventory.list();
    const lowStock = list.filter((i) => getStockStatus(i) === 'low-stock').length;
    const outOfStock = list.filter((i) => getStockStatus(i) === 'out-of-stock').length;
    const totalValue = list.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return { total: list.length, lowStock, outOfStock, totalValue };
  }, [inventory]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return inventory.list().filter((item) => {
      if (term) {
        const haystack = `${item.id} ${item.name} ${item.supplier}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.stock !== 'all' && getStockStatus(item) !== filters.stock) return false;
      return true;
    });
  }, [inventory, searchTerm, filters]);

  const sorted = useMemo(() => filtered.slice().sort((a, b) => a.name.localeCompare(b.name)), [filtered]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleCreate = async (values) => {
    const created = await inventory.create(values);
    toast.success('Item added', `${created.name} added to inventory.`);
    setCreateOpen(false);
  };

  const handleEdit = async (values) => {
    const updated = await inventory.update(editing.id, values);
    toast.success('Item updated', `${updated.name} has been saved.`);
    setEditing(null);
  };

  const handleAdjust = async (delta) => {
    const nextQuantity = Math.max(0, adjusting.quantity + delta);
    const updated = await inventory.update(adjusting.id, { quantity: nextQuantity });
    toast.success('Stock adjusted', `${updated.name} is now at ${updated.quantity} ${updated.unit}.`);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await inventory.remove(deleting.id);
    toast.success('Item removed', `${deleting.name} was deleted from inventory.`);
    setDeleting(null);
  };

  return (
    <div className="inventory-page">
      <header className="inventory-page__header">
        <div>
          <span className="inventory-page__eyebrow">Inventory Management</span>
          <h1>Inventory</h1>
          <p>Track medicines, consumables, and equipment stock levels across Subhan Care.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={Plus}
          onClick={() => {
            setEditing(null);
            setCreateOpen(true);
          }}
        >
          Add Item
        </Button>
      </header>

      <section className="inventory-page__stats">
        <div className="inventory-page__stat">
          <Boxes size={18} aria-hidden="true" />
          <div>
            <p className="inventory-page__stat-label">Total items</p>
            <p className="inventory-page__stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="inventory-page__stat inventory-page__stat--warning">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <p className="inventory-page__stat-label">Low stock</p>
            <p className="inventory-page__stat-value">{stats.lowStock}</p>
          </div>
        </div>
        <div className="inventory-page__stat inventory-page__stat--danger">
          <PackageX size={18} aria-hidden="true" />
          <div>
            <p className="inventory-page__stat-label">Out of stock</p>
            <p className="inventory-page__stat-value">{stats.outOfStock}</p>
          </div>
        </div>
        <div className="inventory-page__stat inventory-page__stat--success">
          <Wallet size={18} aria-hidden="true" />
          <div>
            <p className="inventory-page__stat-label">Total stock value</p>
            <p className="inventory-page__stat-value">{formatCurrency(stats.totalValue)}</p>
          </div>
        </div>
      </section>

      <Card padding={false}>
        <div className="inventory-page__toolbar">
          <SearchInput
            value={searchTerm}
            placeholder="Search by item, supplier, or ID…"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="inventory-page__toolbar-filters">
            <Select
              name="category"
              value={filters.category}
              options={CATEGORY_FILTERS}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, category: event.target.value }));
                setCurrentPage(1);
              }}
              placeholder="Category"
            />
            <Select
              name="stock"
              value={filters.stock}
              options={STOCK_FILTERS}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, stock: event.target.value }));
                setCurrentPage(1);
              }}
              placeholder="Stock level"
            />
          </div>
        </div>

        <div className="inventory-page__tableWrap">
          <table className="inventory-page__table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Updated</th>
                <th>Status</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="inventory-page__item-name">{item.name}</div>
                      <div className="inventory-page__item-id">{item.id}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <button
                        type="button"
                        className="inventory-page__qty-btn"
                        onClick={() => setAdjusting(item)}
                        title="Adjust stock"
                      >
                        {item.quantity} {item.unit}
                        <SlidersHorizontal size={12} />
                      </button>
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.supplier}</td>
                    <td>{formatDate(item.updatedAt)}</td>
                    <td>
                      <StatusBadge tone={STOCK_TONE[status]}>{STOCK_LABEL[status]}</StatusBadge>
                    </td>
                    <td>
                      <div className="inventory-page__row-actions">
                        <button
                          type="button"
                          className="inventory-page__icon-btn"
                          onClick={() => {
                            setEditing(item);
                            setCreateOpen(false);
                          }}
                          title="Edit item"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="inventory-page__icon-btn inventory-page__icon-btn--danger"
                          onClick={() => setDeleting(item)}
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pageItems.length === 0 && (
            <EmptyState
              icon={Boxes}
              title="No inventory items found"
              description="Try clearing filters or add a new item."
              action={
                <Button
                  variant="primary"
                  leftIcon={Plus}
                  onClick={() => {
                    setEditing(null);
                    setCreateOpen(true);
                  }}
                >
                  Add Item
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
        title={editing ? 'Edit item' : 'Add inventory item'}
        subtitle={editing ? `Update ${editing.name}.` : 'Add a new medicine, consumable, or equipment item.'}
        size="md"
      >
        <InventoryForm
          initialValues={editing}
          onSubmit={editing ? handleEdit : handleCreate}
          onCancel={() => {
            setCreateOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      <StockAdjustModal
        isOpen={Boolean(adjusting)}
        item={adjusting}
        onClose={() => setAdjusting(null)}
        onAdjust={handleAdjust}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete inventory item?"
        confirmLabel="Delete item"
        body={
          <>
            You&apos;re about to permanently remove <strong>{deleting?.name}</strong> from
            inventory. This action cannot be undone.
          </>
        }
      />
    </div>
  );
};

export default InventoryPage;
