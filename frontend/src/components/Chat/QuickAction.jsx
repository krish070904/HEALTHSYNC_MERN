import React from "react";

export default function QuickActions({ onAction }) {
  const actions = ["Show diet tips", "Upload image", "When should I see a doctor?"];

  return (
    <div className="px-6 pb-2 shrink-0">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => onAction(action)}
            className="shrink-0 text-sm font-semibold px-4 py-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
