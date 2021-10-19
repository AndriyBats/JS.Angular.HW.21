import { Component, OnInit } from '@angular/core';
import { IBlogResponse } from '../shared/interfaces/blog/blog.interface';
import { BlogService } from '../shared/services/blog/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  public userBlogs: Array<IBlogResponse> = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getAll().subscribe(data => {
      this.userBlogs = data;
    }, err => {
      console.log('Load blog error', err); 
    })
  }



}
