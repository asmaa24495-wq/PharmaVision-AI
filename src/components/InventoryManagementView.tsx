import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  Calendar,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Eye,
  Search,
  Layers,
  Clock,
  Target,
  BarChart3,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { InventoryItem } from '../types';
import ExportDataPanel from './ExportDataPanel';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/firestoreService';

interface InventoryManagementViewProps {
  t: any;
  threshold: number;
  onThresholdChange: (val: number) => void;
}

const InventoryManagementView = ({ t, threshold, onThresholdChange }: InventoryManagementViewProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    initialStock: '',
    reorderPoint: '',
    reorderQuantity: ''
  });

  useEffect(() => {
    const unsubscribe = getInventory((items) => {
      setInventory(items);
      setFilteredInventory(items);
      setIsLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditMode ? 'Updating product...' : 'Adding product...');
    try {
      if (isEditMode && selectedItem) {
        await updateInventoryItem(selectedItem.id, {
          name: formData.name,
          currentStock: parseInt(formData.initialStock),
          reorderPoint: parseInt(formData.reorderPoint),
          reorderQuantity: parseInt(formData.reorderQuantity),
          status: parseInt(formData.initialStock) <= parseInt(formData.reorderPoint) ? 'Low Stock' : 'In Stock',
          daysOfSupply: Math.floor(parseInt(formData.initialStock) / 10)
        });
        toast.success('Product updated successfully', { id: loadingToast });
      } else {
        const newItem: Omit<InventoryItem, 'id'> = {
          name: formData.name,
          currentStock: parseInt(formData.initialStock),
          reorderPoint: parseInt(formData.reorderPoint),
          reorderQuantity: parseInt(formData.reorderQuantity),
          status: parseInt(formData.initialStock) <= parseInt(formData.reorderPoint) ? 'Low Stock' : 'In Stock',
          forecastedDemand: Math.floor(Math.random() * 500) + 100,
          lastRestockDate: new Date().toISOString().split('T')[0],
          daysOfSupply: Math.floor(parseInt(formData.initialStock) / 10)
        };
        await addInventoryItem(newItem);
        toast.success('Product added successfully', { id: loadingToast });
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({ name: '', initialStock: '', reorderPoint: '', reorderQuantity: '' });
    } catch (error) {
      toast.error('Failed to save product', { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    if (deleteItem) {
      const loadingToast = toast.loading('Deleting product...');
      try {
        await deleteInventoryItem(deleteItem.id);
        toast.success('Product deleted successfully', { id: loadingToast });
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      } catch (error) {
        toast.error('Failed to delete product', { id: loadingToast });
      }
    }
  };

  const handleReorder = async () => {
    if (reorderItem) {
      const loadingToast = toast.loading('Processing reorder...');
      try {
        const newStock = reorderItem.currentStock + reorderItem.reorderQuantity;
        await updateInventoryItem(reorderItem.id, {
          currentStock: newStock,
          status: 'In Stock',
          lastRestockDate: new Date().toISOString().split('T')[0],
          daysOfSupply: Math.floor(newStock / 10)
        });
        toast.success(`Reorder for ${reorderItem.name} confirmed!`, { id: loadingToast });
        setIsReorderModalOpen(false);
      } catch (error) {
        toast.error('Failed to process reorder', { id: loadingToast });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'Low Stock': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
      case 'Out of Stock': return 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
      case 'Overstock': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return <CheckCircle2 size={14} />;
      case 'Low Stock': return <AlertCircle size={14} />;
      case 'Out of Stock': return <XCircle size={14} />;
      case 'Overstock': return <Info size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Items</span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{inventory.length}</p>
          <p className="text-xs text-slate-500 mt-1">Across {new Set(inventory.map(i => i.name)).size} products</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stockout Risks</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">{inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length}</p>
          <p className="text-xs text-rose-500 mt-1">Requires immediate action</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-lg">
              <RefreshCw size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Orders</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">8</p>
          <p className="text-xs text-amber-500 mt-1">$45,200 total value</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Value</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">$1.2M</p>
          <p className="text-xs text-emerald-500 mt-1">+5.2% from last month</p>
        </div>
      </div>

      <ExportDataPanel 
        data={inventory}
        filename="inventory_report"
        title="PharmaVision Inventory Report"
        onFilter={setFilteredInventory}
        filterOptions={[
          { key: 'status', label: 'Status', options: ['In Stock', 'Low Stock', 'Out of Stock', 'Overstock'] }
        ]}
      />

      {/* Main Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h3 className="font-bold text-lg dark:text-white whitespace-nowrap">{t('inventoryManagement')}</h3>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alert Threshold:</span>
              <input 
                type="number" 
                value={threshold} 
                onChange={(e) => onThresholdChange(parseInt(e.target.value) || 0)}
                className="w-12 bg-transparent text-sm font-bold text-blue-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 font-medium">days</span>
            </div>
            <div className="flex items-center gap-2">
            <button 
              onClick={() => console.log("Calendar View", "Opening inventory schedule and delivery timeline.")}
              className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Calendar size={18} />
            </button>
            <button 
              onClick={() => {
                setIsEditMode(false);
                setFormData({ name: '', initialStock: '', reorderPoint: '', reorderQuantity: '' });
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              Add New Item
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('topProduct')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('currentStock')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('daysOfSupply')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('reorderPoint')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('inventoryStatus')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold dark:text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: {item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold dark:text-slate-200">{item.currentStock}</span>
                      <span className="text-[10px] text-slate-400">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-bold",
                        item.daysOfSupply < 15 ? "text-rose-600" : "text-emerald-600"
                      )}>
                        {item.daysOfSupply}
                      </span>
                      <span className="text-[10px] text-slate-400">days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold dark:text-slate-200">{item.reorderPoint}</span>
                      <TrendingDown size={12} className="text-slate-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                      getStatusColor(item.status)
                    )}>
                      {getStatusIcon(item.status)}
                      {t(item.status.toLowerCase().replace(/\s/g, ''))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditMode(true);
                          setFormData({
                            name: item.name,
                            initialStock: item.currentStock.toString(),
                            reorderPoint: item.reorderPoint.toString(),
                            reorderQuantity: item.reorderQuantity.toString()
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Edit Item"
                      >
                        <RefreshCw size={16} className="rotate-90" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {(item.status === 'Low Stock' || item.status === 'Out of Stock') && (
                        <button 
                          onClick={() => {
                            setReorderItem(item);
                            setIsReorderModalOpen(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all"
                          title="Reorder Item"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setDeleteItem(item);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictive Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-blue-400" size={24} />
            <h3 className="font-bold text-lg">{t('predictedStockout')}</h3>
          </div>
          <div className="space-y-4">
            {inventory.filter(item => item.daysOfSupply < threshold).map(item => (
              <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">{item.name}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    item.daysOfSupply < 5 ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {item.daysOfSupply < 5 ? 'Critical' : 'Moderate'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Stock is predicted to deplete in <span className="text-white font-bold">{item.daysOfSupply} days</span>. 
                  Threshold is <span className="text-blue-400 font-bold">{threshold} days</span>.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button 
                    onClick={() => console.log(`Order Initiated for ${item.name}`, "Purchase order has been sent to the supplier.")}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all"
                  >
                    Order Now
                  </button>
                  <button 
                    onClick={() => console.log(`Forecasting ${item.name}`, "Generating 90-day demand prediction model.")}
                    className="px-4 py-1.5 bg-white/10 text-white rounded-lg text-[10px] font-bold hover:bg-white/20 transition-all"
                  >
                    View Forecast
                  </button>
                </div>
              </div>
            ))}
            {inventory.filter(item => item.daysOfSupply < threshold).length === 0 && (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={24} />
                <p className="text-sm text-slate-400">No immediate stockout risks detected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="text-emerald-600" size={24} />
            <h3 className="font-bold text-lg dark:text-white">{t('suggestedReorder')}</h3>
          </div>
          <div className="space-y-6">
            {inventory.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div>
                  <p className="text-sm font-bold dark:text-white">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Optimal Quantity: {item.reorderQuantity} units</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">ROI Impact: +{Math.floor(Math.random() * 10) + 5}%</p>
                  <p className="text-[10px] text-slate-400">Minimizes stockout cost</p>
                </div>
              </div>
            ))}
            <button 
              onClick={() => console.log("All Suggestions Approved", "8 purchase orders have been queued for processing.")}
              className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Approve All Suggestions
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Lipitor 20mg"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                    <input
                      required
                      type="number"
                      name="initialStock"
                      value={formData.initialStock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reorder Point</label>
                    <input
                      required
                      type="number"
                      name="reorderPoint"
                      value={formData.reorderPoint}
                      onChange={handleInputChange}
                      placeholder="100"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reorder Quantity</label>
                  <input
                    required
                    type="number"
                    name="reorderQuantity"
                    value={formData.reorderQuantity}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    {isEditMode ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <Info className="text-blue-600" size={20} />
                  Item Details
                </h3>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
                {/* Section 1: Current Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Package size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Current Status</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold dark:text-white">{selectedItem.name}</p>
                        <p className="text-xs text-slate-500">ID: {selectedItem.id}</p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border",
                        getStatusColor(selectedItem.status)
                      )}>
                        {selectedItem.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Layers size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">In Stock</span>
                        </div>
                        <p className="text-sm font-bold dark:text-white">{selectedItem.currentStock} units</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Supply</span>
                        </div>
                        <p className={cn(
                          "text-sm font-bold",
                          selectedItem.daysOfSupply < 15 ? "text-rose-600" : "text-emerald-600"
                        )}>{selectedItem.daysOfSupply} days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Forecasting Data */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <BarChart3 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Forecasting Data</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <TrendingUp size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Forecast Demand</span>
                      </div>
                      <p className="text-sm font-bold dark:text-white">{selectedItem.forecastedDemand} units</p>
                      <p className="text-[9px] text-slate-500 mt-1">Next 30 days</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Last Restock</span>
                      </div>
                      <p className="text-sm font-bold dark:text-white">{selectedItem.lastRestockDate}</p>
                      <p className="text-[9px] text-slate-500 mt-1">Completion date</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Reorder Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <RefreshCw size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Reorder Information</span>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <Target size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Reorder Point</span>
                        </div>
                        <p className="text-sm font-bold dark:text-blue-700 dark:text-blue-300">{selectedItem.reorderPoint} units</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <RefreshCw size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Order Qty</span>
                        </div>
                        <p className="text-sm font-bold dark:text-blue-700 dark:text-blue-300">{selectedItem.reorderQuantity} units</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/30 flex items-start gap-2">
                      <Info size={12} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 leading-relaxed">
                        AI recommends reordering <span className="font-bold">{selectedItem.reorderQuantity} units</span> when stock hits <span className="font-bold">{selectedItem.reorderPoint}</span> to maintain optimal service levels.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reorder Confirmation Modal */}
      <AnimatePresence>
        {isReorderModalOpen && reorderItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10">
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <RefreshCw className="text-amber-600" size={20} />
                  Confirm Reorder
                </h3>
                <button 
                  onClick={() => setIsReorderModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Approve Reorder for {reorderItem.name}?</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-1 leading-relaxed">
                      This will initiate a purchase order for the suggested quantity of <span className="font-bold">{reorderItem.reorderQuantity} units</span>.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Stock</span>
                    <span className="font-bold dark:text-white">{reorderItem.currentStock} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Suggested Order</span>
                    <span className="font-bold text-blue-600">+{reorderItem.reorderQuantity} units</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
                    <span className="font-bold dark:text-white">Projected Stock</span>
                    <span className="font-bold text-emerald-600">{reorderItem.currentStock + reorderItem.reorderQuantity} units</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsReorderModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReorder}
                    className="flex-1 py-3 bg-amber-600 text-white font-bold text-sm rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-900/20"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && deleteItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-900/10">
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <Trash2 className="text-rose-600" size={20} />
                  Confirm Deletion
                </h3>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                  <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-rose-900 dark:text-rose-200">Delete {deleteItem.name}?</p>
                    <p className="text-xs text-rose-700 dark:text-rose-400/80 mt-1 leading-relaxed">
                      This action cannot be undone. All data associated with this inventory item will be permanently removed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold text-sm rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagementView;
