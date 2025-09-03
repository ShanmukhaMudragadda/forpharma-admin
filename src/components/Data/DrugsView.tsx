import React, { useState } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, ArrowLeft, Save, X, Building2, AlertTriangle, Pill, DollarSign, Shield
} from 'lucide-react';

// Types
export interface Drug {
  id: string;
  name: string;
  composition: string;
  manufacturer: string;
  indications: string;
  side_effects: string;
  safety_advice: string;
  dosage_forms: string;
  price: number;
  schedule: string;
  regulatory_approvals: string;
  category: string;
  type: string;
  is_available: boolean;
  images?: string[];
  marketing_materials?: string[];
  createdAt: string;
}

// Form Card Component
const FormCard = ({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) => {
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
const InputField = ({ label, icon: Icon, error, required, className = "", ...props }: { label: string; icon?: React.ComponentType<{ className?: string }>; error?: string; required?: boolean; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
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
          className={`w-full ${Icon ? 'pl-7' : 'pl-2'} pr-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-surface ${
            error ? 'border-error focus:ring-error' : ''
          }`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, drugName }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; drugName?: string }) => {
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
            <h3 className="text-sm font-semibold text-text-primary font-heading">Delete Drug</h3>
            <p className="text-xs text-text-secondary">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Are you sure you want to delete <strong>{drugName}</strong>?
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
const DrugsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const drugs = [
    {
      id: '1', name: 'Paracetamol 500mg', composition: 'Paracetamol 500mg', manufacturer: 'ABC Pharmaceuticals',
      indications: 'Pain relief, fever reduction', side_effects: 'Nausea, skin rash', safety_advice: 'Take with food',
      dosage_forms: 'Tablet', price: 25.50, schedule: 'OTC', regulatory_approvals: 'FDA Approved',
      category: 'Analgesics', type: 'tablet', is_available: true, createdAt: '2024-01-15'
    },
    {
      id: '2', name: 'Amoxicillin Syrup', composition: 'Amoxicillin 125mg/5ml', manufacturer: 'XYZ Pharma',
      indications: 'Bacterial infections', side_effects: 'Diarrhea, allergic reactions', safety_advice: 'Complete full course',
      dosage_forms: 'Oral Suspension', price: 45.00, schedule: 'Prescription', regulatory_approvals: 'FDA Approved',
      category: 'Antibiotics', type: 'syrup', is_available: true, createdAt: '2024-01-12'
    },
    {
      id: '3', name: 'Insulin Injection', composition: 'Human Insulin 100IU/ml', manufacturer: 'Diabetes Care Ltd',
      indications: 'Diabetes mellitus', side_effects: 'Hypoglycemia, injection site reactions', safety_advice: 'Store in refrigerator',
      dosage_forms: 'Pre-filled pen', price: 850.00, schedule: 'Prescription', regulatory_approvals: 'FDA Approved',
      category: 'Antidiabetic', type: 'injection', is_available: false, createdAt: '2024-01-10'
    },
  ];

  const drugTypes = [
    'tablet', 'capsule', 'syrup', 'injection', 'syringe', 'ointment', 'cream', 'drops', 'inhaler', 'patch'
  ];

  const drugCategories = [
    'Analgesics', 'Antibiotics', 'Antidiabetic', 'Cardiovascular', 'Respiratory', 'Gastrointestinal',
    'Neurological', 'Dermatological', 'Ophthalmological', 'Vitamins & Supplements'
  ];

  const schedules = ['OTC', 'Prescription', 'Schedule H', 'Schedule H1', 'Schedule X'];

  const [drugsList] = useState<Drug[]>(drugs);

  // Form state

  // Type the form state properly
  type DrugFormState = {
    name: string;
    composition: string;
    manufacturer: string;
    indications: string;
    side_effects: string;
    safety_advice: string;
    dosage_forms: string;
    price: string;
    schedule: string;
    regulatory_approvals: string;
    category: string;
    type: string;
    is_available: boolean;
    images: string;
    marketing_materials: string;
  };

  const [drugForm, setDrugForm] = useState<DrugFormState>({
    name: '',
    composition: '',
    manufacturer: '',
    indications: '',
    side_effects: '',
    safety_advice: '',
    dosage_forms: '',
    price: '',
    schedule: 'OTC',
    regulatory_approvals: '',
    category: '',
    type: 'tablet',
    is_available: true,
    images: '',
    marketing_materials: ''
  });
  const filteredDrugs = drugsList.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setDrugForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // CRUD operations
  const handleCreateDrug = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating drug...', drugForm);
      // const response = await adminService.createDrug(drugForm);
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating drug:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDrug = async () => {
    setIsSubmitting(true);
    try {
      console.log('Updating drug...', selectedDrug?.id, drugForm);
      // await adminService.updateDrug(selectedDrug?.id, drugForm);
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating drug:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDrug = async () => {
    try {
      console.log('Deleting drug...', selectedDrug?.id);
      // await adminService.deleteDrug(selectedDrug?.id);
      setShowDeleteModal(false);
      setSelectedDrug(null);
    } catch (error) {
      console.error('Error deleting drug:', error);
    }
  };

  const resetForm = () => {
    setDrugForm({
      name: '', composition: '', manufacturer: '', indications: '', side_effects: '',
      safety_advice: '', dosage_forms: '', price: '', schedule: 'OTC', regulatory_approvals: '',
      category: '', type: 'tablet', is_available: true, images: '', marketing_materials: ''
    });
  };

  const openEditModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setDrugForm({
      name: drug.name, composition: drug.composition, manufacturer: drug.manufacturer,
      indications: drug.indications, side_effects: drug.side_effects, safety_advice: drug.safety_advice,
      dosage_forms: drug.dosage_forms, price: drug.price?.toString() || '', schedule: drug.schedule,
      regulatory_approvals: drug.regulatory_approvals, category: drug.category, type: drug.type,
      is_available: drug.is_available, images: drug.images?.join(', ') || '',
      marketing_materials: drug.marketing_materials?.join(', ') || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowViewModal(true);
  };

  const openDeleteModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowDeleteModal(true);
  };

  const isFormValid = () => {
    return drugForm.name && drugForm.composition && drugForm.manufacturer && 
           drugForm.category && drugForm.type && drugForm.price;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-text-primary font-heading">Drugs Management</h1>
              <p className="text-xs text-text-secondary mt-1">Manage pharmaceutical products and drug information</p>
            </div>
            <button 
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }} 
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Drug</span>
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
                placeholder="Search drugs by name, manufacturer, or category..."
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

        {/* Drugs Table */}
        <div className="bg-surface rounded-lg shadow-sf border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Drug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDrugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-background-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <Pill className="w-4 h-4 text-secondary-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-text-primary font-heading">{drug.name}</div>
                          <div className="text-xs text-text-secondary">{drug.manufacturer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
                        {drug.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">{drug.category}</td>
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-text-tertiary" />
                        {drug.price?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        drug.is_available 
                          ? 'bg-success/20 text-success' 
                          : 'bg-error/20 text-error'
                      }`}>
                        {drug.is_available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => openViewModal(drug)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(drug)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(drug)}
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

        {/* Create/Edit Drug Sliding Panel */}
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
                        {showEditModal ? 'Edit Drug' : 'Create New Drug'}
                      </h2>
                      <p className="text-xs text-text-secondary">
                        {showEditModal ? 'Update drug information' : 'Add a new drug to the system'}
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
                  <FormCard title="Basic Information" subtitle="Essential drug details and identification">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Drug Name"
                        icon={Pill}
                        name="name"
                        value={drugForm.name}
                        onChange={handleFormChange}
                        placeholder="Enter drug name"
                        required
                        className="md:col-span-2"
                      />
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Type <span className="text-error">*</span>
                        </label>
                        <select
                          name="type"
                          value={drugForm.type}
                          onChange={handleFormChange}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                        >
                          {drugTypes.map(type => (
                            <option key={type} value={type} className="capitalize">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Category <span className="text-error">*</span>
                        </label>
                        <select
                          name="category"
                          value={drugForm.category}
                          onChange={handleFormChange}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                        >
                          <option value="">Select category</option>
                          {drugCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <InputField
                        label="Manufacturer"
                        icon={Building2}
                        name="manufacturer"
                        value={drugForm.manufacturer}
                        onChange={handleFormChange}
                        placeholder="Enter manufacturer name"
                        required
                      />
                      <InputField
                        label="Price"
                        icon={DollarSign}
                        type="number"
                        step="0.01"
                        name="price"
                        value={drugForm.price}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </FormCard>

                  {/* Composition & Medical Information */}
                  <FormCard title="Medical Information" subtitle="Composition, indications, and clinical details">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Composition <span className="text-error">*</span>
                        </label>
                        <textarea
                          name="composition"
                          value={drugForm.composition}
                          onChange={handleFormChange}
                          rows={2}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                          placeholder="Enter drug composition and active ingredients"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Indications
                        </label>
                        <textarea
                          name="indications"
                          value={drugForm.indications}
                          onChange={handleFormChange}
                          rows={3}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                          placeholder="Enter medical conditions and uses"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                            Side Effects
                          </label>
                          <textarea
                            name="side_effects"
                            value={drugForm.side_effects}
                            onChange={handleFormChange}
                            rows={3}
                            className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                            placeholder="Enter potential side effects"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                            Safety Advice
                          </label>
                          <textarea
                            name="safety_advice"
                            value={drugForm.safety_advice}
                            onChange={handleFormChange}
                            rows={3}
                            className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                            placeholder="Enter safety recommendations"
                          />
                        </div>
                      </div>
                    </div>
                  </FormCard>

                  {/* Regulatory & Availability */}
                  <FormCard title="Regulatory & Availability" subtitle="Regulatory information and availability status">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Dosage Forms"
                        name="dosage_forms"
                        value={drugForm.dosage_forms}
                        onChange={handleFormChange}
                        placeholder="e.g., 10mg tablets, 5ml syrup"
                      />
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Schedule
                        </label>
                        <select
                          name="schedule"
                          value={drugForm.schedule}
                          onChange={handleFormChange}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                        >
                          {schedules.map(schedule => (
                            <option key={schedule} value={schedule}>{schedule}</option>
                          ))}
                        </select>
                      </div>
                      <InputField
                        label="Regulatory Approvals"
                        icon={Shield}
                        name="regulatory_approvals"
                        value={drugForm.regulatory_approvals}
                        onChange={handleFormChange}
                        placeholder="e.g., FDA Approved, CDSCO Approved"
                        className="md:col-span-2"
                      />
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_available"
                            checked={drugForm.is_available}
                            onChange={handleFormChange}
                            className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                            id="is_available"
                          />
                          <label htmlFor="is_available" className="ml-2 text-xs text-text-primary font-heading">
                            Drug is available for prescription/purchase
                          </label>
                        </div>
                      </div>
                    </div>
                  </FormCard>

                  {/* Images & Marketing Materials */}
                  <FormCard title="Media & Marketing" subtitle="Images and marketing materials (URLs separated by commas)">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Product Images
                        </label>
                        <textarea
                          name="images"
                          value={drugForm.images}
                          onChange={handleFormChange}
                          rows={2}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                          placeholder="Enter image URLs separated by commas"
                        />
                        <p className="text-xs text-text-tertiary mt-1">Example: https://example.com/image1.jpg, https://example.com/image2.jpg</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Marketing Materials
                        </label>
                        <textarea
                          name="marketing_materials"
                          value={drugForm.marketing_materials}
                          onChange={handleFormChange}
                          rows={2}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                          placeholder="Enter marketing material URLs separated by commas"
                        />
                        <p className="text-xs text-text-tertiary mt-1">Example: https://example.com/brochure.pdf, https://example.com/leaflet.pdf</p>
                      </div>
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
                    onClick={showEditModal ? handleEditDrug : handleCreateDrug}
                    disabled={!isFormValid() || isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-success text-surface hover:bg-success/90 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    <span>{isSubmitting ? 'Saving...' : showEditModal ? 'Update Drug' : 'Create Drug'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Drug Modal */}
        {showViewModal && selectedDrug && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setShowViewModal(false)} />
            <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-background shadow-sf-lg overflow-y-auto">
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
                      <h2 className="text-lg font-bold text-text-primary font-heading">View Drug</h2>
                      <p className="text-xs text-text-secondary">Complete drug information and details</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowViewModal(false)} 
                    className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  <FormCard title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Drug Name</label>
                        <div className="text-sm font-medium text-text-primary">{selectedDrug.name}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Type</label>
                        <div className="text-sm text-text-primary">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
                            {selectedDrug.type}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Category</label>
                        <div className="text-sm text-text-primary">{selectedDrug.category}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Manufacturer</label>
                        <div className="text-sm text-text-primary">{selectedDrug.manufacturer}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Price</label>
                        <div className="text-sm font-medium text-text-primary">
                          ${selectedDrug.price?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Schedule</label>
                        <div className="text-sm text-text-primary">{selectedDrug.schedule}</div>
                      </div>
                    </div>
                  </FormCard>

                  <FormCard title="Medical Information">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Composition</label>
                        <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border">
                          {selectedDrug.composition}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Indications</label>
                        <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border">
                          {selectedDrug.indications}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Side Effects</label>
                          <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border">
                            {selectedDrug.side_effects}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Safety Advice</label>
                          <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border">
                            {selectedDrug.safety_advice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormCard>

                  <FormCard title="Regulatory & Availability">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Dosage Forms</label>
                        <div className="text-sm text-text-primary">{selectedDrug.dosage_forms}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Regulatory Approvals</label>
                        <div className="text-sm text-text-primary">{selectedDrug.regulatory_approvals}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Availability</label>
                        <div className="text-sm text-text-primary">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedDrug.is_available ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                          }`}>
                            {selectedDrug.is_available ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Created Date</label>
                        <div className="text-sm text-text-primary">
                          {new Date(selectedDrug.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </FormCard>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border bg-surface rounded-lg p-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Close
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowViewModal(false);
                        openEditModal(selectedDrug);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Drug</span>
                    </button>
                  </div>
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
            setSelectedDrug(null);
          }} 
          onConfirm={handleDeleteDrug} 
          drugName={selectedDrug?.name} 
        />
      </div>
    </div>
  );
};

export default DrugsView;