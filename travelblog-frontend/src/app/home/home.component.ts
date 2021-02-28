import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { Blog } from '../_models/blog';
import { AuthenticationService } from '../_services/authentication.service';
import { BlogService } from '../_services/blog.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    blogs: Blog[];

    constructor(private blogService: BlogService) { }

    ngOnInit() {
        this.loading = true;
        this.blogService.getAll().pipe(first()).subscribe(blogs => {
            this.loading = false;
            this.blogs = blogs;
        });
    }
}