import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService } from '@services/product.service';
import { debounceTime, distinctUntilChanged, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  search = {
    category: '',
    keyword: '',
  };
  currentCategory: string = '';
  categorys!: Array<any>;
  products!: Array<any>;
  filterProducts!: Array<any>;
  @ViewChild('searchInput') searchInput!: NgModel;

  constructor(
    private domSanitizer: DomSanitizer,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.productService.getCategorys(),
      this.productService.getProducts()
    ]).subscribe((resArr: Array<any>) => {
      console.log(resArr)
      this.categorys = resArr[0];
      this.search.category = this.categorys[0].name;
      this.products = resArr[1];
      this.getFilterProducts();
    });

    this.searchInput?.valueChanges?.pipe(
      debounceTime(500),
      map((val: string) => val.trim()),
      distinctUntilChanged()
    )
      .subscribe(res => {
        console.log(res)
      })
  }

  getFilterProducts() {
    const { category, keyword } = this.search;
    this.filterProducts = this.products.filter((product: any) => product.category === category && (!keyword || product.name === keyword));
  }

  switchCategory(category: string) {
    this.search.category = category;
    this.getFilterProducts();
  }

  getSafeImageUrl(imgUrl: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(imgUrl)
  }
}
