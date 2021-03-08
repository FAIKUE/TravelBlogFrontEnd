import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Blog } from '../_models/blog';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { BlogService } from '../_services/blog.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    blogs: Blog[];
    currentUser: User;

    constructor(private blogService: BlogService, private authenticationService: AuthenticationService, private router: Router) { }

    ngOnInit() {
        this.currentUser = this.authenticationService.currentUserValue;
        this.loading = true;
        this.blogService.getAll().pipe(first()).subscribe(blogs => {
            this.loading = false;
            this.blogs = blogs;
        });
    }

    addBlog() {
        this.router.navigate(['blog/new'], {
            queryParams: {
                edit: 'true'
            },
            skipLocationChange: true
        });
    }
}