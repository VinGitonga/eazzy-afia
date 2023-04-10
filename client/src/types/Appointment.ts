export enum AppointementStatus {
    Pending = 'pending',
    Approved = 'confirmed',
    Cancelled = 'cancelled',
}

export interface IAppointment {
    id: string;
    date: string;
    time: string;
    status: AppointementStatus;
    phone: string
    name: string
    service: string
    appointmentId: number
}