import { ReactNode } from "react";

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function DashboardSection({
  title,
  description,
  children,
  action,
}: SectionProps) {
  return (
    <div className="mt-8 first:mt-0">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

interface ChartContainerProps {
  title?: string;
  children: ReactNode;
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <Card className="h-full">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>}
      {children}
    </Card>
  );
}
