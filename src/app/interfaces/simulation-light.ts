export interface SimulationResult {
    lifelongIncome: number;
    programmedRetirement: number;
    clientId: string;
}

export interface SimulationData {
    age: number;
    gender: string;
    taxableIncome: number;
    balance: number;
}

export interface SimulationDataAPV {
    age: number;
    gender: string;
    clientId: number;
    apvAmount: number;
}
