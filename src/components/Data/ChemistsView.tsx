import { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone, MapPin, Pill,
  ArrowLeft, Save, X, Clock, User, AlertTriangle,
  Camera, Map
} from 'lucide-react';
import { AdminService } from '../../services/admin.services';
import { useAuth } from '../../hooks/useAuth';
// Types
export interface Chemist {
  id: string;
  name: string;
  type: 'chemist' | 'stockist';
  chemistChainId: string;
  territoryId: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description?: string;
  profilePictureUrl?: string;
  visitingHours?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// Form Card Component
interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}
const FormCard = ({ title, subtitle, children, className = "" }: FormCardProps) => {
  return (
    <div className={`bg-surface rounded-lg shadow-sf border border-border ${className}`}>
      {title && (
        <div className="px-4 py-3 bg-background-tertiary border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary font-heading">{title}</h3>
          {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// Input Component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  className?: string;
}
const InputField = ({ label, icon: Icon, error, required, className = "", ...props }: InputFieldProps) => {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-text-tertiary" />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-7' : 'pl-2'} pr-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-surface ${error ? 'border-error focus:ring-error' : ''
            }`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chemistName?: string;
}
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, chemistName }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={onClose} />
      <div className="relative bg-surface rounded-lg shadow-sf-lg p-4 max-w-sm mx-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary font-heading">Delete Chemist</h3>
            <p className="text-xs text-text-secondary">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Are you sure you want to delete <strong>{chemistName}</strong>?
        </p>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-xs font-medium text-text-secondary bg-secondary-100 hover:bg-secondary-200 rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2 text-xs font-medium text-surface bg-error hover:bg-error/90 rounded-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ChemistsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChemist, setSelectedChemist] = useState<Chemist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculatingLocation, setIsCalculatingLocation] = useState(false);
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [token, setToken] = useState<string | null>(useAuth().token);

  useEffect(() => {
    if (showCreateModal || showEditModal || showViewModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCreateModal, showEditModal, showViewModal, showDeleteModal]);

  // Mock data
  // const chemists: Chemist[] = [
  //   {
  //     id: '1', name: 'Michael Brown', type: 'chemist', chemistChainId: '', territoryId: 't1',
  //     shopName: 'Brown\'s Pharmacy', email: 'michael@brownpharmacy.com', phone: '+1-234-567-8903',
  //     address: '123 Main St', city: 'City Center', state: 'CA', pincode: '90210',
  //     latitude: 34.0522, longitude: -118.2437, description: 'Full service pharmacy',
  //     visitingHours: '9:00 AM - 9:00 PM', status: 'active', createdAt: '2024-01-10'
  //   },
  //   {
  //     id: '2', name: 'Lisa Wilson', type: 'stockist', chemistChainId: 'chain1', territoryId: 't2',
  //     shopName: 'Wilson Medical Store', email: 'lisa@wilsonmedical.com', phone: '+1-234-567-8904',
  //     address: '456 Oak Ave', city: 'Downtown', state: 'CA', pincode: '90211',
  //     latitude: 34.0522, longitude: -118.2437, description: 'Medical supplies and pharmacy',
  //     visitingHours: '8:00 AM - 10:00 PM', status: 'active', createdAt: '2024-01-25'
  //   },
  //   {
  //     id: '3', name: 'David Garcia', type: 'chemist', chemistChainId: '', territoryId: 't3',
  //     shopName: 'Garcia Pharmacy', email: 'david@garciapharmacy.com', phone: '+1-234-567-8905',
  //     address: '789 Pine St', city: 'Westside', state: 'CA', pincode: '90212',
  //     latitude: 34.0522, longitude: -118.2437, description: 'Local community pharmacy',
  //     visitingHours: '9:00 AM - 8:00 PM', status: 'inactive', createdAt: '2024-01-12'
  //   },
  // ];

  useEffect(() => {
    fetchChemists();
  }, [token]);

  const fetchChemists = async () => {
    try {
      const adminService = new AdminService();
      const response = await adminService.getChemists(token || '');
      console.log('Fetched chemists:', response.data);
      setChemists(response.data);

    }
    catch (err) {
      console.log('error in fetching chemists:', err);
    }
    setLoading(false);
  };

  const territories: { id: string; name: string }[] = [
    { id: '1', name: 'Central District' },
  ];

  // Form state
  const [chemistForm, setChemistForm] = useState<Record<string, string>>({
    name: '', type: 'CHEMIST', chemistChainId: '', territoryId: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', description: '', profilePictureUrl: '', visitingHours: ''
  });

  const filteredChemists = chemists.filter(chemist =>
    chemist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions
  const getTerritoryName = (territoryId: string) => {
    return territories.find(t => t.id === territoryId)?.name || 'Unknown';
  };


  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChemistForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle address change and auto-calculate coordinates
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormChange(e);
    // Auto-calculate when all address fields are filled
    const { name, value } = e.target;
    const updatedForm = { ...chemistForm, [name]: value };
  };

  // CRUD operations
  const handleCreateChemist = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating chemist...', chemistForm);
      const adminService = new AdminService();
      const response = await adminService.createChemist(chemistForm, token || '');
      console.log('Chemist created:', response);
      // resetForm();
      // setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating chemist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChemist = async () => {
    setIsSubmitting(true);
    try {
      console.log('Updating chemist...', selectedChemist?.id, chemistForm);
      // await adminService.updateChemist(selectedChemist.id, chemistForm);
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating chemist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChemist = async () => {
    try {
      console.log('Deleting chemist...', selectedChemist?.id);
      // await adminService.deleteChemist(selectedChemist.id);
      setShowDeleteModal(false);
      setSelectedChemist(null);
    } catch (error) {
      console.error('Error deleting chemist:', error);
    }
  };

  const resetForm = () => {
    setChemistForm({
      name: '', type: 'CHEMIST', chemistChainId: '', territoryId: '', email: '', phone: '',
      address: '', city: '', state: '', pincode: '', latitude: '', longitude: '',
      description: '', profilePictureUrl: '', visitingHours: ''
    });
  };

  const openEditModal = (chemist: Chemist) => {
    setSelectedChemist(chemist);
    setChemistForm({
      name: chemist.name, type: chemist.type, chemistChainId: chemist.chemistChainId,
      territoryId: chemist.territoryId, email: chemist.email, phone: chemist.phone,
      address: chemist.address, city: chemist.city, state: chemist.state,
      pincode: chemist.pincode, description: chemist.description || '',
      profilePictureUrl: chemist.profilePictureUrl || '', visitingHours: chemist.visitingHours || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (chemist: Chemist) => {
    setSelectedChemist(chemist);
    setShowViewModal(true);
  };

  const openDeleteModal = (chemist: Chemist) => {
    setSelectedChemist(chemist);
    setShowDeleteModal(true);
  };

  const isFormValid = () => {
    return chemistForm.name && chemistForm.email && chemistForm.phone &&
      chemistForm.address && chemistForm.city && chemistForm.territoryId;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-bold text-text-primary font-heading">Chemists Management</h1>
                  <p className="text-xs text-text-secondary mt-1">Manage chemist and pharmacy records</p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors shadow-sf"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chemist</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search chemists by name, shop, or territory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-sm hover:bg-background-secondary text-sm font-medium transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Chemists Table or Empty State */}
            <div className="bg-surface rounded-lg shadow-sf border border-border overflow-hidden">
              <div className="overflow-x-auto">
                {filteredChemists.length === 0 ? (
                  <div className="p-8 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Pill className="w-10 h-10 mb-4 text-secondary-400" />
                      <h2 className="text-lg font-semibold mb-2">No chemists present</h2>
                      <p className="text-sm mb-4">Please go ahead and create a chemist.</p>
                      <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors">
                        <Plus className="w-4 h-4 mr-2 inline" /> Add Chemist
                      </button>
                    </div>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-background-tertiary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Chemist</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Territory</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredChemists.map((chemist) => (
                        <tr key={chemist.id} className="hover:bg-background-secondary transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                                <Pill className="w-4 h-4 text-secondary-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-text-primary font-heading">{chemist.name}</div>
                                <div className="text-xs text-text-secondary flex items-center mt-1">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {chemist.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-text-secondary">
                            <div className="flex items-start">
                              <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{chemist.address}, {chemist.city}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary">
                            {getTerritoryName(chemist.territoryId)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${chemist.status === 'Active'
                              ? 'bg-success/20 text-success'
                              : 'bg-error/20 text-error'
                              }`}>
                              {chemist.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => openViewModal(chemist)}
                                className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(chemist)}
                                className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(chemist)}
                                className="p-1 hover:bg-error/10 text-error rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Create/Edit Chemist Sliding Panel */}
            {(showCreateModal || showEditModal) && (
              <div className="fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" />
                <div className="fixed right-0 top-0 h-full w-full bg-background shadow-sf-lg overflow-y-auto">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setShowCreateModal(false);
                            setShowEditModal(false);
                            resetForm();
                          }}
                          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <h2 className="text-lg font-bold text-text-primary font-heading">
                            {showEditModal ? 'Edit Chemist' : 'Create New Chemist'}
                          </h2>
                          <p className="text-xs text-text-secondary">
                            {showEditModal ? 'Update chemist information' : 'Add a new chemist to the system'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <FormCard title="Basic Information" subtitle="Enter chemist's personal and professional details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField
                            label="Chemist Name"
                            icon={User}
                            name="name"
                            value={chemistForm.name}
                            onChange={handleFormChange}
                            placeholder="Enter chemist name"
                            required={true}
                            error={''}
                          />
                          <div>
                            <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                              Type <span className="text-error">*</span>
                            </label>
                            <select
                              name="type"
                              value={chemistForm.type}
                              onChange={handleFormChange}
                              className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                            >
                              <option value="CHEMIST">Chemist</option>
                              <option value="STOCKIST">Stockist</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                              Territory <span className="text-error">*</span>
                            </label>
                            <select
                              name="territoryId"
                              value={chemistForm.territoryId}
                              onChange={handleFormChange}
                              className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                            >
                              <option value="">Select territory</option>
                              {territories.map(territory => (
                                <option key={territory.id} value={territory.id}>{territory.name}</option>
                              ))}
                            </select>
                          </div>
                          <InputField
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            name="email"
                            value={chemistForm.email}
                            onChange={handleFormChange}
                            placeholder="chemist@pharmacy.com"
                            required={true}
                            error={''}
                          />
                          <InputField
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            name="phone"
                            value={chemistForm.phone}
                            onChange={handleFormChange}
                            placeholder="+1-234-567-8900"
                            required={true}
                            error={''}
                          />
                        </div>
                      </FormCard>

                      {/* Location Information */}
                      <FormCard title="Location Information" subtitle="Address and geographical details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField
                            label="Address"
                            name="address"
                            value={chemistForm.address}
                            onChange={handleAddressChange}
                            placeholder="Street address"
                            required={true}
                            error={''}
                            className="md:col-span-2"
                          />
                          <InputField
                            label="City"
                            name="city"
                            value={chemistForm.city}
                            onChange={handleAddressChange}
                            placeholder="City name"
                            required={true}
                            error={''}
                          />
                          <InputField
                            label="State"
                            name="state"
                            value={chemistForm.state}
                            onChange={handleAddressChange}
                            placeholder="State name"
                            required={true}
                            error={''}
                          />
                          <InputField
                            label="Pincode"
                            name="pincode"
                            value={chemistForm.pincode}
                            onChange={handleAddressChange}
                            placeholder="Pin code"
                            required={true}
                            error={''}
                          />
                          <div></div>

                        </div>
                      </FormCard>

                      {/* Additional Information */}
                      <FormCard title="Additional Information" subtitle="Optional details and settings">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField
                            label="Visiting Hours"
                            icon={Clock}
                            name="visitingHours"
                            value={chemistForm.visitingHours}
                            onChange={handleFormChange}
                            placeholder="e.g., 9:00 AM - 9:00 PM"
                            required={false}
                            error={''}
                          />
                          <InputField
                            label="Profile Picture URL"
                            icon={Camera}
                            name="profilePictureUrl"
                            value={chemistForm.profilePictureUrl}
                            onChange={handleFormChange}
                            placeholder="https://example.com/photo.jpg"
                            required={false}
                            error={''}
                          />
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                              Description
                            </label>
                            <textarea
                              name="description"
                              value={chemistForm.description}
                              onChange={handleFormChange}
                              rows={3}
                              className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                              placeholder="Brief description about the chemist and pharmacy"
                            />
                          </div>
                        </div>
                      </FormCard>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 bg-surface rounded-lg p-4 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false);
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-xs bg-secondary-100 text-text-secondary hover:text-text-primary transition-colors border border-secondary-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={showEditModal ? handleEditChemist : handleCreateChemist}
                        disabled={!isFormValid() || isSubmitting}
                        className="flex items-center space-x-2 px-6 py-2 bg-success text-surface hover:bg-success/90 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        <span>{isSubmitting ? 'Saving...' : showEditModal ? 'Update Chemist' : 'Create Chemist'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Chemist Modal */}
            {showViewModal && selectedChemist && (
              <div className="fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setShowViewModal(false)} />
                <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background shadow-sf-lg overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowViewModal(false)}
                          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <h2 className="text-lg font-bold text-text-primary font-heading">View Chemist</h2>
                          <p className="text-xs text-text-secondary">Chemist details and information</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <FormCard title="Basic Information" subtitle="">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Name:</strong> {selectedChemist.name}</div>
                          <div><strong>Type:</strong> {selectedChemist.type}</div>
                          <div><strong>Territory:</strong> {getTerritoryName(selectedChemist.territoryId)}</div>
                          <div><strong>Email:</strong> {selectedChemist.email}</div>
                          <div><strong>Phone:</strong> {selectedChemist.phone}</div>
                        </div>
                      </FormCard>

                      <FormCard title="Location" subtitle="">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="col-span-2"><strong>Address:</strong> {selectedChemist.address}</div>
                          <div><strong>City:</strong> {selectedChemist.city}</div>
                          <div><strong>State:</strong> {selectedChemist.state}</div>
                          <div><strong>Pincode:</strong> {selectedChemist.pincode}</div>

                        </div>
                      </FormCard>

                      <FormCard title="Additional Information" subtitle="">
                        <div className="space-y-2 text-sm">
                          <div><strong>Visiting Hours:</strong> {selectedChemist.visitingHours || 'Not specified'}</div>
                          <div><strong>Description:</strong> {selectedChemist.description || 'No description provided'}</div>
                          <div><strong>Status:</strong>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedChemist.status === 'Active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                              }`}>
                              {selectedChemist.status}
                            </span>
                          </div>
                        </div>
                      </FormCard>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedChemist(null);
              }}
              onConfirm={handleDeleteChemist}
              chemistName={selectedChemist?.name}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default ChemistsView;