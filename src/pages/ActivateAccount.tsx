import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, CheckCircle, XCircle, Shield } from 'lucide-react';
import axios from 'axios';
import { AdminService } from '../services/admin.services';

export default function ActivateAccount() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  // Password strength checker
  useEffect(() => {
    const calculateStrength = (pass: string) => {
      let strength = 0;
      if (pass.length >= 8) strength += 1;
      if (/[A-Z]/.test(pass)) strength += 1;
      if (/[a-z]/.test(pass)) strength += 1;
      if (/[0-9]/.test(pass)) strength += 1;
      if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
      return strength;
    };
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const adminService = new AdminService();
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    if (passwordStrength < 3) {
      return setMessage("Please choose a stronger password.");
    }
    setIsLoading(true);
    try {
      const result = await adminService.activateAccount(email, password);
      console.log('Account activated:', result);
      setMessage("Password reset successful! You can now log in.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'An error occurred while activating your account.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccess = message.includes('successful');
  const isError = message && !isSuccess;

  if (isSuccess) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 flex flex-col items-center max-w-sm">
          <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-bold text-green-700 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-700 text-center mb-4">
            You can now log in by installing our application.
          </p>
          <div className="mb-4">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://forpharma.app/download"
              alt="QR Code"
              className="rounded-lg border border-gray-200"
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Scan the QR code to download and login to the ForPharma app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-auto">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="relative w-full max-w-md max-h-full">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 max-h-full overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Activate Your Account
            </h2>
            <p className="text-gray-600 text-xs">Create a new secure password to activate your account</p>
          </div>

          {/* Email field (non-editable) */}
          {email && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600 text-sm"
                />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Password strength</span>
                    <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 3 ? 'text-blue-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center text-xs">
                  {password === confirmPassword ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-xl border ${isSuccess
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                <div className="flex items-center">
                  {isSuccess ? (
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
          {/* Security notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start">
              <Shield className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Security Tips:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Use at least 8 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Add numbers and special characters</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
