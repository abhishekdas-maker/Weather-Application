import React from 'react';
import {
  Shirt,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Bike,
  Coffee,
  Footprints,
  Umbrella,
  Sun,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { WeatherIntelligence, ActivityScore } from '../types';

interface SmartRecommendationsProps {
  intelligence: WeatherIntelligence;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ intelligence }) => {
  const { clothing, activities, generalAdvice, comfortIndex, comfortLabel } = intelligence;

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case 'Bike':
        return <Bike className="w-4 h-4 text-sky-500" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-indigo-500" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getScoreBadgeColor = (label: ActivityScore['label']) => {
    switch (label) {
      case 'Ideal':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 backdrop-blur-md';
      case 'Good':
        return 'bg-sky-500/20 text-sky-300 border-sky-400/30 backdrop-blur-md';
      case 'Fair':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30 backdrop-blur-md';
      case 'Challenging':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/30 backdrop-blur-md';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-400/30 backdrop-blur-md';
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-400 shadow-[0_0_8px_#34d399]';
    if (score >= 65) return 'bg-sky-400 shadow-[0_0_8px_#38bdf8]';
    if (score >= 50) return 'bg-amber-400 shadow-[0_0_8px_#fbbf24]';
    if (score >= 30) return 'bg-orange-400 shadow-[0_0_8px_#fb923c]';
    return 'bg-rose-400 shadow-[0_0_8px_#f43f5e]';
  };

  return (
    <div id="smart-recommendations-section" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Clothing & Outfit Strategy (7 cols) */}
      <div id="clothing-recommendations-card" className="lg:col-span-7 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-sky-300 shadow-sm">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Clothing Intelligence & Wardrobe
                </h2>
                <span className="text-xs text-sky-200/70">
                  {clothing.summary}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-sky-200 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Contextual AI</span>
            </div>
          </div>

          {/* Alert if any */}
          {clothing.alert && (
            <div className="mx-5 mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 backdrop-blur-md flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
              <span>{clothing.alert}</span>
            </div>
          )}

          {/* Breakdown Items */}
          <div className="p-5 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Outerwear */}
              <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors">
                <span className="text-[11px] font-semibold text-sky-300/80 uppercase tracking-wider block mb-1">
                  Outerwear Layer
                </span>
                <p className="text-xs font-semibold text-white">
                  {clothing.outerwear}
                </p>
              </div>

              {/* Tops */}
              <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors">
                <span className="text-[11px] font-semibold text-sky-300/80 uppercase tracking-wider block mb-1">
                  Top Base / Mid Layer
                </span>
                <p className="text-xs font-semibold text-white">
                  {clothing.top}
                </p>
              </div>

              {/* Bottoms */}
              <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors">
                <span className="text-[11px] font-semibold text-sky-300/80 uppercase tracking-wider block mb-1">
                  Bottoms
                </span>
                <p className="text-xs font-semibold text-white">
                  {clothing.bottom}
                </p>
              </div>

              {/* Footwear */}
              <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors">
                <span className="text-[11px] font-semibold text-sky-300/80 uppercase tracking-wider block mb-1">
                  Footwear
                </span>
                <p className="text-xs font-semibold text-white">
                  {clothing.footwear}
                </p>
              </div>
            </div>

            {/* Essential Accessories Checklist */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-sky-200/90 block mb-2">
                Recommended Gear & Accessories
              </span>
              <div className="flex flex-wrap gap-2">
                {clothing.accessories.length > 0 ? (
                  clothing.accessories.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white/10 text-sky-200 border border-white/20 backdrop-blur-md shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    No specialized gear required for current conditions.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Narrative Footer */}
        <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{generalAdvice}</span>
        </div>
      </div>

      {/* Activity Suitability & Planning (5 cols) */}
      <div id="activity-recommendations-card" className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Outdoor Planning & Activities
                </h2>
                <span className="text-xs text-sky-200/70">
                  Real-time conditions rating
                </span>
              </div>
            </div>

            {/* Comfort Index Meter */}
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Comfort Index</span>
              <span className="text-xs font-bold text-white">
                {comfortIndex}/100 ({comfortLabel})
              </span>
            </div>
          </div>

          {/* Activities List */}
          <div className="p-5 space-y-3.5">
            {activities.map((act) => (
              <div
                key={act.name}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(act.icon)}
                    <span className="text-xs font-bold text-white">
                      {act.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${getScoreBadgeColor(
                      act.label
                    )}`}
                  >
                    {act.label} ({act.score}%)
                  </span>
                </div>

                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(act.score)} transition-all duration-300`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300">
                  {act.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-white/5 backdrop-blur-md border-t border-white/10 text-center">
          <span className="text-[11px] text-slate-400">
            Ratings adjust continuously with temperature, rain risk, and wind velocity.
          </span>
        </div>
      </div>
    </div>
  );
};
