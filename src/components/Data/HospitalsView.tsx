import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Mail, MapPin,
  ArrowLeft, Save, X, Building2, AlertTriangle, Globe, Phone
} from 'lucide-react';
import { AdminService } from '../../services/admin.services';
import { useAuth } from '../../hooks/useAuth';

// Types
export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  website?: string;
  description?: string;
  phone?: string;
  type?: string;
  territory?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}
// Form Card Component
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

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  className?: string;
}
// Input Component
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

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hospitalName?: string;
}
// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, hospitalName }: DeleteConfirmModalProps) => {
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
            <h3 className="text-sm font-semibold text-text-primary font-heading">Delete Hospital</h3>
            <p className="text-xs text-text-secondary">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Are you sure you want to delete <strong>{hospitalName}</strong>?
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
const HospitalsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(useAuth().token);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

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
  // const hospitals: Hospital[] = [
  //   {
  //     id: '1', name: 'City General Hospital', address: '789 Hospital Rd, Medical District',
  //     city: 'City Center', state: 'CA', pincode: '90210', email: 'info@citygeneral.com',
  //     website: 'https://citygeneral.com', phone: '+1-234-567-8905',
  //     description: 'Full-service general hospital with emergency care', type: 'General',
  //     territory: 'North District', status: 'active', createdAt: '2024-01-05'
  //   },
  //   {
  //     id: '2', name: 'Specialty Care Center', address: '321 Care Blvd, Health Plaza',
  //     city: 'Downtown', state: 'CA', pincode: '90211', email: 'contact@specialtycare.com',
  //     website: 'https://specialtycare.com', phone: '+1-234-567-8906',
  //     description: 'Specialized medical treatments and procedures', type: 'Specialty',
  //     territory: 'West District', status: 'active', createdAt: '2024-01-12'
  //   },
  //   {
  //     id: '3', name: 'Children\'s Medical Center', address: '456 Kids Ave, Family District',
  //     city: 'Westside', state: 'CA', pincode: '90212', email: 'info@childrenmedical.com',
  //     website: 'https://childrenmedical.com', phone: '+1-234-567-8907',
  //     description: 'Pediatric care and child health services', type: 'Pediatric',
  //     territory: 'South District', status: 'inactive', createdAt: '2024-01-08'
  //   },
  // ];


  useEffect(() => {
    // Fetch hospitals from API or perform any necessary data fetching  

    fetchHospitals();
  }, [token]);


  const fetchHospitals = async () => {
      try {
        const adminService = new AdminService();
        const response = await adminService.fetchHospitals(token || '');
        const data = await response.data;
        console.log('Fetched hospitals:', data);
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

  // Form state
  const [hospitalForm, setHospitalForm] = useState<Record<string, string>>({
    name: '', address: '', city: '', state: '', pincode: '',
    email: '', website: '', description: ''
  });

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHospitalForm(prev => ({ ...prev, [name]: value }));
  };

  // CRUD operations
  const handleCreateHospital = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating hospital...', hospitalForm);
      const adminService = new AdminService();
      const response = await adminService.createHospital(hospitalForm, token || '');
      console.log('Hospital created successfully:', response);
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating hospital:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHospital = async () => {
    setIsSubmitting(true);
    try {
      console.log('Updating hospital...', selectedHospital?.id, hospitalForm);
      // await adminService.updateHospital(selectedHospital?.id, hospitalForm);
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating hospital:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHospital = async () => {
    try {
      console.log('Deleting hospital...', selectedHospital?.id);
      // await adminService.deleteHospital(selectedHospital?.id);
      setShowDeleteModal(false);
      setSelectedHospital(null);
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  const resetForm = () => {
    setHospitalForm({
      name: '', address: '', city: '', state: '', pincode: '',
      email: '', website: '', description: ''
    });
  };

  const openEditModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setHospitalForm({
      name: hospital.name, address: hospital.address, city: hospital.city,
      state: hospital.state, pincode: hospital.pincode, email: hospital.email,
      website: hospital.website || '', description: hospital.description || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowViewModal(true);
  };

  const openDeleteModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowDeleteModal(true);
  };

  const isFormValid = () => {
    return hospitalForm.name && hospitalForm.address && hospitalForm.city &&
      hospitalForm.state && hospitalForm.pincode && hospitalForm.email;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-text-primary font-heading">Hospitals Management</h1>
              <p className="text-xs text-text-secondary mt-1">Manage hospital and healthcare facility records</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors shadow-sf"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hospital</span>
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
                placeholder="Search hospitals by name, type, or city..."
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

        {/* Hospitals Table */}
        <div className="bg-surface rounded-lg shadow-sf border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Hospital</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-background-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-text-primary font-heading">{hospital.name}</div>
                          <div className="text-xs text-text-secondary flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {hospital.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        {hospital.type || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      <div className="flex items-start">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{hospital.city}, {hospital.state}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${hospital.status === 'active'
                        ? 'bg-success/20 text-success'
                        : 'bg-error/20 text-error'
                        }`}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openViewModal(hospital)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(hospital)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(hospital)}
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
          </div>
        </div>

        {/* Create/Edit Hospital Sliding Panel */}
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
                        {showEditModal ? 'Edit Hospital' : 'Create New Hospital'}
                      </h2>
                      <p className="text-xs text-text-secondary">
                        {showEditModal ? 'Update hospital information' : 'Add a new hospital to the system'}
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
                  <FormCard title="Hospital Information" subtitle="Enter hospital's basic details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Hospital Name"
                        icon={Building2}
                        name="name"
                        value={hospitalForm.name}
                        onChange={handleFormChange}
                        placeholder="Enter hospital name"
                        required
                        className="md:col-span-1"
                      />
                      <InputField
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        name="email"
                        value={hospitalForm.email}
                        onChange={handleFormChange}
                        placeholder="hospital@example.com"
                        required
                      />
                      <InputField
                        label="Website"
                        icon={Globe}
                        type="url"
                        name="website"
                        value={hospitalForm.website}
                        onChange={handleFormChange}
                        placeholder="https://hospital.com"
                      />
                      <InputField
                        label="Phone Number"
                        icon={Phone}
                        name="phone"
                        value={hospitalForm.phone}
                        onChange={handleFormChange}
                        placeholder="+91"
                        required
                      />
                    </div>
                  </FormCard>

                  {/* Location Information */}
                  <FormCard title="Location Details" subtitle="Hospital address and location information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Address"
                        icon={MapPin}
                        name="address"
                        value={hospitalForm.address}
                        onChange={handleFormChange}
                        placeholder="Street address"
                        required
                        className="md:col-span-2"
                      />
                      <InputField
                        label="City"
                        name="city"
                        value={hospitalForm.city}
                        onChange={handleFormChange}
                        placeholder="City name"
                        required
                      />
                      <InputField
                        label="State"
                        name="state"
                        value={hospitalForm.state}
                        onChange={handleFormChange}
                        placeholder="State name"
                        required
                      />
                      <InputField
                        label="Pincode"
                        name="pincode"
                        value={hospitalForm.pincode}
                        onChange={handleFormChange}
                        placeholder="Pin code"
                        required
                      />
                    </div>
                  </FormCard>

                  {/* Additional Information */}
                  <FormCard title="Additional Information" subtitle="Optional hospital details">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={hospitalForm.description}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                        placeholder="Brief description about the hospital and services offered"
                      />
                    </div>
                  </FormCard>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border bg-surface rounded-lg p-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={showEditModal ? handleEditHospital : handleCreateHospital}
                    disabled={!isFormValid() || isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-success text-surface hover:bg-success/90 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    <span>{isSubmitting ? 'Saving...' : showEditModal ? 'Update Hospital' : 'Create Hospital'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Hospital Modal */}
        {showViewModal && selectedHospital && (
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
                      <h2 className="text-lg font-bold text-text-primary font-heading">View Hospital</h2>
                      <p className="text-xs text-text-secondary">Hospital details and information</p>
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
                  <FormCard title="Hospital Information">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="col-span-2"><strong>Name:</strong> {selectedHospital.name}</div>
                      <div><strong>Email:</strong> {selectedHospital.email}</div>
                      <div><strong>Website:</strong> {selectedHospital.website ? (
                        <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {selectedHospital.website}
                        </a>
                      ) : 'Not provided'}</div>
                      <div><strong>Type:</strong> {selectedHospital.type || 'General'}</div>

                    </div>
                  </FormCard>

                  <FormCard title="Location">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="col-span-2"><strong>Address:</strong> {selectedHospital.address}</div>
                      <div><strong>City:</strong> {selectedHospital.city}</div>
                      <div><strong>State:</strong> {selectedHospital.state}</div>
                      <div><strong>Pincode:</strong> {selectedHospital.pincode}</div>
                      <div><strong>Territory:</strong> {selectedHospital.territory || 'Not assigned'}</div>
                    </div>
                  </FormCard>

                  <FormCard title="Additional Information">
                    <div className="space-y-2 text-sm">
                      <div><strong>Description:</strong> {selectedHospital.description || 'No description provided'}</div>
                      <div><strong>Phone:</strong> {selectedHospital.phone || 'Not provided'}</div>
                      <div><strong>Status:</strong>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedHospital.status === 'active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                          }`}>
                          {selectedHospital.status}
                        </span>
                      </div>
                      <div><strong>Created:</strong> {new Date(selectedHospital.createdAt).toLocaleDateString()}</div>
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
            setSelectedHospital(null);
          }}
          onConfirm={handleDeleteHospital}
          hospitalName={selectedHospital?.name}
        />
      </div>
    </div>
  );
};

export default HospitalsView;