import { Pipe, PipeTransform } from '@angular/core';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.inteface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<ICategoryResponse>, searchWord: string ): Array<ICategoryResponse> {
    if(!searchWord){
      return value;
    }else if(!value){
      return  [];
    }
    return value.filter(name => {
      return name.name.toLowerCase().includes(searchWord);
    })
  }
}
