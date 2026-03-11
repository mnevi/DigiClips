import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

interface SearchResult {
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent {

    constructor(private router: Router){}

  // Reactive state for the search bar
  searchTerm = signal('');

  // Automatically derive results whenever searchTerm changes
  results = computed(() => {
    const term = this.searchTerm().trim();
    if (!term) return [];

    // Create 5 mock results based on the search term
    return Array.from({ length: 5 }, (_, i) => ({
      title: `${term} ${i + 1}`,
      description: `Description for search result ${i + 1}`
    }));
  }); 

  addAlert() {
    this.router.navigate(['/alert']);
  }
}