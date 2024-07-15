export interface Page {
    _id: string;
    url: string;
    status: string; 
    dateAdded: Date;
    lastReportDate?: Date; 
    selected?: boolean;
    aErrors?: number;
    aaErrors?: number;
    aaaErrors: number;
    
}

