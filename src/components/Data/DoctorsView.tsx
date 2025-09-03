import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Mail, Stethoscope,
  ChevronRight, ArrowLeft, Save, X, Calendar,
  User, Phone, GraduationCap, Building2, AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import { AdminService } from '../../services/admin.services';
import { useAuth } from '../../hooks/useAuth';
import type { Chemist } from './ChemistsView';
import Spinner from '../Spinner';

// Types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  designation?: string;
  description?: string;
  qualification?: string;
  experienceYears?: number;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  website?: string;
  description?: string;
  phone?: string;
  type?: string;
  territory?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface HospitalAssociation {
  hospitalId: string;
  department: string;
  position: string;
  isPrimary: boolean;
  associationStartDate: string;
  associationEndDate: string;
  schedule?: {
    [day: string]: ConsultationSlot[];
  };
}

interface ConsultationSlot {
  consultationType: string;
  from: string;
  to: string;
}

// ...existing code...

interface BreadcrumbProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}
// Breadcrumb Component
const Breadcrumb = ({ steps, currentStep, onStepClick }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 mb-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => onStepClick(index)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${index === currentStep
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : index < currentStep
                ? 'text-success hover:text-success hover:bg-success/10'
                : 'text-text-tertiary cursor-not-allowed'
              }`}
            disabled={index > currentStep}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${index < currentStep
              ? 'bg-success/20 text-success'
              : index === currentStep
                ? 'bg-primary-100 text-primary-700'
                : 'bg-secondary-100 text-text-tertiary'
              }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span>{step.title}</span>
          </button>
          {index < steps.length - 1 && (
            <ChevronRight className="w-3 h-3 text-text-tertiary" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}
// Form Card Component
const FormCard = ({ title, subtitle, children, className = "" }: FormCardProps) => {
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

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  className?: string;
}
// Input Component
const InputField = ({ label, icon: Icon, error, required, className = "", ...props }: InputFieldProps) => {
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
          className={`w-full ${Icon ? 'pl-7' : 'pl-2'} pr-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-surface ${error ? 'border-error focus:ring-error' : ''
            }`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorName?: string;
}
// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, doctorName }: DeleteConfirmModalProps) => {
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
            <h3 className="text-sm font-semibold text-text-primary font-heading">Delete Doctor</h3>
            <p className="text-xs text-text-secondary">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Are you sure you want to delete <strong>{doctorName}</strong>?
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

const DoctorsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(useAuth().token);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showCreateModal || showEditModal || showViewModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCreateModal, showEditModal, showViewModal, showDeleteModal]);


  // const hospitals = [
  //   { id: 'h1', name: 'City General Hospital' },
  //   { id: 'h2', name: "Children's Medical Center" },
  //   { id: 'h3', name: 'Orthopedic Specialty Center' }
  // ];

  // const chemists = [
  //   { id: 'c1', name: 'John Pharmacy', pharmacyName: 'City Medical Store', email: 'john@pharmacy.com', phone: '+1-234-567-8901', location: 'Downtown', licenseNumber: 'PH12345' },
  //   { id: 'c2', name: 'Sarah Drugs', pharmacyName: 'Health Plus Pharmacy', email: 'sarah@healthplus.com', phone: '+1-234-567-8902', location: 'Uptown', licenseNumber: 'PH12346' },
  //   { id: 'c3', name: 'Mike Medicine', pharmacyName: 'Quick Care Pharmacy', email: 'mike@quickcare.com', phone: '+1-234-567-8903', location: 'Mall Road', licenseNumber: 'PH12347' },
  //   { id: 'c4', name: 'Lisa Pharma', pharmacyName: 'Green Cross Pharmacy', email: 'lisa@greencross.com', phone: '+1-234-567-8904', location: 'Central Plaza', licenseNumber: 'PH12348' },
  // ];



  const steps = [
    { id: 'basic', title: 'Basic Information' },
    { id: 'associations', title: 'Hospital Associations' },
    { id: 'chemists', title: 'Chemist Associations' },
    { id: 'review', title: 'Review & Confirm' }
  ];

  // Form states
  const [doctorForm, setDoctorForm] = useState<Record<string, any>>({
    name: '', designation: '', specialization: '', email: '', phone: '',
    description: '', qualification: '', experienceYears: null,
  });

  const [hospitalAssociations, setHospitalAssociations] = useState<HospitalAssociation[]>([]);
  const defaultSchedule: { [day: string]: ConsultationSlot[] } = {
    SUNDAY: [],
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: []
  };
  const [associationForm, setAssociationForm] = useState<HospitalAssociation>({
    hospitalId: '', department: '', position: '', isPrimary: false,
    associationStartDate: '', associationEndDate: '', schedule: { ...defaultSchedule }
  });

  const [selectedChemists, setSelectedChemists] = useState<string[]>([]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDoctors = async () => {
    try {
      console.log('Token:', token);
      const adminService = new AdminService();
      const doctorsList = await adminService.getDoctors(token ?? "");
      setDoctors(doctorsList.data);
      console.log('Doctors List:', doctorsList);

    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Handle error (show notification, etc.)
    }
    setLoading(false);
  };

  const getChemists = async () => {
    const adminService = new AdminService();
    const chemistsList = await adminService.getChemists(token ?? "");
    setChemists(chemistsList.data);
    console.log('Chemists List:', chemistsList);
  }

  const getHospitals = async () => {
    const adminService = new AdminService();
    const hospitalsList = await adminService.fetchHospitals(token ?? "");
    setHospitals(hospitalsList.data);
    console.log('Hospitals List:', hospitalsList);
  }

  useEffect(() => {
    getDoctors();
    // Fetch hospitals from API or perform any necessary data fetching
    getHospitals();
    getChemists();
  }, [token]);

  // Handle form changes
  const handleDoctorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (name === 'experienceYears') {
      // Remove leading zeros and allow empty string for backspace
      const cleaned = value.replace(/^0+(?!$)/, '');
      parsedValue = cleaned === '' ? '' : Number(cleaned);
    }
    setDoctorForm(prev => ({ ...prev, [name]: parsedValue }));
    // console.log('Doctor form updated:', { ...doctorForm, [name]: parsedValue });
  };

  const handleAssociationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setAssociationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in target ? (target as HTMLInputElement).checked : value
    }));
  };

  // Chemist handlers
  const handleChemistToggle = (chemistId: string) => {
    console.log('Chemists: ', chemists);
    console.log('Toggling chemist:', chemistId);
    setSelectedChemists(prev =>
      prev.includes(chemistId)
        ? prev.filter(id => id !== chemistId)
        : [...prev, chemistId]
    );
    console.log('Updated selected chemists: ', selectedChemists);
  };

  // Association handlers
  const [editAssociationIndex, setEditAssociationIndex] = useState<number | null>(null);

  const handleAddAssociation = async () => {
    if (!associationForm.hospitalId) return;
    if (editAssociationIndex !== null) {
      // Edit existing association
      setHospitalAssociations(prev => prev.map((assoc, idx) => idx === editAssociationIndex ? { ...associationForm } : assoc));
      setEditAssociationIndex(null);
    } else {
      // Add new association
      setHospitalAssociations(prev => [
        ...prev,
        {
          ...associationForm,
          schedule: associationForm.schedule && Object.keys(associationForm.schedule).length > 0
            ? { ...associationForm.schedule }
            : { ...defaultSchedule }
        }
      ]);
      // After adding association, create consultations array and call backend API
      const consultations: any = [];
      Object.entries(associationForm.schedule || {}).forEach(([day, consults]) => {
        (consults || []).forEach(c => {
          if (c.consultationType) {
            consultations.push({
              dayOfWeek: day.toUpperCase(),
              startTime: c.from,
              endTime: c.to,
              consultationType: c.consultationType,
              isActive: true,
              hospitalId: associationForm.hospitalId
            });
          }
        });
      });
      setConsultations(consultations);
      // if (consultations.length > 0) {
      //   try {
      //     await axios.post('/api/doctor-consultations', {
      //       doctorId: doctorForm.id,
      //       consultations
      //     });
      //   } catch (err) {
      //     // Handle error (show notification, etc.)
      //     console.error('Failed to create doctor consultations', err);
      //   }
      // }
    }
    setAssociationForm({
      hospitalId: '', department: '', position: '', isPrimary: false,
      associationStartDate: '', associationEndDate: '', schedule: { ...defaultSchedule }
    });
  };

  const handleRemoveAssociation = (idx: number) => {
    setHospitalAssociations(prev => prev.filter((_, i) => i !== idx));
    // If editing the removed association, reset form
    if (editAssociationIndex === idx) {
      setEditAssociationIndex(null);
      setAssociationForm({
        hospitalId: '', department: '', position: '', isPrimary: false,
        associationStartDate: '', associationEndDate: '', schedule: { ...defaultSchedule }
      });
    }
  };

  const handleEditAssociation = (idx: number) => {
    setEditAssociationIndex(idx);
    setAssociationForm({ ...hospitalAssociations[idx] });
  };

  // Main submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const adminService = new AdminService();
    console.log('selected chemists: ', selectedChemists);
    try {
      console.log('Creating doctor...', doctorForm);
      const createDoctorResponse = await adminService.createDoctor(doctorForm, token ?? "");
      const doctorId = createDoctorResponse.data.id;
      console.log('Response: ', createDoctorResponse);
      console.log('Doctor created with ID:', doctorId);

      if (createDoctorResponse.success && doctorId) {
        // Send list of hospitalAssociations including doctorId
        if (hospitalAssociations.length > 0) {
          const doctorHospitalResponse = await adminService.createDoctorHospitalAssociation(
            { associations: hospitalAssociations.map(assoc => ({ ...assoc, doctorId })) },
            token ?? ""
          );
          console.log('Response doctor hospital: ', doctorHospitalResponse);
        }

        const doctorConsultationsResponse = await adminService.createDoctorConsultationSchedule(
          { doctorId: doctorId, consultations: consultations },
          token ?? ""
        );
        console.log('Response doctor consultations: ', doctorConsultationsResponse);

        if (selectedChemists.length > 0) {
          console.log('selected chemists: ', selectedChemists);
          const doctorChemistResponse = await adminService.createDoctorChemistRelation(
            { relations: selectedChemists.map(chemistId => ({ doctorId, chemistId })) },
            token ?? ""
          );
          console.log('Response doctor chemist: ', doctorChemistResponse);
        }
      }
      resetForm();
      setShowCreateModal(false);
      getDoctors();

    } catch (error) {
      console.error('Error in doctor creation process:', error);
      resetForm();
      setShowCreateModal(false);
      getDoctors();
    } finally {
      setIsSubmitting(false);
      getDoctors();
    }
  };

  // Edit doctor
  const handleEditDoctor = async () => {
    setIsSubmitting(true);
    try {
      console.log('Updating doctor...', selectedDoctor?.id, doctorForm);
      // await adminService.updateDoctor(selectedDoctor?.id, doctorForm);

      for (const association of hospitalAssociations) {
        console.log('Updating hospital association...', association);
        // await adminService.updateHospitalAssociation(association.id, association);
      }

      for (const chemistId of selectedChemists) {
        console.log('Updating chemist association...', { doctorId: selectedDoctor?.id, chemistId });
        // await adminService.updateChemistAssociation({ doctorId: selectedDoctor?.id, chemistId });
      }

      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating doctor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async () => {
    try {
      console.log('Deleting doctor...', selectedDoctor?.id);
      // await adminService.deleteDoctor(selectedDoctor?.id);
      setShowDeleteModal(false);
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const resetForm = () => {
    setDoctorForm({
      name: '', designation: '', specialization: '', email: '', phone: '',
      description: '', qualification: '', experienceYears: null,
    });
    setHospitalAssociations([]);
    setSelectedChemists([]);
    setCurrentStep(0);
  };

  const openEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDoctorForm({
      name: doctor.name, designation: doctor.designation || '', specialization: doctor.specialization,
      email: doctor.email, phone: doctor.phone, description: doctor.description || '',
      qualification: doctor.qualification || '', experienceYears: doctor.experienceYears || null,
    });
    setShowEditModal(true);
  };

  const openViewModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const openDeleteModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };
  // Render different steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormCard title="Personal Information" subtitle="Enter the doctor's basic information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <InputField label="Full Name" icon={User} name="name" value={doctorForm.name} onChange={handleDoctorFormChange} placeholder="Enter doctor's full name" required />
              <InputField label="Email" icon={Mail} type="email" name="email" value={doctorForm.email} onChange={handleDoctorFormChange} placeholder="doctor@hospital.com" required />
              <InputField label="Phone" icon={Phone} type="tel" name="phone" value={doctorForm.phone} onChange={handleDoctorFormChange} placeholder="+1-234-567-8900" required />
              <InputField label="Specialization" icon={Stethoscope} name="specialization" value={doctorForm.specialization} onChange={handleDoctorFormChange} placeholder="e.g., Cardiology" required />
              <InputField label="Designation" icon={Building2} name="designation" value={doctorForm.designation} onChange={handleDoctorFormChange} placeholder="e.g., Senior Consultant" />
              <InputField label="Qualification" icon={GraduationCap} name="qualification" value={doctorForm.qualification} onChange={handleDoctorFormChange} placeholder="e.g., MD, MBBS" />
              <InputField label="Experience (Years)" name="experienceYears" type="number" value={doctorForm.experienceYears} onChange={handleDoctorFormChange} placeholder="0" min="0" />
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-text-primary mb-1 font-heading">Description</label>
                <textarea name="description" value={doctorForm.description} onChange={handleDoctorFormChange} rows={3} className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface" placeholder="Brief description about the doctor" />
              </div>
            </div>
          </FormCard>
        );

      case 1:
        return (
          <div className="space-y-4">
            <FormCard title="Hospital Associations" subtitle="Associate doctor with hospitals and schedules">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1 font-heading">Hospital <span className="text-error">*</span></label>
                    <select name="hospitalId" value={associationForm.hospitalId} onChange={handleAssociationFormChange} className="w-full px-2 py-2 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface">
                      <option value="">Select hospital</option>
                      {hospitals.map(h => (<option key={h.id} value={h.id}>{h.name}</option>))}
                    </select>
                  </div>
                  <InputField label="Department" icon={Building2} name="department" value={associationForm.department} onChange={handleAssociationFormChange} placeholder="e.g., Cardiology" />
                  <InputField label="Position" name="position" value={associationForm.position} onChange={handleAssociationFormChange} placeholder="e.g., Senior Consultant" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField label="Start Date" type="date" name="associationStartDate" value={associationForm.associationStartDate} onChange={handleAssociationFormChange} />
                  <InputField label="End Date" type="date" name="associationEndDate" value={associationForm.associationEndDate} onChange={handleAssociationFormChange} />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="isPrimary" checked={associationForm.isPrimary} onChange={handleAssociationFormChange} className="w-3 h-3 text-primary-600 border-border rounded focus:ring-primary-500" id="isPrimary" />
                  <label htmlFor="isPrimary" className="ml-2 text-xs text-text-primary font-heading">Primary Association</label>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-text-primary mb-2 flex items-center font-heading"><Calendar className="w-3 h-3 mr-1" />Weekly Schedule</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => (
                      <div key={day} className="flex flex-col space-y-2 p-2 bg-background-tertiary rounded-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 text-xs font-medium text-text-primary font-heading">{day.slice(0, 3)}</div>
                          <button type="button" className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs" onClick={() => {
                            setAssociationForm(prev => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                [day]: [...(prev.schedule?.[day] || []), { consultationType: '', from: '09:00', to: '17:00' }]
                              }
                            }));
                          }}>+ Add Consultation</button>
                        </div>
                        {(associationForm.schedule?.[day] || []).map((consult, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <select className="text-xs px-2 py-1 border border-border rounded-sm bg-surface focus:ring-1 focus:ring-primary-500" value={consult.consultationType} onChange={e => {
                              const updated = [...(associationForm.schedule?.[day] || [])];
                              updated[idx].consultationType = e.target.value;
                              setAssociationForm(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: updated } }));
                            }}>
                              <option value="">Select Type</option>
                              <option value="OPD">OPD</option>
                              <option value="EMERGENCY">Emergency</option>
                              <option value="SPECIAL">Special</option>
                              <option value="SURGERY">Surgery</option>
                            </select>
                            <input type="time" className="text-xs px-2 py-1 border border-border rounded-sm bg-surface focus:ring-1 focus:ring-primary-500" value={consult.from} onChange={e => {
                              const updated = [...(associationForm.schedule?.[day] || [])];
                              updated[idx].from = e.target.value;
                              setAssociationForm(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: updated } }));
                            }} />
                            <span className="text-xs text-text-tertiary">to</span>
                            <input type="time" className="text-xs px-2 py-1 border border-border rounded-sm bg-surface focus:ring-1 focus:ring-primary-500" value={consult.to} onChange={e => {
                              const updated = [...(associationForm.schedule?.[day] || [])];
                              updated[idx].to = e.target.value;
                              setAssociationForm(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: updated } }));
                            }} />
                            <button type="button" className="text-error px-2 py-1" onClick={() => {
                              const updated = [...(associationForm.schedule?.[day] || [])];
                              updated.splice(idx, 1);
                              setAssociationForm(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: updated } }));
                            }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={handleAddAssociation} disabled={!associationForm.hospitalId} className="px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors">Add Association</button>
                </div>
              </div>
            </FormCard>

            {hospitalAssociations.length > 0 && (
              <FormCard title="Added Associations">
                <div className="space-y-2">
                  {hospitalAssociations.map((assoc, idx) => (
                    <div key={idx} className="p-3 bg-primary-50 rounded-sm border border-primary-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Building2 className="w-3 h-3 text-primary-600" />
                            <span className="text-xs font-medium text-text-primary font-heading">{hospitals.find(h => h.id === assoc.hospitalId)?.name}</span>
                            {assoc.isPrimary && (<span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">Primary</span>)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                            <div><span className="font-medium">Dept:</span> {assoc.department || 'N/A'}</div>
                            <div><span className="font-medium">Position:</span> {assoc.position || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button type="button" onClick={() => handleEditAssociation(idx)} className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => handleRemoveAssociation(idx)} className="p-1 text-error hover:bg-error/10 rounded transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FormCard>
            )}
          </div>
        );

      case 2:
        return (
          <FormCard title="Chemist Associations" subtitle="Select chemists to associate with this doctor">
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-text-primary font-heading mb-3">Available Chemists</h4>
              {chemists.map((chemist) => (
                <div key={chemist.id} className="flex items-center space-x-3 p-3 border border-border rounded-sm hover:bg-background-tertiary transition-colors">
                  <input
                    type="checkbox"
                    id={`chemist-${chemist.id}`}
                    checked={selectedChemists.includes(chemist.id)}
                    onChange={() => handleChemistToggle(chemist.id)}
                    className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                  />
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`chemist-${chemist.id}`} className="block text-sm font-medium text-text-primary font-heading cursor-pointer">
                      {chemist.name}
                    </label>
                    <div className="text-xs text-text-tertiary">{chemist.address} • {chemist.phone}</div>
                  </div>
                </div>
              ))}
              {selectedChemists.length > 0 && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-sm">
                  <div className="text-xs font-medium text-success mb-1">
                    {selectedChemists.length} chemist(s) selected
                  </div>
                  <div className="text-xs text-text-secondary">
                    {selectedChemists.map(id => {
                      const chemist = chemists.find(c => c.id === id);
                      return chemist?.name;
                    }).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </FormCard>
        );

      case 3:
        return (
          <FormCard title="Review & Confirm" subtitle="Please review all information before creating">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-text-primary mb-2 font-heading">Doctor Information</h4>
                <div className="bg-background-tertiary rounded-sm p-3 grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Name:</strong> {doctorForm.name}</div>
                  <div><strong>Email:</strong> {doctorForm.email}</div>
                  <div><strong>Phone:</strong> {doctorForm.phone}</div>
                  <div><strong>Specialization:</strong> {doctorForm.specialization}</div>
                  <div><strong>Designation:</strong> {doctorForm.designation || 'N/A'}</div>
                  <div><strong>Experience:</strong> {doctorForm.experienceYears} years</div>
                </div>
              </div>

              {hospitalAssociations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-primary mb-2 font-heading">Hospital Associations</h4>
                  <div className="space-y-2">
                    {hospitalAssociations.map((assoc, idx) => (
                      <div key={idx} className="bg-background-tertiary rounded-sm p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium font-heading">{hospitals.find(h => h.id === assoc.hospitalId)?.name}</span>
                          {assoc.isPrimary && (<span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">Primary</span>)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          <div>Dept: {assoc.department}, Position: {assoc.position}</div>
                          <div>Duration: {assoc.associationStartDate} to {assoc.associationEndDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedChemists.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-primary mb-2 font-heading">Selected Chemists</h4>
                  <div className="space-y-2">
                    {selectedChemists.map((chemistId) => {
                      const chemist = chemists.find(c => c.id === chemistId);
                      return (
                        <div key={chemistId} className="bg-background-tertiary rounded-sm p-3">
                          <div className="flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium font-heading">{chemist?.name}</span>
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {chemist?.phone} • {chemist?.address}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </FormCard>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return doctorForm.name && doctorForm.email && doctorForm.phone && doctorForm.specialization;
      case 1: return true;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-4">

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        ) : (<>
          {/* Header */}
          <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-text-primary font-heading">Doctors Management</h1>
                <p className="text-xs text-text-secondary mt-1">Manage doctor profiles, associations, and schedules</p>
              </div>
              <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-surface rounded-lg shadow-sf border border-border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input type="text" placeholder="Search doctors by name or specialization..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface" />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-sm hover:bg-background-secondary text-sm font-medium transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Doctors Table */}
          <div className="bg-surface rounded-lg shadow-sf border border-border overflow-hidden">
            <div className="overflow-x-auto">
              {filteredDoctors.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  <div className="flex flex-col items-center justify-center">
                    <Stethoscope className="w-10 h-10 mb-4 text-primary-400" />
                    <h2 className="text-lg font-semibold mb-2">No doctors present</h2>
                    <p className="text-sm mb-4">Please go ahead and create a doctor.</p>
                    <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-sm font-medium transition-colors">
                      <Plus className="w-4 h-4 mr-2 inline" /> Add Doctor
                    </button>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-background-tertiary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Specialization</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Designation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Experience</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider font-heading">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-background-secondary transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="w-4 h-4 text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-text-primary font-heading">{doctor.name}</div>
                              <div className="text-xs text-text-secondary flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {doctor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
                            {doctor.specialization}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">{doctor.designation || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {doctor.experienceYears ? `${doctor.experienceYears} years` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => openViewModal(doctor)}
                              className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEditModal(doctor)} className="p-1 hover:bg-primary-50 text-primary-600 rounded transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => openDeleteModal(doctor)} className="p-1 hover:bg-error/10 text-error rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Create/Edit Doctor Modal */}
          {(showCreateModal || showEditModal) && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" />
              <div className="fixed right-0 top-0 h-full w-full bg-background shadow-sf-lg overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }} className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-text-primary font-heading">{showEditModal ? 'Edit Doctor' : 'Create New Doctor'}</h2>
                        <p className="text-xs text-text-secondary">{showEditModal ? 'Update doctor information' : 'Add a new doctor to the system'}</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }} className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Breadcrumb Navigation */}
                  <Breadcrumb steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

                  {/* Step Content */}
                  <div className="mb-6">{renderStepContent()}</div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border bg-surface rounded-lg p-4">
                    <button type="button" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="flex items-center space-x-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <ArrowLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }} className="px-4 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                      {currentStep < steps.length - 1 ? (
                        <button type="button" onClick={() => setCurrentStep(currentStep + 1)} disabled={!isStepValid()} className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors">
                          <span>Next</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button type="button" onClick={showEditModal ? handleEditDoctor : handleSubmit} disabled={!isStepValid() || isSubmitting} className="flex items-center space-x-2 px-4 py-2 bg-success text-surface hover:bg-success/90 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-sm text-xs font-medium transition-colors">
                          <Save className="w-3 h-3" />
                          <span>{isSubmitting ? 'Saving...' : showEditModal ? 'Update Doctor' : 'Create Doctor'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Doctor Modal */}
          {showViewModal && selectedDoctor && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setShowViewModal(false)} />
              <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-background shadow-sf-lg overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-text-primary font-heading">View Doctor</h2>
                        <p className="text-xs text-text-secondary">Doctor details and information</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Doctor Information */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <FormCard title="Personal Information" subtitle="Doctor's basic information and qualifications">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Full Name</label>
                          <div className="text-sm font-medium text-text-primary">{selectedDoctor.name}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Email</label>
                          <div className="text-sm text-text-primary flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-text-tertiary" />
                            {selectedDoctor.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Phone</label>
                          <div className="text-sm text-text-primary flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-text-tertiary" />
                            {selectedDoctor.phone}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Specialization</label>
                          <div className="text-sm text-text-primary">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
                              {selectedDoctor.specialization}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Designation</label>
                          <div className="text-sm text-text-primary">{selectedDoctor.designation || 'Not specified'}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Qualification</label>
                          <div className="text-sm text-text-primary">{selectedDoctor.qualification || 'Not specified'}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Experience</label>
                          <div className="text-sm text-text-primary">
                            {selectedDoctor.experienceYears ? `${selectedDoctor.experienceYears} years` : 'Not specified'}
                          </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Description</label>
                          <div className="text-sm text-text-primary bg-background-tertiary p-3 rounded-sm border border-border">
                            {selectedDoctor.description || 'No description provided'}
                          </div>
                        </div>
                      </div>
                    </FormCard>

                    {/* Hospital Associations */}
                    <FormCard title="Hospital Associations" subtitle="Doctor's hospital affiliations and schedules">
                      <div className="text-sm text-text-secondary">
                        {/* Mock hospital associations - replace with actual data from your backend */}
                        <div className="space-y-3">
                          {selectedDoctor?.hospitalAssociations && selectedDoctor.hospitalAssociations.length > 0 ? (
                            selectedDoctor.hospitalAssociations.map((assoc: HospitalAssociation, idx: number) => {
                              const hospital = hospitals.find(h => h.id === assoc.hospitalId);
                              return (
                                <div key={idx} className="p-3 bg-primary-50 rounded-sm border border-primary-200">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Building2 className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-medium text-text-primary font-heading">{hospital?.name || assoc.hospitalId}</span>
                                    {assoc.isPrimary && (
                                      <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">Primary</span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
                                    <div><span className="font-medium">Department:</span> {assoc.department || 'N/A'}</div>
                                    <div><span className="font-medium">Position:</span> {assoc.position || 'N/A'}</div>
                                    <div>
                                      <span className="font-medium">Duration:</span> {assoc.associationStartDate || 'N/A'} to {assoc.associationEndDate || 'Present'}
                                    </div>
                                    <div>
                                      <span className="font-medium">Schedule:</span>{" "}
                                      {assoc.schedule
                                        ? Object.entries(assoc.schedule)
                                            .filter(([_, slots]) => slots.length > 0)
                                            .map(([day, slots]) =>
                                              slots.map((slot, i) =>
                                                `${day.slice(0, 3)} ${slot.from}-${slot.to} (${slot.consultationType})`
                                              ).join(', ')
                                            ).join('; ')
                                        : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-xs text-text-tertiary italic">
                              No hospital associations found for this doctor.
                            </div>
                          )}
                        </div>
                      </div>
                    </FormCard>

                    {/* Chemist Associations */}
                    <FormCard title="Chemist Associations" subtitle="Associated chemists and pharmacies">
                      <div className="text-sm text-text-secondary">
                        {/* Mock chemist associations - replace with actual data from your backend */}
                        <div className="space-y-3">
                          <div className="p-3 bg-accent/10 rounded-sm border border-accent/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <ShoppingCart className="w-4 h-4 text-accent" />
                              <span className="text-sm font-medium text-text-primary font-heading">City Medical Store</span>
                              <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">Active</span>
                            </div>
                            <div className="text-xs text-text-secondary">
                              John Pharmacy • Downtown • +1-234-567-8901
                            </div>
                          </div>
                          <div className="p-3 bg-accent/10 rounded-sm border border-accent/20">
                            <div className="flex items-center space-x-2 mb-2">
                              <ShoppingCart className="w-4 h-4 text-accent" />
                              <span className="text-sm font-medium text-text-primary font-heading">Health Plus Pharmacy</span>
                              <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-medium">Active</span>
                            </div>
                            <div className="text-xs text-text-secondary">
                              Sarah Drugs • Uptown • +1-234-567-8902
                            </div>
                          </div>
                          <div className="text-xs text-text-tertiary italic">
                            * Chemist associations will be loaded from your backend data
                          </div>
                        </div>
                      </div>
                    </FormCard>

                    {/* Additional Information */}
                    <FormCard title="Additional Information" subtitle="System information and metadata">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Created Date</label>
                          <div className="text-sm text-text-primary">
                            {new Date(selectedDoctor.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Doctor ID</label>
                          <div className="text-sm text-text-primary font-mono">
                            {selectedDoctor.id}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1 font-heading">Status</label>
                          <div className="text-sm text-text-primary">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </FormCard>
                  </div>

                  {/* Action Buttons */}
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
                          openEditModal(selectedDoctor);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-surface hover:bg-primary-600 rounded-sm text-xs font-medium transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Doctor</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedDoctor(null); }} onConfirm={handleDeleteDoctor} doctorName={selectedDoctor?.name} />
        </>
        )}
      </div>
    </div>
  );
};

export default DoctorsView;