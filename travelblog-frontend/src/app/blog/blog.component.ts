import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { Blog } from '../_models/blog';
import { AuthenticationService } from '../_services/authentication.service';
import { BlogService } from '../_services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { User } from '../_models/user';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  loading = false;
  blog: Blog;
  id: string;
  editing: boolean = false;
  currentUser: User;
  private sub: any;
  private querySub: any;
  readonly blogFormGroup: FormGroup;

  constructor(
    private blogService: BlogService, 
    private route: ActivatedRoute, 
    private authenticationService: AuthenticationService, 
    private router: Router,
    private readonly formBuilder: FormBuilder) {
    this.blogFormGroup = this.formBuilder.group({
      _id: [],
      title: [],
      destination: [],
      traveltime: [],
      shortDescription: [],
      entries: this.formBuilder.array([this.formBuilder.group({
        title: [],
        datetime: [],
        place: [],
        text: [],
        images: this.formBuilder.array([this.formBuilder.group({
          description: [],
          url: []
        })])
      })])
    });

    this.retrieveData();
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;

    this.querySub = this.route.queryParams.subscribe(queryParams => {
      let editParam = this.route.snapshot.queryParams['edit']
      let edit = editParam === 'true' || editParam === 'True';

      if (edit) {
        if (this.currentUser) {
          // logged in
          this.editing = true;
        }
        else {
          // Not logged in, navigate to login page.
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.route.url } });
        }
      } else {
        this.editing = false;
      }
    });

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id === 'new') {
        this.loading = false;
        this.blog = new Blog();
      } else {
        this.loading = true;
        this.blogService.getOne(this.id).pipe(first()).subscribe(blog => {
            this.loading = false;
            this.blog = blog;
            if (blog && blog.entries) {
              blog.entries = blog.entries.sort((a, b) => Date.parse(a.datetime.toString()) - Date.parse(b.datetime.toString()));
            }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.querySub.unsubscribe();
  }

  private retrieveData(): void {
    this.entries().clear();
    this.blogService.getOne(this.route.snapshot.params['id']).subscribe((res: Blog) => {
      if (res && res.entries) {
        res.entries.forEach(e => {
          let entry: FormGroup = this.newEntry();
          this.entries().push(entry);
          if (e.images) {
            e.images.forEach(i => {
              let image = this.newImage();
              (entry.get('images') as FormArray).push(image);
            });
          }
        });
      }
      
      this.blogFormGroup.patchValue(res);
    });
  }

  entries(): FormArray {
    return this.blogFormGroup.get('entries') as FormArray;
  }

  images(entryIndex: number): FormArray {
    return this.entries().at(entryIndex).get('images') as FormArray;
  }

  newEntry(): FormGroup {
    return this.formBuilder.group({
      title: '',
      datetime: '',
      place: '',
      text: '',
      images: this.formBuilder.array([])
    });
  }

  addEntry() {
    this.entries().push(this.newEntry());
  }

  newImage(): FormGroup {
    return this.formBuilder.group({
      description: '',
      url: ''
    });
  }

  addImage(entryIndex: number) {
    this.images(entryIndex).push(this.newImage());
  }

  save() {
    if (this.blogFormGroup.value._id) {
      this.blogService.saveOne(this.blogFormGroup.value).subscribe({ 
        next: () => {
          this.retrieveData();
          this.ngOnInit();
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              edit: 'false'
            },
            queryParamsHandling: 'merge',
            skipLocationChange: true
          });
        },
        error: res => {
          console.error(`Error while saving blog: ${res}`);
        }
      });
    } else {
      // create new blog
      this.blogService.createOne(this.blogFormGroup.value).subscribe({ 
        next: (res) => {
          this.retrieveData();
          this.ngOnInit();
          this.router.navigate([`blog/${res._id}`], {
            relativeTo: this.route,
            queryParams: {
              edit: 'false'
            },
            queryParamsHandling: 'merge',
            skipLocationChange: true
          });
        },
        error: res => {
          console.error(`Error while creating blog: ${res}`);
        }
      });
    }
  }

  edit() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        edit: 'true'
      },
      queryParamsHandling: 'merge',
      skipLocationChange: true
    });
  }

  cancel() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        edit: 'false'
      },
      queryParamsHandling: 'merge',
      skipLocationChange: true
    });
  }

  delete() {
    if (this.blog) {
      this.blogService.deleteOne(this.blog._id).subscribe({ 
        next: (res) => {
          this.retrieveData();
          this.ngOnInit();
          this.router.navigate(['/'], {
            relativeTo: this.route
          });
        },
        error: res => {
          console.error(`Error while deleting blog: ${res}`);
        }
      });
    }
  }

  removeImage(entryIndex: number, imageIndex: number) {
    this.images(entryIndex).removeAt(imageIndex);
  }

  removeEntry(entryIndex: number) {
    this.entries().removeAt(entryIndex);
  }
}