import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allBanks:any[],searchTerm:string,propsName:string): any[] {
    const result:any[]=[];
    if(!allBanks||searchTerm==''||propsName==''){
      return allBanks;
    }
    allBanks.forEach((bank:any)=>{
      //if(contact[propsName]==searchTerm)
      if(bank[propsName].trim().toLowerCase().includes(searchTerm.trim().toLowerCase()))
      result.push(bank)
    })
    return result;

  }
}
