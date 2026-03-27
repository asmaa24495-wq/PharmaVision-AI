import { InventoryItem, Alert } from '../types';
import { INVENTORY_THRESHOLD, MOCK_ALERTS } from '../constants';

export const generateInventoryAlerts = (inventory: InventoryItem[], threshold: number): Alert[] => {
  const inventoryAlerts: Alert[] = inventory
    .filter(item => item.daysOfSupply < threshold)
    .map(item => ({
      id: `inv-${item.id}`,
      type: item.daysOfSupply < 5 ? 'critical' : 'warning',
      title: `Low Stock Alert: ${item.name}`,
      message: `Inventory for ${item.name} is low (${item.daysOfSupply} days of supply). Threshold is ${threshold} days.`,
      timestamp: new Date().toISOString(),
      category: 'inventory',
      actionLabel: 'Reorder Now',
      productId: item.id
    }));

  return [...MOCK_ALERTS, ...inventoryAlerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
