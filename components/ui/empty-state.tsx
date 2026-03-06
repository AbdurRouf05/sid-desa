import { LucideIcon, Inbox } from "lucide-react";

/**
 * EmptyState — A centered illustration block shown when a data list has zero items.
 * Provides consistent styling across all admin pages.
 */

interface EmptyStateProps {
    /** The icon to display (default: Inbox) */
    icon?: LucideIcon;
    /** Main heading text */
    title: string;
    /** Descriptive subtitle */
    description?: string;
    /** Optional action element (e.g. a button) */
    action?: React.ReactNode;
    /** Number of table columns to span (when used inside <tbody>) */
    colSpan?: number;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, colSpan }: EmptyStateProps) {
    const content = (
        <div className="flex flex-col items-center py-12 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 text-center">{title}</p>
            {description && (
                <p className="text-sm text-slate-500 mt-1 text-center max-w-md">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );

    // If colSpan is provided, wrap in a table row for use inside <tbody>
    if (colSpan) {
        return (
            <tr>
                <td colSpan={colSpan}>{content}</td>
            </tr>
        );
    }

    return content;
}
