import React from 'react';
import { RiskLevel } from '../../types/svi';
import { getRiskColorClass } from '../../lib/sviConfig';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showPulse = true,
}) => {
  const styles = getRiskColorClass(level);

  const sizeMap = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${styles.badge} ${sizeMap[size]}`}
    >
      {showPulse && level === 'CRITICAL' && (
        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
      )}
      <span>{level}</span>
    </span>
  );
};
