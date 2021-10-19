import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { AdminBlogComponent } from './admin/admin-blog/admin-blog.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';

const routes: Routes = [
  {path: 'blog', component: BlogComponent},
  {path: 'admin', component: AdminComponent, children: [
    {path: '', pathMatch: 'full', redirectTo: 'admin-category'},
    {path: 'admin-category', component: AdminCategoryComponent},
    {path: 'admin-blog', component: AdminBlogComponent},
    {path: 'admin-product', component: AdminProductComponent},
  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
