import { User, CreditCard, Trash2, LogIn } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "signup" | "transaction" | "delete" | "login" | "action";
  user: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const activityIcons = {
  signup: <LogIn className="h-4 w-4 text-blue-600" />,
  transaction: <CreditCard className="h-4 w-4 text-green-600" />,
  delete: <Trash2 className="h-4 w-4 text-red-600" />,
  login: <User className="h-4 w-4 text-purple-600" />,
  action: <User className="h-4 w-4 text-gray-600" />,
};

const activityBg = {
  signup: "bg-blue-50",
  transaction: "bg-green-50",
  delete: "bg-red-50",
  login: "bg-purple-50",
  action: "bg-gray-50",
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">No activity yet</p>
        </div>
      ) : (
        items.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activityBg[item.type]
                }`}
              >
                {item.icon || activityIcons[item.type]}
              </div>
              {index !== items.length - 1 && (
                <div className="mt-2 mb-2 w-0.5 h-8 bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.user}</p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {item.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
