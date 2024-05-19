import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class PipeservicePipe implements PipeTransform {

  transform(items: any, searchString: string) {
    if(!items) return []
    if(!searchString) return items
    searchString = searchString.toLowerCase()
    const filterNotes=items.filter((item: {bookName: string, authorName: string}) => item.bookName.toLowerCase().includes(searchString) || item.authorName.toLowerCase().includes(searchString));
    console.log(filterNotes);
    console.log('Items:', items);
    console.log('Search string:', searchString);
    return filterNotes
    
  }
}
