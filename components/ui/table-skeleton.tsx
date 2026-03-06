/**
 * TableSkeleton — Animated shimmer rows for table loading states.
 * Reduces CLS (Cumulative Layout Shift) by filling the table
 * with realistic placeholder rows while data is being fetched.
 */

interface TableSkeletonProps {
    /** Number of columns in the table */
    columns: number;
    /** Number of skeleton rows to render (default: 5) */
    rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="animate-pulse">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <td key={colIdx} className="p-4">
                            <div className="flex flex-col gap-2">
                                <div
                                    className="h-4 bg-slate-200 rounded-md"
                                    style={{ width: `${60 + Math.random() * 30}%` }}
                                />
                                {colIdx === 1 && (
                                    <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                                )}
                            </div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
