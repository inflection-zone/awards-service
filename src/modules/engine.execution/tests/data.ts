import { v4 as uuidv4 } from 'uuid';

export const PatientData = [
    {
        Name: "Joe Biden",
        Id: uuidv4(),
        Facts: {
            Age: 80,
            BPMeasurementCount: 2,
            SystolicBP: 180,
            DiastolicBP: 112,
        }
    },
    {
        Name: "Vladimir Putin",
        Id: uuidv4(),
        Facts: {
            Age: 70,
            BPMeasurementCount: 2,
            SystolicBP: 160,
            DiastolicBP: 100,
        }
    },
    {
        Name: "Emmanuel Macron",
        Id: uuidv4(),
        Facts: {
            Age: 45,
            BPMeasurementCount: 2,
            SystolicBP: 140,
            DiastolicBP: 90,
        }
    },
    {
        PatientName: "Benjamin Netanyahu",
        PatientId: uuidv4(),
        Facts: {
            Age: 60,
            BPMeasurementCount: 2,
            SystolicBP: 120,
            DiastolicBP: 80,
        }
    },
]