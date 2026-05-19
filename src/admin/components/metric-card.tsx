import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  description?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  description,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
          {description && (
            <p className="mt-2 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}{trend.value}% from last month
          </span>
        </div>
      )}
    </div>
  );
}
