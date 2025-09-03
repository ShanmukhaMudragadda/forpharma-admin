import React, { useState } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Map, Stethoscope, 
  Pill, Building2, ArrowLeft, Save, X, User, AlertTriangle, Users
} from 'lucide-react';

// Types
interface Territory {
  id: string;
  name: string;
  region: string;
  manager: string;
  description?: string;
  boundaries?: string;
  population?: number;
  area?: number;
  doctorCount: number;
  chemistCount: number;
  hospitalCount: number;
  status: 'active' | 'inactive';
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
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, territoryName }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; territoryName?: string }) => {
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
            <h3 className="text-sm font-semibold text-text-primary font-heading">Delete Territory</h3>
            <p className="text-xs text-text-secondary">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Are you sure you want to delete <strong>{territoryName}</strong>?
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
const TerritoriesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const territories = [
    {
      id: '1', name: 'North District', region: 'Northern Region', manager: 'Robert Davis',
      description: 'Northern district covering urban and suburban areas',
      boundaries: '23.5°N-24.5°N, 85.3°E-86.3°E', population: 250000, area: 1200,
      doctorCount: 45, chemistCount: 23, hospitalCount: 8, status: 'active' as 'active', createdAt: '2024-01-01'
    },
    {
      id: '2', name: 'South District', region: 'Southern Region', manager: 'Emily Clark',
      description: 'Southern district with coastal regions',
      boundaries: '22.0°N-23.0°N, 85.0°E-86.0°E', population: 180000, area: 1500,
      doctorCount: 38, chemistCount: 19, hospitalCount: 6, status: 'active' as 'active', createdAt: '2024-01-01'
    },
    {
      id: '3', name: 'East District', region: 'Eastern Region', manager: 'Michael Johnson',
      description: 'Eastern district with industrial zones',
      boundaries: '23.0°N-24.0°N, 86.5°E-87.5°E', population: 220000, area: 800,
      doctorCount: 32, chemistCount: 15, hospitalCount: 5, status: 'active' as 'active', createdAt: '2024-01-01'
    },
    {
      id: '4', name: 'West District', region: 'Western Region', manager: 'Sarah Wilson',
      description: 'Western district with rural and farming communities',
      boundaries: '23.2°N-24.2°N, 84.0°E-85.0°E', population: 150000, area: 2000,
      doctorCount: 28, chemistCount: 12, hospitalCount: 4, status: 'inactive' as 'inactive', createdAt: '2024-01-01'
    }
  ];

  const [territoriesList] = useState(territories);

  // Form state
  const [territoryForm, setTerritoryForm] = useState<{
    name: string;
    region: string;
    manager: string;
    description: string;
    boundaries: string;
    population: string;
    area: string;
  }>({
    name: '', region: '', manager: '', description: '', boundaries: '',
    population: '', area: ''
  });

  const filteredTerritories = territoriesList.filter(territory =>
    territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    territory.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    territory.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTerritoryForm(prev => ({ ...prev, [name]: value }));
  };

  // CRUD operations
  const handleCreateTerritory = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating territory...', territoryForm);
      // const response = await adminService.createTerritory(territoryForm);
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating territory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTerritory = async () => {
    setIsSubmitting(true);
    try {
      if (!selectedTerritory) return;
      console.log('Updating territory...', selectedTerritory.id, territoryForm);
      // await adminService.updateTerritory(selectedTerritory.id, territoryForm);
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating territory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTerritory = async () => {
    try {
      if (!selectedTerritory) return;
      console.log('Deleting territory...', selectedTerritory.id);
      // await adminService.deleteTerritory(selectedTerritory.id);
      setShowDeleteModal(false);
      setSelectedTerritory(null);
    } catch (error) {
      console.error('Error deleting territory:', error);
    }
  };

  const resetForm = () => {
    setTerritoryForm({
      name: '', region: '', manager: '', description: '', boundaries: '',
      population: '', area: ''
    });
  };

  const openEditModal = (territory: Territory) => {
    setSelectedTerritory(territory);
    setTerritoryForm({
      name: territory.name, region: territory.region, manager: territory.manager,
      description: territory.description || '', boundaries: territory.boundaries || '',
      population: territory.population?.toString() || '', area: territory.area?.toString() || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (territory: Territory) => {
    setSelectedTerritory(territory);
    setShowViewModal(true);
  };

  const openDeleteModal = (territory: Territory) => {
    setSelectedTerritory(territory);
    setShowDeleteModal(true);
  };

  const isFormValid = () => {
    return territoryForm.name && territoryForm.region && territoryForm.manager;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-text-primary font-heading">Territories Management</h1>
              <p className="text-xs text-text-secondary mt-1">Manage geographic territories and regional coverage</p>
            </div>
            <button 
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }} 
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Territory</span>
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
                placeholder="Search territories by name, region, or manager..."
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

        {/* Territories Table */}
        <div className="bg-surface rounded-lg shadow-sf border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Territory</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Manager</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Coverage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Statistics</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTerritories.map((territory) => (
                  <tr key={territory.id} className="hover:bg-background-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <Map className="w-4 h-4 text-secondary-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-text-primary font-heading">{territory.name}</div>
                          <div className="text-xs text-text-secondary">{territory.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">{territory.manager}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      <div className="space-y-1">
                        {territory.population && (
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{(territory.population / 1000).toFixed(0)}K people</span>
                          </div>
                        )}
                        {territory.area && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{territory.area} km²</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-text-secondary space-y-1">
                        <div className="flex items-center">
                          <Stethoscope className="w-3 h-3 mr-1" />
                          <span>{territory.doctorCount} Doctors</span>
                        </div>
                        <div className="flex items-center">
                          <Pill className="w-3 h-3 mr-1" />
                          <span>{territory.chemistCount} Chemists</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          <span>{territory.hospitalCount} Hospitals</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        territory.status === 'active' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-error/20 text-error'
                      }`}>
                        {territory.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => openViewModal(territory)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(territory)}
                          className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(territory)}
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

        {/* Create/Edit Territory Sliding Panel */}
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
                        {showEditModal ? 'Edit Territory' : 'Create New Territory'}
                      </h2>
                      <p className="text-xs text-text-secondary">
                        {showEditModal ? 'Update territory information' : 'Add a new territory to the system'}
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
                  <FormCard title="Basic Information" subtitle="Enter territory's essential details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Territory Name"
                        icon={Map}
                        name="name"
                        value={territoryForm.name}
                        onChange={handleFormChange}
                        placeholder="Enter territory name"
                        required
                      />
                      <InputField
                        label="Region"
                        icon={MapPin}
                        name="region"
                        value={territoryForm.region}
                        onChange={handleFormChange}
                        placeholder="Enter region name"
                        required
                      />
                      <InputField
                        label="Territory Manager"
                        icon={User}
                        name="manager"
                        value={territoryForm.manager}
                        onChange={handleFormChange}
                        placeholder="Enter manager name"
                        required
                        className="md:col-span-2"
                      />
                    </div>
                  </FormCard>

                  {/* Geographic Details */}
                  <FormCard title="Geographic Details" subtitle="Territory boundaries and coverage information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Population"
                        icon={Users}
                        type="number"
                        name="population"
                        value={territoryForm.population}
                        onChange={handleFormChange}
                        placeholder="Enter population count"
                      />
                      <InputField
                        label="Area (km²)"
                        type="number"
                        name="area"
                        value={territoryForm.area}
                        onChange={handleFormChange}
                        placeholder="Enter area in square kilometers"
                      />
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                          Boundaries/Coordinates
                        </label>
                        <input
                          type="text"
                          name="boundaries"
                          value={territoryForm.boundaries}
                          onChange={handleFormChange}
                          className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                          placeholder="e.g., 23.5°N-24.5°N, 85.3°E-86.3°E"
                        />
                      </div>
                    </div>
                  </FormCard>

                  {/* Additional Information */}
                  <FormCard title="Additional Information" subtitle="Description and other territory details">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1 font-heading">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={territoryForm.description}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface"
                        placeholder="Brief description about the territory coverage, characteristics, and key features"
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
                    onClick={showEditModal ? handleEditTerritory : handleCreateTerritory}
                    disabled={!isFormValid() || isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-success text-surface hover:bg-success/90 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    <span>{isSubmitting ? 'Saving...' : showEditModal ? 'Update Territory' : 'Create Territory'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Territory Modal */}
        {showViewModal && selectedTerritory && (
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
                      <h2 className="text-lg font-bold text-text-primary font-heading">View Territory</h2>
                      <p className="text-xs text-text-secondary">Complete territory information and statistics</p>
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
                  <FormCard title="Territory Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Territory Name</label>
                        <div className="text-sm font-medium text-text-primary">{selectedTerritory.name}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Region</label>
                        <div className="text-sm text-text-primary">{selectedTerritory.region}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Manager</label>
                        <div className="text-sm text-text-primary">{selectedTerritory.manager}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Population</label>
                        <div className="text-sm text-text-primary">
                          {selectedTerritory.population ? `${(selectedTerritory.population / 1000).toFixed(0)}K people` : 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Area</label>
                        <div className="text-sm text-text-primary">
                          {selectedTerritory.area ? `${selectedTerritory.area} km²` : 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Status</label>
                        <div className="text-sm text-text-primary">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedTerritory.status === 'active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                          }`}>
                            {selectedTerritory.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedTerritory.boundaries && (
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Boundaries</label>
                        <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border font-mono">
                          {selectedTerritory.boundaries}
                        </div>
                      </div>
                    )}
                  </FormCard>

                  <FormCard title="Coverage Statistics">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Stethoscope className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="text-2xl font-bold text-primary-600">{selectedTerritory.doctorCount}</div>
                        <div className="text-xs text-text-secondary">Doctors</div>
                      </div>
                      <div className="text-center p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Pill className="w-6 h-6 text-secondary-600" />
                        </div>
                        <div className="text-2xl font-bold text-secondary-600">{selectedTerritory.chemistCount}</div>
                        <div className="text-xs text-text-secondary">Chemists</div>
                      </div>
                      <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-accent">{selectedTerritory.hospitalCount}</div>
                        <div className="text-xs text-text-secondary">Hospitals</div>
                      </div>
                    </div>
                  </FormCard>

                  <FormCard title="Description">
                    <div className="text-sm text-text-primary bg-background-tertiary p-4 rounded-sm border border-border">
                      {selectedTerritory.description || 'No description provided'}
                    </div>
                  </FormCard>

                  <FormCard title="Additional Information">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Created Date</label>
                        <div className="text-sm text-text-primary">
                          {new Date(selectedTerritory.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Territory ID</label>
                        <div className="text-sm text-text-primary font-mono">
                          {selectedTerritory.id}
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
                        openEditModal(selectedTerritory);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Territory</span>
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
            setSelectedTerritory(null);
          }} 
          onConfirm={handleDeleteTerritory} 
          territoryName={selectedTerritory?.name} 
        />
      </div>
    </div>
  );
};

export default TerritoriesView;