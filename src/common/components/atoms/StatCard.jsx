import Card from '@/common/components/atoms/Card';
import PropTypes from 'prop-types';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  iconWrap: (color) => ({
    color: color || '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  }),
  value: (color) => ({
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: color || '#1a1a1a',
    lineHeight: 1,
    marginBottom: '6px',
  }),
  sub: {
    fontSize: '12px',
    color: '#9ca3af',
  },
};

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  valueColor,
}) {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        {Icon && (
          <span style={styles.iconWrap(iconColor)}>
            <Icon size={18} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <div style={styles.value(valueColor)}>{value}</div>
      <div style={styles.sub}>{sub}</div>
    </Card>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  sub: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  valueColor: PropTypes.string,
};

StatCard.defaultProps = {
  icon: undefined,
  iconColor: undefined,
  valueColor: undefined,
};
