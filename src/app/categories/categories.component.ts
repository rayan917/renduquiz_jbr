import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: any;
  originalCategories: any;
  searchTerm: string = '';
  searchForm: FormGroup;
  playerName = '';

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }
  ngOnInit(): void {
    this.playerName = this.authService.user?.username || '';
    this.categoriesService.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.originalCategories = data;
    });
  }

  searchCategories() {
    const searchTerm = this.searchForm.get('searchTerm')!.value;
    if (searchTerm.trim() === '') {
      this.categoriesService.getCategories().subscribe((data: any) => {
        this.categories = this.originalCategories;
      });
    } else {
      this.categories = this.originalCategories.filter((categorie: any) => {
        return categorie.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }

  clear() {
    this.searchForm.get('searchTerm')?.setValue('');
    this.categories = this.originalCategories;
  }

  navigateToQuiz(categoryId:any) {
    this.router.navigate(['/quiz', this.playerName, categoryId]);
  }
}
