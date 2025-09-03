import Login from "../components/Auth/Login";

const API_BASE_URL = 'https://forpharma-backend-c019df77bb93.herokuapp.com/api';
console.log('API Base URL:', API_BASE_URL);

const API_ENDPOINTS = {
    CreateOrganization: `${API_BASE_URL}/organizations/create`,
    GoogleLogin: `${API_BASE_URL}/user/google-login`,
    Login: `${API_BASE_URL}/user/login`,
    CreateUser: `${API_BASE_URL}/user/create`,
    ActivateAccount: `${API_BASE_URL}/user/activate_account`,
    GetUsers: `${API_BASE_URL}/user/get_users`,
    GetDoctors: `${API_BASE_URL}/doctors`,
    CreateDoctor: `${API_BASE_URL}/doctors/create`,
    CreateHospital: `${API_BASE_URL}/hospitals/create`,
    FetchHospitals: `${API_BASE_URL}/hospitals/`,
    CreateDoctorHospitalAssociation: `${API_BASE_URL}/doctors/createAssociations`,
    UpdateDoctorHospitalAssociation: (associationId: string) => `${API_BASE_URL}/doctors/updateAssociations/${associationId}`,
    DeleteDoctorHospitalAssociation: (associationId: string) => `${API_BASE_URL}/doctors/deleteAssociations/${associationId}`,
    GetDoctorHospitalAssociationsByDoctor: (doctorId: string) => `${API_BASE_URL}/doctors/${doctorId}/hospitals`,
    CreateDoctorConsultationSchedule: `${API_BASE_URL}/doctors/createSchedules`,
    GetChemists: `${API_BASE_URL}/chemists`,
    CreateChemist: `${API_BASE_URL}/chemists/create`,
    CreateDoctorChemistRelation: `${API_BASE_URL}/chemists/doctor-relations`
};

export default API_ENDPOINTS;
