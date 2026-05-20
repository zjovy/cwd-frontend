import PropTypes from 'prop-types';

import DefaultCharts from './DefaultCharts';
import FilteredChart from './FilteredChart';

export default function ChartsRow({ refreshKey, activeRange, bucketOverride }) {
  return (
    <div style={{ marginTop: '20px' }}>
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
  activeRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }),
  bucketOverride: PropTypes.string,
};

ChartsRow.defaultProps = {
  refreshKey: 0,
  activeRange: null,
  bucketOverride: 'auto',
};
