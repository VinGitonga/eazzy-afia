import { IAppointment } from "@/types/Appointment";

export const getphones = (appointments: IAppointment[]) => {
    const phones =  appointments.map((appointment) => appointment.phone);

    // remove duplicates
    const uniquePhones = [...new Set(phones)];

    return uniquePhones;
}