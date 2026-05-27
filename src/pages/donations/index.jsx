import { useEffect, useMemo, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import DonationViewModal from '@/common/components/organisms/DonationViewModal';
import useDonations from '@/hooks/useDonations';
import donationService from '@/services/donationService';
import { PAGE_SIZE } from '@/utils/pagination';
import {
  RECEIPT_SUBJECT,
  buildReceiptMessageTemplate,
} from '@/utils/receiptTemplate';
import { Check, Plus, Send, X } from 'lucide-react';
import { toast } from 'sonner';

import BulkSendModal from './BulkSendModal';
import DonationsFilterBar from './DonationsFilterBar';

/* ── styles ─────────────────────────────────────────── */

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#2563eb',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  ghostBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  bulkBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    margin: '12px 0',
    border: '1px solid #bfdbfe',
    background: '#eff6ff',
    borderRadius: '10px',
  },
  bulkLeft: {
    fontSize: '13px',
    color: '#1e3a8a',
    fontWeight: 500,
  },
  bulkRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  clearBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    border: 'none',
    background: 'transparent',
    color: '#1e3a8a',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

const INITIAL_FILTERS = {
  search: '',
  status: '',
  minAmount: '',
  maxAmount: '',
};

/* ── component ───────────────────────────────────────── */

export default function DonationsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [bulkMode, setBulkMode] = useState(null); // 'selected' | 'allUnsent' | null
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const {
    donations,
    total,
    totalPages,
    loading,
    error,
    onPageResetRef,
    createDonation,
    updateDonation,
    deleteDonation,
    refetchDonations,
  } = useDonations({ ...filters, page });

  // Give the hook a way to reset the page to 1 after create/delete
  useEffect(() => {
    onPageResetRef.current = () => {
      setPage(1);
      setSelected(new Set());
    };
  });

  // Reset to page 1 whenever a filter value changes
  const handleFilterChange = (field, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (selectAll) =>
    setSelected(selectAll ? new Set(donations.map((d) => d.id)) : new Set());

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelected(new Set());
  };

  const openCreate = () => setModalOpen(true);

  const handleCreate = async (data) => {
    await createDonation(data);
  };

  const handleDelete = async (id) => {
    await deleteDonation(id);
    setViewing(null);
  };

  const selectedRecipients = useMemo(
    () => donations.filter((d) => selected.has(d.id)),
    [donations, selected]
  );

  const bulkMessageTemplate = buildReceiptMessageTemplate();

  const closeBulk = () => {
    setBulkMode(null);
    setBulkResult(null);
    setBulkSending(false);
  };

  const handleMarkSent = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      const { updated } = await donationService.markSent(ids);
      toast.success(
        `Marked ${updated} donation${updated === 1 ? '' : 's'} as sent`
      );
      setSelected(new Set());
      await refetchDonations();
    } catch (err) {
      console.error('[DonationsPage] mark sent failed:', err);
      toast.error('Failed to mark donations as sent. Please try again.');
    }
  };

  const handleBulkSend = async (editedBody) => {
    setBulkSending(true);
    try {
      const payload =
        bulkMode === 'allUnsent'
          ? { allUnsent: true, filters, body: editedBody }
          : { ids: Array.from(selected), body: editedBody };
      const result = await donationService.sendReceipts(payload);
      setBulkResult(result);
      setSelected(new Set());
      await refetchDonations();
    } catch (err) {
      console.error('[DonationsPage] bulk send failed:', err);
      setBulkResult({
        sent: [],
        failed: [
          {
            id: 0,
            name: 'Bulk send request',
            email: null,
            error: err.message || 'Request failed',
          },
        ],
        total: 0,
      });
    } finally {
      setBulkSending(false);
    }
  };

  const selectedCount = selected.size;

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Donations</div>
          <div style={styles.subtitle}>
            View and manage all donation records.
          </div>
        </div>
        <div style={styles.topActions}>
          <button
            style={styles.ghostBtn}
            onClick={() => {
              setBulkResult(null);
              setBulkMode('allUnsent');
            }}
          >
            <Send size={13} /> Send All Unsent
          </button>
          <button style={styles.addBtn} onClick={openCreate}>
            <Plus size={14} color='white' /> Add Donation
          </button>
        </div>
      </div>

      <DonationsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        page={page}
        pageSize={PAGE_SIZE}
        total={loading ? null : total}
      />

      {selectedCount > 0 && (
        <div style={styles.bulkBar}>
          <div style={styles.bulkLeft}>
            {selectedCount} donation{selectedCount === 1 ? '' : 's'} selected
          </div>
          <div style={styles.bulkRight}>
            <button
              style={styles.addBtn}
              onClick={() => {
                setBulkResult(null);
                setBulkMode('selected');
              }}
            >
              <Send size={13} /> Send Receipts
            </button>
            <button style={styles.ghostBtn} onClick={handleMarkSent}>
              <Check size={13} /> Mark as Sent
            </button>
            <button
              style={styles.clearBtn}
              onClick={() => setSelected(new Set())}
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <DonationTable
          donations={donations}
          loading={loading}
          error={error}
          selected={selected}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onRowClick={(d) => setViewing(d)}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>

      <DonationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <DonationViewModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        donation={viewing}
        onSave={updateDonation}
        onDelete={handleDelete}
        onReceiptSent={refetchDonations}
      />

      <BulkSendModal
        key={bulkMode || 'closed'}
        open={Boolean(bulkMode)}
        recipients={selectedRecipients}
        allUnsent={bulkMode === 'allUnsent'}
        subject={RECEIPT_SUBJECT}
        defaultBody={bulkMessageTemplate}
        sending={bulkSending}
        result={bulkResult}
        onClose={closeBulk}
        onConfirm={handleBulkSend}
      />
    </main>
  );
}
