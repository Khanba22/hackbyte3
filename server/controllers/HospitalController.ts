import { Request, Response } from 'express';
import Hospital from '../models/Hospital';
import Doctor from '../models/Doctor';
import { getAssessment } from './AiController';

// Create a new hospital
export const createHospital = async (req: Request, res: Response): Promise<void> => {
    try {
        const hospital = new Hospital(req.body);
        const savedHospital = await hospital.save();
        res.status(201).json(savedHospital);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getRecommendation = async(req:Request,res:Response)=>{
    try {
        // Replace with actual LLM Call
        const query = req.body.query
        console.log(query,"Backend Query")
        const hospitals = await Hospital.find().limit(10);
        const {response} = await getAssessment(query)
        const data  = {
            response:response,
            hospitals
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

// Get all hospitals
export const getHospitals = async (req: Request, res: Response): Promise<void> => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get a single hospital by ID
export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.params.id)
        const hospital = await Hospital.findById(req.params.id);
        const staff = await Doctor.find({hospital: req.params.id}).populate("available_time_slots");
        if (hospital) {
            res.status(200).json({hospital, staff});
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: (error as Error).message });
    }
};

const getAvailableTimeSlots = async(req: Request, res: Response) => {
    const { hospitalId, doctorId, date } = req.body;
    const day_of_week = new Date(date).getDay();
    const doctor = await Doctor.findById(doctorId).populate({
        path: 'available_time_slots',
        select: 'day_of_week',
        model: 'TimeSlot' // Ensure the correct model name is used
    });
    const hospital = await Hospital.findById(hospitalId);
    if (!doctor) {
        res.status(404).json({ message: 'Doctor or hospital not found' });
        return;
    }
    const timeSlots = doctor.available_time_slots.filter((timeSlot: any) => timeSlot.day_of_week === day_of_week);
    res.status(200).json(timeSlots);
}

// Update a hospital by ID
export const updateHospital = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedHospital) {
            res.status(200).json(updatedHospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Delete a hospital by ID
export const deleteHospital = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
        if (deletedHospital) {
            res.status(200).json({ message: 'Hospital deleted successfully' });
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const images = [
    'https://www.istockphoto.com/photo/modern-hospital-building-gm1138423023-303635944',
    'https://www.istockphoto.com/photo/hospital-building-gm157482029-22381216',
    'https://www.istockphoto.com/photo/modern-hospital-building-gm1138423023-303635944',
    'https://www.istockphoto.com/photo/hospital-building-gm157482029-22381216',
    'https://www.istockphoto.com/photo/modern-hospital-building-gm1138423023-303635944',
    'https://www.istockphoto.com/photo/hospital-building-gm157482029-22381216',
    'https://www.istockphoto.com/photo/modern-hospital-building-gm1138423023-303635944',
    'https://www.istockphoto.com/photo/hospital-building-gm157482029-22381216',
    'https://www.istockphoto.com/photo/modern-hospital-building-gm1138423023-303635944',
    'https://www.istockphoto.com/photo/hospital-building-gm157482029-22381216'
  ];
// Function to get a random hospital image URL

  
  // Update all hospital documents with a random image
  const updateHospitalImages = async () => {
    try {
      const hospitals = await Hospital.find();
      var x = 0;
      for (const hospital of hospitals) {
        
        hospital.image = images[x];
        x = (x + 1) % images.length;
        await hospital.save();
      }
      
      console.log('Hospital images updated successfully.');
    } catch (error) {
      console.error('Error updating hospital images:', error);
    } 
  };
  
  updateHospitalImages();