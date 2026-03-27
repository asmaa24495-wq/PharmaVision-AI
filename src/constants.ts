import { ProductSales, RegionData, Representative, Pharmacy, CompetitorData, InventoryItem, Alert } from './types';

export const MOCK_PRODUCTS: ProductSales[] = [
  { id: '1', name: 'Product A', category: 'General', sales: 500, growth: -15, stock: 200, demand: 'Medium' },
  { id: '2', name: 'Product B', category: 'General', sales: 300, growth: 0, stock: 150, demand: 'Medium' },
  { id: '3', name: 'Product C', category: 'General', sales: 150, growth: 25, stock: 80, demand: 'High' },
];

export const MOCK_REGIONS: RegionData[] = [
  { id: 'r1', name: 'Cairo', sales: 500, pharmacies: 45, representatives: 5, coordinates: [30.0444, 31.2357] },
  { id: 'r2', name: 'Giza', sales: 300, pharmacies: 30, representatives: 3, coordinates: [30.0131, 31.2089] },
  { id: 'r3', name: 'Alexandria', sales: 150, pharmacies: 25, representatives: 2, coordinates: [31.2001, 29.9187] },
];

export const MOCK_REPS: Representative[] = [
  { id: 'rep1', name: 'Ahmed Mansour', region: 'Cairo', visits: 45, conversionRate: 78, targetAchievement: 92 },
  { id: 'rep2', name: 'Sara Al-Otaibi', region: 'Giza', visits: 38, conversionRate: 82, targetAchievement: 105 },
  { id: 'rep3', name: 'Khalid Ibrahim', region: 'Alexandria', visits: 30, conversionRate: 65, targetAchievement: 85 },
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Al-Dawaa Pharmacy', tier: 'VIP', sales: 12000, lastVisit: '2026-03-20', location: 'Cairo' },
  { id: 'ph2', name: 'Nahdi Medical', tier: 'VIP', sales: 15000, lastVisit: '2026-03-22', location: 'Giza' },
  { id: 'ph3', name: 'Local Care', tier: 'Medium', sales: 5000, lastVisit: '2026-03-15', location: 'Alexandria' },
  { id: 'ph4', name: 'Health First', tier: 'Weak', sales: 1200, lastVisit: '2026-03-10', location: 'Cairo' },
];

export const COMPETITOR_DATA: CompetitorData[] = [
  { name: 'Our Brand', marketShare: 35, growth: 12 },
  { name: 'PharmaCorp', marketShare: 28, growth: 5 },
  { name: 'BioHealth', marketShare: 22, growth: -2 },
  { name: 'GlobalMed', marketShare: 15, growth: 8 },
];

export const SALES_CHART_DATA = [
  { month: 'Jan', sales: 45000, target: 40000 },
  { month: 'Feb', sales: 52000, target: 42000 },
  { month: 'Mar', sales: 48000, target: 45000 },
  { month: 'Apr', sales: 61000, target: 48000 },
  { month: 'May', sales: 55000, target: 50000 },
  { month: 'Jun', sales: 67000, target: 52000 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { 
    id: '1', 
    name: 'Product A', 
    currentStock: 1250, 
    forecastedDemand: 1100, 
    reorderPoint: 400, 
    reorderQuantity: 1000, 
    status: 'In Stock', 
    lastRestockDate: '2026-03-10',
    daysOfSupply: 34
  },
  { 
    id: '2', 
    name: 'Product B', 
    currentStock: 320, 
    forecastedDemand: 850, 
    reorderPoint: 450, 
    reorderQuantity: 1200, 
    status: 'Low Stock', 
    lastRestockDate: '2026-02-28',
    daysOfSupply: 11
  },
  { 
    id: '3', 
    name: 'Product C', 
    currentStock: 45, 
    forecastedDemand: 600, 
    reorderPoint: 200, 
    reorderQuantity: 800, 
    status: 'Out of Stock', 
    lastRestockDate: '2026-02-15',
    daysOfSupply: 2
  },
  { 
    id: '4', 
    name: 'Product D', 
    currentStock: 2800, 
    forecastedDemand: 400, 
    reorderPoint: 150, 
    reorderQuantity: 500, 
    status: 'Overstock', 
    lastRestockDate: '2026-03-20',
    daysOfSupply: 210
  },
  { 
    id: '5', 
    name: 'Product E', 
    currentStock: 600, 
    forecastedDemand: 580, 
    reorderPoint: 250, 
    reorderQuantity: 600, 
    status: 'In Stock', 
    lastRestockDate: '2026-03-05',
    daysOfSupply: 31
  },
];

export const INVENTORY_THRESHOLD = 15; // daysOfSupply

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'critical',
    title: 'Critical Stockout: Product C',
    message: 'Inventory levels for Product C in Cairo have dropped below the critical threshold (2 days of supply). Immediate replenishment required.',
    timestamp: '2026-03-25T12:30:00Z',
    category: 'inventory',
    actionLabel: 'Authorize Replenishment',
    productId: '3'
  },
  {
    id: 'a2',
    type: 'warning',
    title: 'Competitor Price Change',
    message: 'Competitor Y has reduced the price of "Generic Statin" by 12% in the Cairo market. AI suggests a 5% loyalty rebate for key accounts.',
    timestamp: '2026-03-25T11:00:00Z',
    category: 'market',
    actionLabel: 'View Impact Analysis'
  },
  {
    id: 'a3',
    type: 'critical',
    title: 'Sudden Sales Drop: Alexandria',
    message: 'Sales in Alexandria region have dropped by 22% in the last 48 hours. AI identifies a potential logistics bottleneck or competitor aggressive promotion.',
    timestamp: '2026-03-25T13:00:00Z',
    category: 'sales',
    actionLabel: 'Investigate Region'
  },
  {
    id: 'a4',
    type: 'success',
    title: 'New Opportunity: Allergy Surge',
    message: 'Predictive models show a 40% surge in antihistamine demand in the Giza region starting next week due to early pollen season. Recommend increasing stock levels now.',
    timestamp: '2026-03-25T13:15:00Z',
    category: 'opportunity',
    actionLabel: 'Allocate Stock'
  },
  {
    id: 'a5',
    type: 'warning',
    title: 'Supply Chain Risk: Raw Materials',
    message: 'Potential 15-day delay in raw material delivery for Antibiotics due to port congestion. Risk of stockout for Product B in 3 weeks.',
    timestamp: '2026-03-25T10:45:00Z',
    category: 'risk',
    actionLabel: 'Source Alternative'
  }
];
