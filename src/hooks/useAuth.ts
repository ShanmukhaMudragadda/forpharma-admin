import { useState, useEffect, createContext, useContext } from 'react';
import { User, Organization, GoogleUser, SignupData } from '../types/auth';
import { AdminService } from '../services/admin.services';

interface AuthContextType {
  token: string | null;
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: 'login' | 'signup' | 'setup' | 'authenticated';
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleUser: GoogleUser) => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
  logout: () => void;
  setAuthMode: (mode: 'login' | 'signup' | 'setup' | 'authenticated') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'setup' | 'authenticated'>('login');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication state
    const userData = localStorage.getItem('user_data');
    const orgData = localStorage.getItem('org_data');
    const storedToken = localStorage.getItem('token');

      // Token expiration check
      function isTokenExpired(token: string | null): boolean {
        if (!token) return true;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!payload.exp) return false;
          // exp is in seconds since epoch
          return Date.now() / 1000 > payload.exp;
        } catch (e) {
          return true;
        }
      }
      if (!userData || !orgData || !storedToken || isTokenExpired(storedToken)) {
      setAuthMode('login');
      setIsLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setOrganization(JSON.parse(orgData));
      setToken(storedToken);
      setAuthMode('authenticated');
    } catch (error) {
      console.error('Error parsing stored data:', error);
      setAuthMode('login');
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Logging in with email:', email);
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      // Simulate API call to check credentials
      const adminService = new AdminService();
      const response = await adminService.login(email, password);
      console.log('Login response:', response);
      // Validate response structure     

      if (!response || !response.user || !response.user.organization) {
        throw new Error('Invalid login response');
      }
      const orgDetails = response.user.organization;
      const token = response.token;
      console.log('Token received:', token);
      console.log('Organization details:', orgDetails);
      const organization: Organization = {
        id: orgDetails.id,
        name: orgDetails.name,
        website: orgDetails.website || '',
        address: orgDetails.address || '',
        phone: orgDetails.phone || '',
        email: orgDetails.email || '',
        settings: {
          allowUserRegistration: true,
          requireEmailVerification: false,
          sessionTimeout: 8
        }
      };

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        roles: response.user.role || [],
        createdAt: response.user.createdAt || new Date().toISOString(),
        isActive: response.user.isActive !== undefined ? response.user.isActive : true
      };
      setUser(user);
      setToken(token);
      setOrganization(organization);
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('org_data', JSON.stringify(organization));
      localStorage.setItem('token', token);
      setAuthMode('authenticated');
    } catch (error) {
      console.error('Login error:', error);
      setAuthMode('login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser: GoogleUser) => {
    setIsLoading(true);
    // Simulate API call to check if user's email domain exists in any organization
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user's email domain matches any existing organization
    const emailDomain = googleUser.email.split('@')[1];
    const knownDomains = ['acme.com', 'company.com', 'business.org'];

    if (knownDomains.includes(emailDomain)) {
      // Organization exists - login user
      const mockOrg: Organization = {
        id: '1',
        name: 'Acme Corporation',
        website: `https://${emailDomain}`,
        address: '123 Business St',
        phone: '+1-555-0123',
        email: `info@${emailDomain}`,
        settings: {
          allowUserRegistration: true,
          requireEmailVerification: false,
          sessionTimeout: 8
        }
      };

      const mockUser: User = {
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        roles: 'User',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setUser(mockUser);
      setOrganization(mockOrg);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      localStorage.setItem('org_data', JSON.stringify(mockOrg));
      setAuthMode('authenticated');
    } else {
      // New organization - redirect to signup with pre-filled user data
      // Store Google user data temporarily for signup process
      localStorage.setItem('google_user_temp', JSON.stringify(googleUser));
      setAuthMode('signup');
    }

    setIsLoading(false);
  };

  const signup = async (signupData: SignupData) => {
    setIsLoading(true);
    // Simulate API call to create user and organization
    const adminService = new AdminService();

    const orgPayload = {
      name: signupData.organization.name,
      email: signupData.organization.email,
      address: signupData.organization.address,
      website: signupData.organization.website,
      adminEmail: signupData.user.email,
      adminPassword: signupData.user.password || 'defaultPassword123',
      adminFirstName: signupData.user.firstName,
      adminLastName: signupData.user.lastName || ''
    };
    console.log('Submitting organization data:', orgPayload);
    const orgDetails = await adminService.createOrganization(orgPayload);
    console.log('Organization created:', orgDetails);

    const organization: Organization = {
      id: orgDetails.organizationId,
      name: orgPayload.name,
      website: orgPayload.website,
      address: orgPayload.address,
      phone: signupData.organization.phone,
      email: orgPayload.email,
      settings: {
        allowUserRegistration: true,
        requireEmailVerification: false,
        sessionTimeout: 8
      }
    };

    const user: User = {
      id: orgDetails.adminUserId,
      email: orgPayload.adminEmail,
      firstName: orgPayload.adminFirstName,
      lastName: orgPayload.adminLastName,
      roles: 'Admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setOrganization(organization);
    setUser(user);

    localStorage.setItem('org_data', JSON.stringify(organization));
    localStorage.setItem('user_data', JSON.stringify(user));
    setAuthMode('authenticated');

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('org_data');
    setAuthMode('login');
  };

  return {
    token,
    user,
    organization,
    isAuthenticated: !!user,
    isLoading,
    authMode,
    login,
    loginWithGoogle,
    signup,
    logout,
    setAuthMode
  };
};

export { AuthContext };