export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  category: 'inventory' | 'market' | 'sales' | 'opportunity' | 'risk';
  actionLabel?: string;
  productId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  forecastedDemand: number;
  reorderPoint: number;
  reorderQuantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
  lastRestockDate: string;
  daysOfSupply: number;
}

export interface ProductSales {
  id: string;
  name: string;
  category: string;
  sales: number;
  growth: number;
  stock: number;
  demand: 'High' | 'Medium' | 'Low';
}

export interface RegionData {
  id: string;
  name: string;
  sales: number;
  pharmacies: number;
  representatives: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface Representative {
  id: string;
  name: string;
  region: string;
  visits: number;
  conversionRate: number;
  targetAchievement: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: string;
  growth: number;
  growthChange: string;
  topProduct: string;
  topProductChange: string;
  marketHealth: number;
  marketHealthChange: string;
}

export interface MarketAnalysis {
  overview: string;
  insights: string[];
  issues: string[];
  opportunities: string[];
  recommendations: string[];
  simulation?: {
    scenario: string;
    impact: string;
  };
}

export interface Pharmacy {
  id: string;
  name: string;
  tier: 'VIP' | 'Medium' | 'Weak';
  sales: number;
  lastVisit: string;
  location: string;
}

export interface CompetitorData {
  name: string;
  marketShare: number;
  growth: number;
}

export interface SalesRecord {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  quantity: number;
  timestamp: string;
  region: string;
}
