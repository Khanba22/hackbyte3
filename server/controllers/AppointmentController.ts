import  Appointment  from '../models/Appointment';
import { Request, Response } from 'express';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';


export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getPatientAppointments = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findOne({user:req.params.id})
        if(!patient){
            res.status(404).json({error:"Patient Not Found"})
        }
        const appointments = await Appointment.find({
            patient:patient?._id
        }).populate("hospital").populate("doctor");
        res.status(200).json(appointments.sort((a,b)=> {
            return new Date(a.appointmentDate) > new Date(b.appointmentDate) ? 1:-1;
        }));
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAppointmentsByHospital = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find({ hospital:req.params.hospitalId }).populate("patient").populate("doctor").populate("hospital");
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAppointmentsByDoctorAndHospital = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId, hospitalId: req.params.hospitalId });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};



export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        appointment.status = 'cancelled';
        await appointment.save();
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
