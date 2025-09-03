import React, { useState } from 'react';
import { Plus, Search, Shield, Users, Edit, Trash2, Settings } from 'lucide-react';
import { Role } from '../../types/auth';

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: [],
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Limited administrative access',
      permissions: [],
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Employee',
      description: 'Basic user access',
      permissions: [],
      createdAt: '2024-01-03'
    }
  ]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Role Management</h1>
            <p className="text-sm text-text-secondary">Create and manage user roles</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-md transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <Settings className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <Edit className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-2 hover:bg-error/10 rounded-md transition-colors duration-200">
                  <Trash2 className="w-4 h-4 text-error" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-text-primary mb-3">{role.name}</h3>
            <p className="text-text-secondary text-sm mb-6">{role.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-text-secondary">
                <Users className="w-4 h-4 mr-2" />
                <span>12 users</span>
              </div>
              <span className="text-text-secondary">
                Created {new Date(role.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Create New Role
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe this role..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Permissions
                </label>
                <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {['Create Users', 'Edit Users', 'Delete Users', 'View Users', 'Manage Roles', 'System Settings'].map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-500 mr-3" />
                      <span className="text-sm text-text-primary">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 rounded-md"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;