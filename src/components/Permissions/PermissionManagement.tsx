import React, { useState } from 'react';
import { Plus, Search, Key, Shield, Edit, Trash2, Filter } from 'lucide-react';
import { Permission } from '../../types/auth';

const PermissionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResource, setFilterResource] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Mock permissions data
  const [permissions, setPermissions] = useState<Permission[]>([
    // Data-level permissions
    { id: '1', name: 'View Doctors', resource: 'doctors', action: 'read', description: 'View doctor information and profiles', category: 'data' },
    { id: '2', name: 'Create Doctors', resource: 'doctors', action: 'create', description: 'Add new doctors to the system', category: 'data' },
    { id: '3', name: 'Edit Doctors', resource: 'doctors', action: 'update', description: 'Modify existing doctor information', category: 'data' },
    { id: '4', name: 'Delete Doctors', resource: 'doctors', action: 'delete', description: 'Remove doctors from the system', category: 'data' },
    
    { id: '5', name: 'View Chemists', resource: 'chemists', action: 'read', description: 'View chemist and pharmacy information', category: 'data' },
    { id: '6', name: 'Create Chemists', resource: 'chemists', action: 'create', description: 'Add new chemists to the system', category: 'data' },
    { id: '7', name: 'Edit Chemists', resource: 'chemists', action: 'update', description: 'Modify existing chemist information', category: 'data' },
    { id: '8', name: 'Delete Chemists', resource: 'chemists', action: 'delete', description: 'Remove chemists from the system', category: 'data' },
    
    { id: '9', name: 'View Hospitals', resource: 'hospitals', action: 'read', description: 'View hospital information and details', category: 'data' },
    { id: '10', name: 'Create Hospitals', resource: 'hospitals', action: 'create', description: 'Add new hospitals to the system', category: 'data' },
    { id: '11', name: 'Edit Hospitals', resource: 'hospitals', action: 'update', description: 'Modify existing hospital information', category: 'data' },
    { id: '12', name: 'Delete Hospitals', resource: 'hospitals', action: 'delete', description: 'Remove hospitals from the system', category: 'data' },
    
    { id: '13', name: 'View Territories', resource: 'territories', action: 'read', description: 'View territory information and boundaries', category: 'data' },
    { id: '14', name: 'Create Territories', resource: 'territories', action: 'create', description: 'Add new territories to the system', category: 'data' },
    { id: '15', name: 'Edit Territories', resource: 'territories', action: 'update', description: 'Modify existing territory information', category: 'data' },
    { id: '16', name: 'Delete Territories', resource: 'territories', action: 'delete', description: 'Remove territories from the system', category: 'data' },
    
    // System-level permissions
    { id: '17', name: 'Manage Users', resource: 'users', action: 'manage', description: 'Full user management access', category: 'system' },
    { id: '18', name: 'Manage Roles', resource: 'roles', action: 'manage', description: 'Full role management access', category: 'system' },
    { id: '19', name: 'System Settings', resource: 'system', action: 'configure', description: 'Access to system configuration', category: 'system' },
  ]);

  const resources = ['all', 'doctors', 'chemists', 'hospitals', 'territories', 'users', 'roles', 'system'];
  
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResource = filterResource === 'all' || permission.resource === filterResource;
    return matchesSearch && matchesResource;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-success/10 text-success';
      case 'read': return 'bg-primary/10 text-primary-600';
      case 'update': return 'bg-warning/10 text-warning';
      case 'delete': return 'bg-error/10 text-error';
      case 'manage': return 'bg-secondary/10 text-secondary-600';
      case 'configure': return 'bg-purple-100 text-purple-600';
      case 'export': return 'bg-teal-100 text-teal-600';
      case 'import': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-text-primary mb-2">Permissions</h1>
              <p className="text-text-secondary text-sm">Define and manage data-level and system permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-md transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Permission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {resources.map(resource => (
                <option key={resource} value={resource}>
                  {resource === 'all' ? 'All Resources' : resource.charAt(0).toUpperCase() + resource.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-background-secondary transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center mr-4">
                        <Key className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {permission.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-secondary-100 text-secondary-800 rounded-md capitalize">
                      {permission.resource}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${getActionColor(permission.action)}`}>
                      {permission.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${
                      permission.category === 'data' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'
                    }`}>
                      {permission.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary max-w-sm">
                      {permission.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="p-2 hover:bg-primary-50 text-primary-600 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-error/10 text-error rounded-md transition-colors">
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

      {/* Create Permission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-sf-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Create New Permission
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Permission Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter permission name"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Resource
                  </label>
                  <select className="w-full px-3 py-2 bg-background-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    <option>doctors</option>
                    <option>chemists</option>
                    <option>hospitals</option>
                    <option>territories</option>
                    <option>users</option>
                    <option>roles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Action
                  </label>
                  <select className="w-full px-3 py-2 bg-background-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    <option>create</option>
                    <option>read</option>
                    <option>update</option>
                    <option>delete</option>
                    <option>manage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 bg-background-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    <option>data</option>
                    <option>system</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe this permission..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-sm text-sm"
                >
                  Create Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;