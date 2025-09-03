import React, { useState } from 'react';
import { Building, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GoogleAuthButton from './GoogleAuthButton';

const Login: React.FC = () => {
  const { login, loginWithGoogle, isLoading, setAuthMode } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const handleGoogleSuccess = async (googleUser: any) => {
    await loginWithGoogle(googleUser);
  };
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-sm shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-sm flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Welcome to Admin Panel
            </h1>
            <p className="text-text-secondary">
              Sign in to your account or create a new one
            </p>
          </div>

          <GoogleAuthButton onSuccess={handleGoogleSuccess} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-text-secondary">Or continue with email</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500" />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white hover:bg-primary-600 rounded-sm transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;