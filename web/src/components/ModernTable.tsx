import React from 'react';

interface Column {
  key: string;
  label: string;
  className?: string;
  hideOnMobile?: boolean;
}

interface ModernTableProps {
  title: string;
  description?: string;
  columns: Column[];
  data: any[];
  renderCell?: (key: string, value: any, row: any) => React.ReactNode;
  className?: string;
}

export default function ModernTable({ 
  title, 
  description,
  columns, 
  data, 
  renderCell,
  className = "" 
}: ModernTableProps) {
  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground break-words">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 break-words">{description}</p>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.hideOnMobile ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-accent/50 transition-colors duration-150">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 sm:px-6 py-3 text-sm font-medium ${column.hideOnMobile ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                  >
                    {renderCell ? renderCell(column.key, row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty state */}
      {data.length === 0 && (
        <div className="px-4 sm:px-6 py-8 text-center">
          <div className="text-muted-foreground">
            <svg className="mx-auto h-10 w-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No data available</p>
          </div>
        </div>
      )}
    </div>
  );
}
