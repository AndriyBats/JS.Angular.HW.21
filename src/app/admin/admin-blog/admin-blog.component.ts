import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBlogResponse } from 'src/app/shared/interfaces/blog/blog.interface';
import { BlogService } from 'src/app/shared/services/blog/blog.service';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.scss']
})
export class AdminBlogComponent implements OnInit {
  public adminBlogs: Array<IBlogResponse> = [];
  public blogForm!: FormGroup;
  public currentBlogID!: number;
  public editStatus = false;

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder
  ) { };

  ngOnInit(): void {
    this.initBlogForm();
    this.loadBlogs();
  };

  loadBlogs(): void {
    this.blogService.getAll().subscribe(data => {
      this.adminBlogs = data;
    }, err => {
      console.log('Load blog error', err);
    });
  };

  initBlogForm(): void {
    this.blogForm = this.fb.group({
      title: [null, Validators.required],
      text: [null, Validators.required],
      date: new Date(),
      author: [null, Validators.required]
    });
  };

  saveBlog(): void {
    this.blogService.create(this.blogForm.value).subscribe(() => {
      this.loadBlogs();
      this.initBlogForm();
    }, err => {
      console.log('Create blog error', err);
    });
  };

  deleteBlog(blog: IBlogResponse): void {
    this.blogService.delete(blog.id).subscribe(() => {
      this.loadBlogs();
    }, err => {
      console.log('Delete blog error', err);
    });
  };

  editBlog(blog: IBlogResponse): void {
    this.blogForm.patchValue({
      title: blog.title,
      text: blog.text,
      author: blog.author
    });
    this.currentBlogID = blog.id;
    this.editStatus = true;
  };

  saveEditBlog(): void {
    this.blogService.update(this.blogForm.value, this.currentBlogID).subscribe(() => {
      this.loadBlogs();
      this.initBlogForm();
      this.editStatus = false;
    }, err => {
      console.log('Update blog error', err);
    });
  };

}
