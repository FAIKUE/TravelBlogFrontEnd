import {Image} from './image';

export class Entry {
    _id: string;
    title: string;
    datetime: Date;
    place?: string;
    text: string;
    images?: Image[];
}