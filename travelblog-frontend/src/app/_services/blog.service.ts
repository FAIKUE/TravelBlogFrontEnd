import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Blog } from '../_models/blog';

@Injectable({ providedIn: 'root' })
export class BlogService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Blog[]>(`${environment.apiUrl}/blogs`);
    }

    getOne(id: string) {
        return this.http.get<Blog>(`${environment.apiUrl}/blogs/${id}`);
    }

    saveOne(blog: Blog) {
        return this.http.patch<Blog>(`${environment.apiUrl}/blogs/${blog._id}`, blog);
    }

    createOne(blog: Blog) {
        return this.http.post<Blog>(`${environment.apiUrl}/blogs/`, blog);
    }

    deleteOne(id: string) {
        return this.http.delete<Blog>(`${environment.apiUrl}/blogs/${id}`);
    }
}