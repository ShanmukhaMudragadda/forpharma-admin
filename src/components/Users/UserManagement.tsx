import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { User } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { AdminService } from '../../services/admin.services';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { organization } = useAuth();
  type FormData = {
    organizationName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    empCode: string;
    role: string;
    dob: string;
    image: File | null;
  };

  const [formData, setFormData] = useState<FormData>({
    organizationName: organization?.name || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    empCode: '',
    role: '',
    dob: '',
    image: null,
  });

  // Mock users data
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();

  }, [organization]);

  const fetchUsers = async () => {
    const adminService = new AdminService();
    try {
      const orgId = organization?.id || '';
      console.log('Fetching users for organization:', orgId);
      const fetchedUsers = await adminService.fetchUsers(orgId);
      console.log('Fetched users:', fetchedUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (data: FormData) => {
    const adminService = new AdminService();
    const randomPassword = Math.random().toString(36).slice(-8);

    const formPayload = new FormData();
    formPayload.append("organizationName", organization?.name || '');
    formPayload.append("email", data.email);
    formPayload.append("password", randomPassword);
    formPayload.append("firstName", data.firstName);
    formPayload.append("lastName", data.lastName);
    formPayload.append("phone", data.phone);
    formPayload.append("role", data.role);
    formPayload.append("employeeCode", data.empCode);
    formPayload.append("city", data.city);
    formPayload.append("state", data.state);

    if (data.image) {
      formPayload.append("image", data.image);
    }
    console.log('Creating user...');
    console.log(formPayload);

    const result = await adminService.createUser(formPayload);

    console.log('User created:', result);

    // setShowCreateModal(false);
  };



  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="text-sm text-text-secondary mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none text-sm bg-gray-50 transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['User', 'Role', 'Status', 'Created', ''].map((heading, idx) => (
                  <th
                    key={heading}
                    className={`px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider ${idx === 4 ? 'text-right' : 'text-left'
                      }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-text-primary text-sm">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-text-secondary text-xs truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                      {user.roles}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-semibold shadow-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-text-primary">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-text-secondary text-sm truncate">
                      {user.email}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex px-2.5 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                        {user.roles}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 text-text-secondary rounded-lg transition-colors ml-2">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary text-sm">No users found</div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
              <p className="text-xs text-gray-600 mt-1">Add a new team member to your organization</p>
            </div>
            <div className="p-4">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.empCode}
                      onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                      <option>Select a role</option>
                      <option>MEDICAL_REPRESENTATIVE</option>
                      <option>SALES_MANAGER</option>
                      <option>SYSTEM_ADMINISTRATOR</option>

                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, image: e.target.files[0] });
                        }
                      }}
                    />

                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                onClick={() => handleCreateUser(formData as any)} // Cast to any for simplicity
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
