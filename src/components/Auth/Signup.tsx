import React, { useState, useEffect } from 'react';
import { Building, User, ArrowRight, ArrowLeft, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SignupData, GoogleUser } from '../../types/auth';
import GoogleAuthButton from './GoogleAuthButton';

const Signup: React.FC = () => {
  const { signup, loginWithGoogle, isLoading, setAuthMode } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    user: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isGoogleAuth: false
    },
    organization: {
      name: '',
      website: '',
      address: '',
      phone: '',
      email: ''
    }
  });

  // Check for Google user data on component mount
  useEffect(() => {
    const googleUserData = localStorage.getItem('google_user_temp');
    if (googleUserData) {
      try {
        const googleUser: GoogleUser = JSON.parse(googleUserData);
        setSignupData(prev => ({
          ...prev,
          user: {
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
            email: googleUser.email,
            password: '',
            isGoogleAuth: true
          }
        }));
        setIsGoogleUser(true);
        // Stay on step 1 to show user details with password field
        setCurrentStep(1);
        // Clear temporary data
        localStorage.removeItem('google_user_temp');
      } catch (error) {
        console.error('Error parsing Google user data:', error);
      }
    }
  }, []);

  const updateUserData = (field: string, value: string) => {
    setSignupData(prev => ({
      ...prev,
      user: { ...prev.user, [field]: value }
    }));
  };

  const updateOrgData = (field: string, value: string) => {
    setSignupData(prev => ({
      ...prev,
      organization: { ...prev.organization, [field]: value }
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to login screen
      setAuthMode('login');
    }
  };

  const handleSubmit = async () => {
    
    try {
      // Prepare data for API
      // Prepare data for API in signupData format
      const orgPayload = {
        user: {
          firstName: signupData.user.firstName,
          lastName: signupData.user.lastName,
          email: signupData.user.email,
          password: signupData.user.password ?? '',
          isGoogleAuth: signupData.user.isGoogleAuth
        },
        organization: {
          name: signupData.organization.name,
          website: signupData.organization.website,
          address: signupData.organization.address,
          phone: signupData.organization.phone,
          email: signupData.organization.email
        }
      };
      console.log('Submitting organization data:', orgPayload);
      
      await signup(orgPayload);
    } catch (error) {
      console.error('Signup failed:', error);
    }
    console.log('Submitting signup data:', signupData);
  };

  const handleGoogleSuccess = async (googleUser: any) => {
    await loginWithGoogle(googleUser);
  };

  const steps = [
    { id: 1, title: 'User Details', icon: User },
    { id: 2, title: 'Organization', icon: Building }
  ];

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <h2 className="ml-2 text-lg font-semibold text-text-primary">
              {currentStep === 1 ? 'Back to login' : 'Previous step'}
            </h2>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Create Your Account
            </h1>
            <p className="text-text-secondary">
              Set up your organization and admin account
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
                    <span className={`text-sm font-medium ${isActive ? 'text-primary-500' : 'text-text-secondary'
                      }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mb-6 mx-4 ${currentStep > step.id ? 'bg-success' : 'bg-gray-200'
                      }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">
                Your Details
              </h2>

              {/* Google OAuth Button - Only show if not coming from Google */}
              {!isGoogleUser && (
                <>
                  <GoogleAuthButton onSuccess={handleGoogleSuccess} />

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-text-secondary">Or continue with email</span>
                    </div>
                  </div>
                </>
              )}

              {/* Show message for Google users */}
              {isGoogleUser && (
                <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="text-sm text-primary-700">
                    <strong>Google Account Detected:</strong> Please review and complete your details below. You can modify the username and set a password for your account.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={signupData.user.firstName}
                    onChange={(e) => updateUserData('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={signupData.user.lastName}
                    onChange={(e) => updateUserData('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Username (Email)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="email"
                      value={signupData.user.email}
                      onChange={(e) => updateUserData('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  {isGoogleUser && (
                    <p className="mt-1 text-xs text-text-secondary">
                      This will be your username. You can change it if needed.
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="password"
                      value={signupData.user.password}
                      onChange={(e) => updateUserData('password', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Create password"
                      required
                    />
                  </div>
                  {isGoogleUser && (
                    <p className="mt-1 text-xs text-text-secondary">
                      Set a password for your account to enable email/password login.
                    </p>
                  )}
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
                    value={signupData.organization.name}
                    onChange={(e) => updateOrgData('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={signupData.organization.website}
                      onChange={(e) => updateOrgData('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="tel"
                        value={signupData.organization.phone}
                        onChange={(e) => updateOrgData('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="email"
                      value={signupData.organization.email}
                      onChange={(e) => updateOrgData('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter organization email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
                    <textarea
                      value={signupData.organization.address}
                      onChange={(e) => updateOrgData('address', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter organization address"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep === 1 && (
                <p className="text-sm text-text-secondary">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep === 2 && (
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 2 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors duration-200"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-8 py-3 bg-success text-white hover:bg-green-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;