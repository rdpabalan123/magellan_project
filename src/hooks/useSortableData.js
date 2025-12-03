import { useState, useMemo } from 'react';

export default function useSortableData(items, config = null) {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    const sorted = [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string') return aVal.localeCompare(bVal);
      if (typeof aVal === 'number') return aVal - bVal;

      return 0;
    });

    if (sortConfig.direction === 'desc') sorted.reverse();

    return sorted;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}
