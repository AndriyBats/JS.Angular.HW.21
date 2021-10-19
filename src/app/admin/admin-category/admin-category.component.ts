import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.inteface';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;
  @ViewChild('closeDelete') closeDelete!: ElementRef;
  public nameCategoryForm!: FormGroup;
  public adminCategories: Array<ICategoryResponse> = [];
  public currentCategoryID!: number;
  public tryDeleteCategoryID!: number;
  public editStatus = false;
  public searchWord = '';

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.adminCategories = data;
    }, err => {
      console.log('Load blog error', err);
    });
  };


  initCategoryForm(): void {
    this.nameCategoryForm = this.fb.group({
      name: [null, Validators.required]
    })
  }

  saveCategory(): void {
    this.categoryService.create(this.nameCategoryForm.value).subscribe(() => {
      this.loadCategories();
      this.initCategoryForm();
      this.close.nativeElement.click();
    }, err => {
      console.log('Create category error', err);
    });
  }


  tryDeleteCategory(category: ICategoryResponse): void {
    this.tryDeleteCategoryID = category.id;

  }


  deleteCategory(): void {
    this.categoryService.delete(this.tryDeleteCategoryID).subscribe(() => {
      this.loadCategories();
      this.closeDelete.nativeElement.click();
    }, err => {
      console.log('Delete category error', err);
    });
  };

  editCategory(category: ICategoryResponse): void {
    this.nameCategoryForm.patchValue({
      name: category.name
    });
    this.currentCategoryID = category.id;
    this.editStatus = true;
  };

  saveEditCategory(): void {
    this.categoryService.update(this.nameCategoryForm.value, this.currentCategoryID).subscribe(() => {
      this.loadCategories();
      this.initCategoryForm();
      this.editStatus = false;
      this.close.nativeElement.click();
    }, err => {
      console.log('Update category error', err);
    });
  }


}
