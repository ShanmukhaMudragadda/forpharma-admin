import React from 'react';
import { Users, Shield, Key, Database, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { id: 1, name: 'Total Users', value: '1,234', icon: Users, change: '+12%', changeType: 'increase' },
    { id: 2, name: 'Active Roles', value: '8', icon: Shield, change: '+2', changeType: 'increase' },
    { id: 3, name: 'Permissions', value: '42', icon: Key, change: '+5', changeType: 'increase' },
    { id: 4, name: 'Data Records', value: '89,432', icon: Database, change: '+1,234', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, action: 'New user created', user: 'john.doe@example.com', timestamp: '2 minutes ago' },
    { id: 2, action: 'Role updated', user: 'Marketing Manager', timestamp: '15 minutes ago' },
    { id: 3, action: 'Permission granted', user: 'sarah.wilson@example.com', timestamp: '1 hour ago' },
    { id: 4, action: 'Data exported', user: 'admin@company.com', timestamp: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
        <h1 className="text-xl font-semibold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary text-sm">Overview of your system activity and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-tertiary">{stat.name}</p>
                  <p className="text-2xl font-bold text-text-primary mt-2">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-success mr-2" />
                <span className="text-sm text-success font-medium">{stat.change}</span>
                <span className="text-sm text-text-tertiary ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
            <Activity className="w-5 h-5 text-text-tertiary" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition-colors duration-150">
                <div>
                  <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                  <p className="text-sm text-text-tertiary">{activity.user}</p>
                </div>
                <span className="text-sm text-text-tertiary">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-6">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">CPU Usage</span>
                <span className="text-sm text-text-tertiary">42%</span>
              </div>
              <div className="w-full bg-background-tertiary rounded-full h-2">
                <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">Memory Usage</span>
                <span className="text-sm text-text-tertiary">68%</span>
              </div>
              <div className="w-full bg-background-tertiary rounded-full h-2">
                <div className="bg-warning h-2 rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">Storage</span>
                <span className="text-sm text-text-tertiary">23%</span>
              </div>
              <div className="w-full bg-background-tertiary rounded-full h-2">
                <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '23%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-primary">Network</span>
                <span className="text-sm text-text-tertiary">89%</span>
              </div>
              <div className="w-full bg-background-tertiary rounded-full h-2">
                <div className="bg-error h-2 rounded-full transition-all duration-300" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;