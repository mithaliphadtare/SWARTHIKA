import React from 'react';
import { RecommendationItem } from '../../types/case';
import {
  HeartPulse,
  Scale,
  Shield,
  Stethoscope,
  Users,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';

interface RecommendationPanelProps {
  recommendations: RecommendationItem[];
  onActionClick?: (item: RecommendationItem) => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  onActionClick,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Counselling':
        return HeartPulse;
      case 'Legal':
        return Scale;
      case 'Safety':
        return Shield;
      case 'Medical':
        return Stethoscope;
      case 'Social':
      default:
        return Users;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Immediate':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Standard':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Recommended Interventions & Care Pathways
          </h3>
          <p className="text-xs text-slate-500">
            Rule-based suggestions tailored to assessed vulnerability profile
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          Actionable Protocols
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((item) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-slate-50/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border uppercase ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onActionClick && onActionClick(item)}
                  className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-brand-50 hover:border-brand-300 text-slate-700 hover:text-brand-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <span>Initiate Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500 italic p-4">
            No specific high-priority interventions required for current status.
          </p>
        )}
      </div>

      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
        <AlertOctagon className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="font-semibold">
          « All actions require authorized human approval before execution. »
        </p>
      </div>
    </div>
  );
};
