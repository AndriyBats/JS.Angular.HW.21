import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.inteface';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { Storage, ref, deleteObject, uploadBytes, uploadString, uploadBytesResumable, percentage, getDownloadURL} from '@angular/fire/storage';


@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  @ViewChild('close') close!: ElementRef;
  @ViewChild('closeDelete') closeDelete!: ElementRef;
  public productForm!: FormGroup;
  public adminProducts: Array<IProductResponse> = [];
  public currentProductID!: number;
  public tryDeleteProductID!: number;
  public editStatus = false;
  public adminCategories: Array<ICategoryResponse> = [];
  public isUploaded = false;
  public uploadPercent!: number;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadProducts();
    this.loadCategories()
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(data => {
      this.adminProducts = data;
    }, err => {
      console.log('Load product error', err);
    });
  };

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }

  saveProduct(): void {
    this.productService.create(this.productForm.value).subscribe(() => {
      this.loadProducts();
      this.initProductForm();
      this.close.nativeElement.click();
      this.isUploaded = false;
    }, err => {
      console.log('Create product error', err);
    });
  }

  tryDeleteProduct(product: IProductResponse): void {
    this.tryDeleteProductID = product.id;
  }

  deleteProduct(): void {
    this.productService.delete(this.tryDeleteProductID).subscribe(() => {
      this.loadProducts();
      this.closeDelete.nativeElement.click();
    }, err => {
      console.log('Delete product error', err);
    });
  };

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imagePath: product.imagePath
    });
    this.currentProductID = product.id;
    this.editStatus = true;
  };

  saveEditProduct(): void {
    this.productService.update(this.productForm.value, this.currentProductID).subscribe(() => {
      this.loadProducts();
      this.initProductForm();
      this.editStatus = false;
      this.close.nativeElement.click();
    }, err => {
      console.log('Update product error', err);
    });
  }

  changeCategory(): void {

  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.adminCategories = data;
    }, err => {
      console.log('Load blog error', err);
    });
  };

  uload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file).then(data => {
      this.productForm.patchValue({
        imagePath: data
      });
      this.isUploaded = true;
    })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`;
    let url = '';
    if(file){
      try{
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      }catch(e: any){
        console.error(e);
      }
    }else{
      console.log('Wrong format');
    }
    return Promise.resolve(url);
  }


}
