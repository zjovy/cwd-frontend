import { useEffect, useMemo, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import TableScroll from '@/common/components/atoms/TableScroll';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import DonationViewModal from '@/common/components/organisms/DonationViewModal';
import useDonations from '@/hooks/useDonations';
import { usePageStyles } from '@/common/styles/pageStyles';
import donationService from '@/services/donationService';
import { PAGE_SIZE } from '@/utils/pagination';
import { RECEIPT_SUBJECT } from '@/utils/receiptTemplate';
import { Check, Download, Plus, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

import BulkSendModal from './BulkSendModal';
import DonationsFilterBar from './DonationsFilterBar';

/* ── helpers ─────────────────────────────────────────── */

function fmtExportDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('T')[0].split('-');
  return `${m}-${d}-${y.slice(2)}`;
}

async function fetchInChunks(items, fn, chunkSize = 10) {
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    results.push(...(await Promise.all(chunk.map(fn))));
  }
  return results;
}

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
  startDate: '',
  endDate: '',
};

/* ── component ───────────────────────────────────────── */

export default function DonationsPage() {
  const pageStyles = usePageStyles();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedMap, setSelectedMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [bulkMode, setBulkMode] = useState(null); // 'selected' | 'allUnsent' | null
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkRecipients, setBulkRecipients] = useState([]);
  const [bulkRecipientsCap, setBulkRecipientsCap] = useState(null);
  const [bulkRecipientsLoading, setBulkRecipientsLoading] = useState(false);
  const [bulkTemplate, setBulkTemplate] = useState(null);
  const [bulkTemplateLoading, setBulkTemplateLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
      setSelectedMap({});
    };
  });

  // Reset to page 1 whenever a filter value changes
  const handleFilterChange = (field, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
    setSelectedMap({});
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { donations: rows } = await donationService.getAll({
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: 10000,
      });
      if (rows.length === 0) {
        toast.info('No donations found for the selected date range.');
        return;
      }
      const detailed = await fetchInChunks(rows, (d) => donationService.getById(d.id));
      const data = detailed.map((d) => ({
        'Donor Name': d.donorFullName,
        Email: d.donorEmail,
        Amount: d.amount,
        Date: fmtExportDate(d.donation_date),
        'Receipt Status': d.receipt_status,
        Phone: d.phone ?? '',
        Address: d.address ?? '',
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      const { startDate, endDate } = filters;
      const fmtStart = fmtExportDate(startDate);
      const fmtEnd = fmtExportDate(endDate);
      const exportLabel =
        fmtStart && fmtEnd
          ? `${fmtStart}-${fmtEnd}Donations`
          : fmtStart
            ? `${fmtStart}-Donations`
            : fmtEnd
              ? `Donations-${fmtEnd}`
              : 'Donations';
      XLSX.utils.book_append_sheet(wb, ws, exportLabel.slice(0, 31));
      XLSX.writeFile(wb, `${exportLabel}.xlsx`);
    } catch (err) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const selected = useMemo(
    () => new Set(Object.keys(selectedMap).map((k) => Number(k))),
    [selectedMap]
  );

  const handleSelectChange = (id) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
        return next;
      }
      const donation = donations.find((d) => d.id === id);
      if (!donation) return next;
      next[id] = donation;
      return next;
    });
  };

  const handleSelectAll = (selectAll) => {
    const pageIds = donations.map((d) => d.id);
    setSelectedMap((prev) => {
      if (selectAll) {
        const next = { ...prev };
        donations.forEach((d) => {
          next[d.id] = d;
        });
        return next;
      }
      const next = { ...prev };
      pageIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
    () => Object.values(selectedMap),
    [selectedMap]
  );

  useEffect(() => {
    if (bulkTemplate || bulkTemplateLoading) return;
    setBulkTemplateLoading(true);
    donationService
      .getReceiptTemplate()
      .then((tpl) => setBulkTemplate(tpl))
      .catch((err) => {
        console.error('[DonationsPage] load receipt template failed:', err);
        toast.error('Failed to load receipt template. Please try again.');
      })
      .finally(() => setBulkTemplateLoading(false));
  }, [bulkTemplate, bulkTemplateLoading]);

  const closeBulk = () => {
    setBulkMode(null);
    setBulkResult(null);
    setBulkSending(false);
    setBulkRecipients([]);
    setBulkRecipientsCap(null);
    setBulkRecipientsLoading(false);
  };

  const handleMarkSent = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      const { updated } = await donationService.markSent(ids);
      toast.success(
        `Marked ${updated} donation${updated === 1 ? '' : 's'} as sent`
      );
      setSelectedMap({});
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
      setSelectedMap({});
      await refetchDonations();
    } catch (err) {
      console.error('[DonationsPage] bulk send failed:', err);
      setBulkResult({
        sent: [],
        failed: [],
        total: 0,
        requestError: err.message || 'Request failed',
      });
    } finally {
      setBulkSending(false);
    }
  };

  const selectedCount = selected.size;
  const allUnsentMode = bulkMode === 'allUnsent';
  const recipientsForModal = allUnsentMode
    ? bulkRecipients
    : selectedRecipients;

  return (
    <main style={pageStyles.main}>
      <div style={pageStyles.topRow}>
        <div>
          <div style={pageStyles.title}>Donations</div>
          <div style={pageStyles.subtitle}>
            View and manage all donation records.
          </div>
        </div>
        <div style={styles.topActions}>
          <button
            style={styles.ghostBtn}
            onClick={handleExport}
            disabled={isExporting}
            title='Only the date range filter is applied when exporting. Other filters (search, status, amount) are not used.'
          >
            <Download size={13} /> {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            style={styles.ghostBtn}
            onClick={() => {
              setBulkResult(null);
              setBulkMode('allUnsent');
              setBulkRecipients([]);
              setBulkRecipientsCap(null);
              setBulkRecipientsLoading(true);
              donationService
                .getUnsentRecipients(filters)
                .then((r) => {
                  setBulkRecipients(r.recipients || []);
                  setBulkRecipientsCap(
                    typeof r.cap === 'number' ? r.cap : null
                  );
                })
                .catch((err) => {
                  console.error(
                    '[DonationsPage] load unsent recipients failed:',
                    err
                  );
                  toast.error(
                    'Failed to load unsent recipients. Please try again.'
                  );
                })
                .finally(() => setBulkRecipientsLoading(false));
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
            {' (across pages)'}
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
              onClick={() => {
                setSelectedMap({});
              }}
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      <Card style={{ padding: pageStyles.cardPadding, marginTop: '16px' }}>
        <TableScroll>
          <DonationTable
            donations={donations}
            loading={loading}
            error={error}
            selected={selected}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
            onRowClick={(d) => setViewing(d)}
          />
        </TableScroll>

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
        key={bulkMode}
        open={Boolean(bulkMode)}
        recipients={recipientsForModal}
        recipientsCap={allUnsentMode ? bulkRecipientsCap : null}
        allUnsent={bulkMode === 'allUnsent'}
        subject={RECEIPT_SUBJECT}
        defaultBody={bulkTemplate?.body || ''}
        templateLoading={bulkTemplateLoading}
        recipientsLoading={allUnsentMode ? bulkRecipientsLoading : false}
        sending={bulkSending}
        result={bulkResult}
        onClose={closeBulk}
        onConfirm={handleBulkSend}
      />
    </main>
  );
}
