import {Entry} from './entry';

export class Blog {
    _id: string;
    title: string;
	destination: string;
	traveltime: number;
	shortDescription: string;
    entries: Entry[];
}