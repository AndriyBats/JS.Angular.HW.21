import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductRequest, IProductResponse } from '../../interfaces/product/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` };

  constructor(private http: HttpClient) { }

  getAll(): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(this.api.products);
  }

  getOne(id: number): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.api.products}/${id}`)
  }

  create(product: IProductRequest): Observable<void> {
    return this.http.post<void>(this.api.products, product);
  }

  update(product: IProductRequest, id: number): Observable<void> {
    return this.http.patch<void>(`${this.api.products}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.products}/${id}`)
  }
}
