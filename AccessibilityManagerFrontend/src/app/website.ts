import { Page } from "./page";

export interface Website {
    join(arg0: string): unknown;
    _id: string;
    url: string;
    status: string;
    pages: Page[];
    dateAdded: Date;
    lastReportDate?: Date;
    topErrors: string[];
}
