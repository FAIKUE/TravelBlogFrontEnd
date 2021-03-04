import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Blog } from '../_models/blog';
import { AuthenticationService } from '../_services/authentication.service';
import { BlogService } from '../_services/blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  loading = false;
  blog: Blog;
  id: string;
  private sub: any;

  constructor(private blogService: BlogService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.loading = true;
      this.blogService.getOne(this.id).pipe(first()).subscribe(blog => {
          this.loading = false;
          this.blog = blog;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
