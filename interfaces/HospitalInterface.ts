interface IHospital {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    established: Date;
    departments: string[];
    numberOfBeds: number;
    isEmergencyAvailable: boolean;
}