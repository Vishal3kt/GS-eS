import { Pipe, PipeTransform } from '@angular/core';

/**
 * Simple search/filter pipe (replaces ng2-search-filter for Ivy compatibility).
 * Filters array items by matching searchText against stringified values.
 */
@Pipe({ 
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[] | null | undefined, searchText: string): any[] {
    if (!items?.length) return [];
    if (!searchText || typeof searchText !== 'string') return items;
    const term = searchText.toLowerCase().trim();
    if (!term) return items;
    return items.filter(item => JSON.stringify(item).toLowerCase().includes(term));
  }
}
