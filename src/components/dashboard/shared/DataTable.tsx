import React, { useState, useMemo } from 'react';

interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  filterable?: boolean;
  filterPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function DataTable<T extends { id?: number | string }>({
  data, columns, sortable = true, defaultSortKey, defaultSortDirection = 'asc',
  filterable = true, filterPlaceholder = 'Search...', pagination = true, pageSize: initialPageSize = 10,
  onRowClick, emptyMessage = 'No data available', emptyIcon, loading, className = ''
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filteredData = useMemo(() => {
    if (!filter) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter(row => columns.some(col => String(row[col.key as keyof T]).toLowerCase().includes(lowerFilter)));
  }, [data, filter, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey as keyof T]; const bVal = b[sortKey as keyof T];
      if (aVal === bVal) return 0;
      return sortDir === 'asc' ? (aVal! < bVal! ? -1 : 1) : (aVal! > bVal! ? -1 : 1);
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination ? sortedData.slice((page - 1) * pageSize, page * pageSize) : sortedData;

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
      {filterable && (
        <div className="p-3 border-b border-slate-200">
          <input type="text" placeholder={filterPlaceholder} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="w-full max-w-xs px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map(col => (
                <th key={String(col.key)} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${alignClasses[col.align || 'left']} ${col.sortable !== false && sortable ? 'cursor-pointer hover:text-slate-700' : ''}`}
                  style={{ width: col.width }} onClick={() => col.sortable !== false && handleSort(String(col.key))}>
                  <span className="flex items-center gap-1 justify-between">
                    {col.header}
                    {sortable && col.sortable !== false && sortKey === String(col.key) && <span className="text-indigo-600">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>{columns.map((col, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 rounded animate-pulse" /></td>)}</tr>
            )) : paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">{emptyMessage}</td></tr>
            ) : paginatedData.map((row, rowIndex) => (
              <tr key={String(row.id || rowIndex)} className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`} onClick={() => onRowClick?.(row)}>
                {columns.map((col, colIndex) => (
                  <td key={String(col.key)} className={`px-4 py-3 text-sm ${alignClasses[col.align || 'left']} ${colIndex === 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                    {col.render ? col.render(row[col.key as keyof T], row, rowIndex) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="p-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, sortedData.length)} of {sortedData.length}</div>
          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size} per page</option>)}
            </select>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
              <span className="px-3 py-1 text-sm text-slate-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
