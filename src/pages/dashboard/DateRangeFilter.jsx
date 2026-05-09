import PropTypes from 'prop-types';

const PRESETS = [
  { key: '1w', label: '1W' },
  { key: '2w', label: '2W' },
  { key: '1m', label: '1M' },
  { key: '3m', label: '3M' },
  { key: '6m', label: '6M' },
  { key: '1y', label: '1Y' },
  { key: 'custom', label: 'Custom' },
];

const BUCKETS = [
  { key: 'auto', label: 'Auto' },
  { key: 'day', label: 'Day' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

const styles = {
  wrap: { marginBottom: '12px' },
  presetRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '8px',
  },
  bucketRow: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    marginTop: '8px',
  },
  dateLabel: { fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' },
  bucketLabel: { fontSize: '12px', color: '#6b7280', marginRight: '4px' },
  dateInput: {
    padding: '5px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    background: '#f9fafb',
  },
};

function presetBtnStyle(active) {
  return {
    padding: '5px 10px',
    border: `1px solid ${active ? '#3b82f6' : '#e5e7eb'}`,
    borderRadius: '6px',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#374151',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
  };
}

function clearBtnStyle() {
  return {
    padding: '5px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    background: '#fff',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
    marginLeft: '4px',
  };
}

function bucketBtnStyle(active, disabled) {
  return {
    padding: '4px 10px',
    border: `1px solid ${active ? '#3b82f6' : '#e5e7eb'}`,
    borderRadius: '6px',
    background: active ? '#eff6ff' : '#fff',
    color: disabled ? '#d1d5db' : active ? '#2563eb' : '#374151',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };
}

export default function DateRangeFilter({
  preset,
  onPresetChange,
  onClear,
  customStart,
  customEnd,
  onCustomChange,
  bucketOverride,
  onBucketChange,
  rangeDays,
}) {
  return (
    <div style={styles.wrap}>
      <div style={styles.presetRow}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            style={presetBtnStyle(preset === p.key)}
            onClick={() => onPresetChange(p.key)}
          >
            {p.label}
          </button>
        ))}
        {preset && (
          <button style={clearBtnStyle()} onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {preset === 'custom' && (
        <div style={styles.dateRow}>
          <span style={styles.dateLabel}>From</span>
          <input
            type='date'
            style={styles.dateInput}
            value={customStart}
            onChange={(e) => onCustomChange('start', e.target.value)}
          />
          <span style={styles.dateLabel}>To</span>
          <input
            type='date'
            style={styles.dateInput}
            value={customEnd}
            onChange={(e) => onCustomChange('end', e.target.value)}
          />
        </div>
      )}

      {rangeDays !== null && (
        <div style={styles.bucketRow}>
          <span style={styles.bucketLabel}>Bucket:</span>
          {BUCKETS.map((b) => {
            const disabled =
              (b.key === 'day' && rangeDays > 90) ||
              (b.key === 'year' && rangeDays < 60);
            return (
              <button
                key={b.key}
                style={bucketBtnStyle(bucketOverride === b.key, disabled)}
                disabled={disabled}
                onClick={() => !disabled && onBucketChange(b.key)}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

DateRangeFilter.propTypes = {
  preset: PropTypes.string,
  onPresetChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  customStart: PropTypes.string.isRequired,
  customEnd: PropTypes.string.isRequired,
  onCustomChange: PropTypes.func.isRequired,
  bucketOverride: PropTypes.string.isRequired,
  onBucketChange: PropTypes.func.isRequired,
  rangeDays: PropTypes.number,
};

DateRangeFilter.defaultProps = {
  preset: null,
  rangeDays: null,
};
