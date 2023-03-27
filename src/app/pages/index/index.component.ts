import { Component, OnInit } from '@angular/core';
import { ProductService } from '@services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentCategory: string = '';
  categorys!: Array<any>;
  products!: Array<any>;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.productService.getCategorys(),
      this.productService.getProducts()
    ]).subscribe((resArr: Array<any>) => {
      console.log(resArr)
      this.categorys = resArr[0];
      this.currentCategory = this.categorys[0].name;
      this.products = resArr[1];
    });
  }

  switchCategory(category: string) {
    this.currentCategory = category;
  }
}
