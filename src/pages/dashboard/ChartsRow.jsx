import { useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';

import DateRangeFilter from './DateRangeFilter';
import DefaultCharts from './DefaultCharts';
import FilteredChart from './FilteredChart';

const DAYS_MAP = {
  '1w': 7,
  '2w': 14,
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
};

export default function ChartsRow({ refreshKey, onRangeChange }) {
  const [preset, setPreset] = useState(null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [bucketOverride, setBucketOverride] = useState('auto');

  const activeRange = useMemo(() => {
    if (!preset) return null;
    if (preset === 'custom') {
      if (!customStart || !customEnd) return null;
      const s = new Date(customStart);
      s.setHours(0, 0, 0, 0);
      const e = new Date(customEnd);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    const e = new Date();
    e.setHours(23, 59, 59, 999);
    const s = new Date();
    s.setDate(s.getDate() - DAYS_MAP[preset]);
    s.setHours(0, 0, 0, 0);
    return { start: s, end: e };
  }, [preset, customStart, customEnd]);

  const rangeDays = activeRange
    ? (activeRange.end - activeRange.start) / 86400000
    : null;

  useEffect(() => {
    onRangeChange?.({ activeRange, preset });
  }, [activeRange, preset]);

  const handlePresetChange = (p) => {
    setPreset(p);
    setBucketOverride('auto');
  };

  const handleClear = () => {
    setPreset(null);
    setCustomStart('');
    setCustomEnd('');
    setBucketOverride('auto');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <DateRangeFilter
        preset={preset}
        onPresetChange={handlePresetChange}
        onClear={handleClear}
        customStart={customStart}
        customEnd={customEnd}
        onCustomChange={(field, value) =>
          field === 'start' ? setCustomStart(value) : setCustomEnd(value)
        }
        bucketOverride={bucketOverride}
        onBucketChange={setBucketOverride}
        rangeDays={rangeDays}
      />
      {activeRange ? (
        <FilteredChart
          activeRange={activeRange}
          bucketOverride={bucketOverride}
          refreshKey={refreshKey}
        />
      ) : (
        <DefaultCharts refreshKey={refreshKey} />
      )}
    </div>
  );
}

ChartsRow.propTypes = {
  refreshKey: PropTypes.number,
  onRangeChange: PropTypes.func,
};

ChartsRow.defaultProps = {
  refreshKey: 0,
  onRangeChange: undefined,
};
