import API_ENDPOINTS from '../environments/environment';
import axios from 'axios';

export class AdminService {
    private createOrgUrl = API_ENDPOINTS.CreateOrganization;
    private loginUrl = API_ENDPOINTS.Login;
    private googleLoginUrl = API_ENDPOINTS.GoogleLogin;
    private createUserUrl = API_ENDPOINTS.CreateUser;
    private activateAccountUrl = API_ENDPOINTS.ActivateAccount;
    private fetchUsersUrl = API_ENDPOINTS.GetUsers;
    private getDoctorsUrl = API_ENDPOINTS.GetDoctors;
    private createDoctorUrl = API_ENDPOINTS.CreateDoctor;
    private createHospitalUrl = API_ENDPOINTS.CreateHospital;
    private fetchHospitalsUrl = API_ENDPOINTS.FetchHospitals;
    private createDoctorHospitalAssociationUrl = API_ENDPOINTS.CreateDoctorHospitalAssociation;
    private getDoctorHospitalAssociationsByDoctorUrl = API_ENDPOINTS.GetDoctorHospitalAssociationsByDoctor;
    private updateDoctorHospitalAssociationUrl = API_ENDPOINTS.UpdateDoctorHospitalAssociation;
    private deleteDoctorHospitalAssociationUrl = API_ENDPOINTS.DeleteDoctorHospitalAssociation;
    private getChemistsUrl = API_ENDPOINTS.GetChemists;
    private createChemistUrl = API_ENDPOINTS.CreateChemist;
    private createDoctorChemistRelationUrl = API_ENDPOINTS.CreateDoctorChemistRelation;
    private createDoctorConsultationScheduleUrl = API_ENDPOINTS.CreateDoctorConsultationSchedule;
    private getDrugListUrl = API_ENDPOINTS.GetDrugList;

    async createOrganization(data: {
        name: string;
        email: string;
        address?: string;
        website?: string;
        adminEmail: string;
        adminPassword: string;
        adminFirstName: string;
        adminLastName?: string;
    }) {
        try {
            const response = await axios.post(this.createOrgUrl, data);
            return response.data; // Returns the organization creation result
        } catch (error) {
            console.error('Error creating organization:', error);
            throw error; // Propagate the error for further handling
        }
    }
    async login(email: string, password: string) {
        try {
            const response = await axios.post(this.loginUrl, { email, password });
            return response.data; // Returns the login result
        } catch (error) {
            console.error('Error during login:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async googleLogin(idToken: string) {
        try {
            const response = await axios.post(this.googleLoginUrl, { idToken });
            return response.data; // Returns the Google login result
        } catch (error) {
            console.error('Error during Google login:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async createUser(data: any) {
        try {
            const response = await axios.post(this.createUserUrl, data);
            return response.data; // Returns the user creation result
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async activateAccount(email: string, password: string) {
        try {
            const response = await axios.post(this.activateAccountUrl, { email, password });
            return response.data; // Returns the account activation result
        } catch (error) {
            console.error('Error activating account:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async fetchUsers(organizationId: string) {
        try {
            const response = await axios.get(`${this.fetchUsersUrl}?organizationId=${organizationId}`);
            return response.data; // Returns the list of users
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async getDoctors(token: string) {
        try {
            const response = await axios.get(`${this.getDoctorsUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Returns the list of doctors
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async createDoctor(data: any, token: string) {
        try {
            console.log('Creating doctor with data:', data);
            const response = await axios.post(this.createDoctorUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Returns the doctor creation result
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async createHospital(data: any, token: string) {
        try {
            console.log('Creating hospital with data:', data);
            const response = await axios.post(this.createHospitalUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Returns the hospital creation result
        } catch (error) {
            console.error('Error creating hospital:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async fetchHospitals(token: string) {
        try {
            const response = await axios.get(this.fetchHospitalsUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Returns the list of hospitals
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            throw error; // Propagate the error for further handling
        }
    }

    async createDoctorHospitalAssociation(data: any, token: string) {
        try {
            console.log('Creating doctor-hospital association with data:', data);
            const response = await axios.post(this.createDoctorHospitalAssociationUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating doctor-hospital association:', error);
            throw error;
        }
    }

    async getDoctorHospitalAssociationsByDoctor(doctorId: string, token: string) {
        try {
            const response = await axios.get(this.getDoctorHospitalAssociationsByDoctorUrl(doctorId), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor-hospital associations:', error);
            throw error;
        }
    }

    async deleteDoctorHospitalAssociation(associationId: string, token: string) {
        try {
            const response = await axios.delete(this.deleteDoctorHospitalAssociationUrl(associationId), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting doctor-hospital association:', error);
            throw error;
        }
    }

    async updateDoctorHospitalAssociation(associationId: string, data: any, token: string) {
        try {
            const response = await axios.put(this.updateDoctorHospitalAssociationUrl(associationId), data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating doctor-hospital association:', error);
            throw error;
        }
    }

    async getChemists(token: string) {
        try {
            const response = await axios.get(this.getChemistsUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching chemists:', error);
            throw error;
        }
    }

    async createChemist(data: any, token: string) {
        try {
            console.log('Creating chemist with data:', data);
            const response = await axios.post(this.createChemistUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating chemist:', error);
            throw error;
        }
    }

    async createDoctorChemistRelation(data: any, token: string) {
        try {
            console.log('Creating doctor-chemist relation with data:', data);
            const response = await axios.post(this.createDoctorChemistRelationUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating doctor-chemist relation:', error);
            throw error;
        }

    }

    async createDoctorConsultationSchedule(data: any, token: string) {
        try {
            console.log('Creating doctor consultation schedule with data:', data);
            const response = await axios.post(this.createDoctorConsultationScheduleUrl, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating doctor consultation schedule:', error);
            throw error;
        }
    }

    async getDrugList(token: string) {
        try {
            const response = await axios.get(this.getDrugListUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching drug list:', error);
            throw error;
        }
    }

    async createDrug(data: any, token: string) {
        try {
            console.log('Creating drug with data:', data);
            const response = await axios.post(API_ENDPOINTS.CreateDrug, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating drug:', error);
            throw error;
        }
    }

}
