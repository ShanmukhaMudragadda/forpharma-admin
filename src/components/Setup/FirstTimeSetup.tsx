import React, { useState } from 'react';
import { Building, User, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AdminSetup } from '../../types/auth';

const FirstTimeSetup: React.FC = () => {
  const { completeSetup, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState<AdminSetup>({
    admin: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    organization: {
      name: '',
      domain: '',
      address: '',
      phone: '',
      email: ''
    }
  });

  const updateAdminData = (field: string, value: string) => {
    setSetupData(prev => ({
      ...prev,
      admin: { ...prev.admin, [field]: value }
    }));
  };

  const updateOrgData = (field: string, value: string) => {
    setSetupData(prev => ({
      ...prev,
      organization: { ...prev.organization, [field]: value }
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await completeSetup(setupData);
  };

  const steps = [
    { id: 1, title: 'Admin Account', icon: User },
    { id: 2, title: 'Organization', icon: Building },
    { id: 3, title: 'Review', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Welcome to Admin Panel
          </h1>
          <p className="text-text-secondary">
            Let's set up your organization and admin account
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${isCompleted ? 'bg-success text-white' : 
                      isActive ? 'bg-primary-500 text-white' : 
                      'bg-gray-200 text-text-secondary'}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-primary-500' : 'text-text-secondary'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mb-6 mx-4 ${
                    currentStep > step.id ? 'bg-success' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form */}
        <div className="bg-white rounded-sm shadow-sm p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">
                Create Admin Account
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={setupData.admin.firstName}
                    onChange={(e) => updateAdminData('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={setupData.admin.lastName}
                    onChange={(e) => updateAdminData('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={setupData.admin.email}
                    onChange={(e) => updateAdminData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={setupData.admin.password}
                    onChange={(e) => updateAdminData('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Create password"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">
                Organization Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={setupData.organization.name}
                    onChange={(e) => updateOrgData('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={setupData.organization.domain}
                      onChange={(e) => updateOrgData('domain', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={setupData.organization.phone}
                      onChange={(e) => updateOrgData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={setupData.organization.email}
                    onChange={(e) => updateOrgData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Address
                  </label>
                  <textarea
                    value={setupData.organization.address}
                    onChange={(e) => updateOrgData('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization address"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">
                Review & Complete Setup
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-text-primary mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Admin Account
                  </h3>
                  <div className="bg-background-secondary p-4 rounded-sm">
                    <p><strong>Name:</strong> {setupData.admin.firstName} {setupData.admin.lastName}</p>
                    <p><strong>Email:</strong> {setupData.admin.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Organization
                  </h3>
                  <div className="bg-background-secondary p-4 rounded-sm space-y-2">
                    <p><strong>Name:</strong> {setupData.organization.name}</p>
                    <p><strong>Domain:</strong> {setupData.organization.domain}</p>
                    <p><strong>Email:</strong> {setupData.organization.email}</p>
                    <p><strong>Phone:</strong> {setupData.organization.phone}</p>
                    <p><strong>Address:</strong> {setupData.organization.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 rounded-sm transition-colors duration-200"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-3 bg-success text-white hover:bg-green-600 rounded-sm transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeSetup;