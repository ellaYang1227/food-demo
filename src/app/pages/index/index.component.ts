import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { OrderService } from '@services/order.service';
import { ProductService } from '@services/product.service';
import { debounceTime, distinctUntilChanged, forkJoin, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  order$!: Subscription;
  order: any = {};
  search = {
    category: '',
    keyword: '',
  };
  currentCategory: string = '';
  categorys!: Array<any>;
  products!: Array<any>;
  filterProducts!: Array<any>;
  tax = 0.1;
  @ViewChild('searchInput', { static: false }) searchInput!: NgModel;

  constructor(
    private domSanitizer: DomSanitizer,
    private productService: ProductService,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.productService.getCategorys(),
      this.productService.getProducts()
    ]).subscribe((resArr: Array<any>) => {
      this.categorys = resArr[0];
      this.search.category = this.categorys[0].name;
      this.products = resArr[1];
      this.getFilterProducts();
    });

    // 監聽搜尋 Input
    setTimeout(() => {
      this.searchInput?.valueChanges?.pipe(
        debounceTime(500),
        map((keyword: string) => keyword.trim()),
        distinctUntilChanged()
      )
        .subscribe(keyword => {
          this.search.keyword = keyword;
          this.getFilterProducts();
        })
    }, 1000);

    // 訂閱購物車
    this.order$ = this.orderService.order$.subscribe((res: any) => {
      if (res) {
        this.order = res;
      } else {
        this.order = {};
        this.orderService.getOrder();
      }
    });
  }

  // 篩選產品
  getFilterProducts() {
    const { category, keyword } = this.search;
    this.filterProducts = this.products.filter((product: any) => product.category === category && (!keyword || product.name.indexOf(keyword) > -1));
  }

  // 切換產品類別
  switchCategory(category: string) {
    this.search.category = category;
    this.getFilterProducts();
  }

  // 取得產品 URL
  getSafeImageUrl(imgUrl: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(imgUrl)
  }

  // 更新購物車
  updateOrder(action: 'add' | 'del', productId: string) {
    const findProduct = this.products.find((product: any) => product.id === productId);
    this.orderService.updateOrder(action, findProduct);
  }

  // 取得產品 指定欄位資料
  getProductInfo(productId: any, searchKey: string): string {
    const find = this.products?.find((product: any) => product.id === productId);
    return find ? find[searchKey] : '';
  }

  // 更新數量
  updateQty(action: 'plus' | 'minus', productId: string) {
    this.orderService.updateQty(action, productId);
  }

  // 送出訂單
  sendOrder() {
    this.orderService.sendOrder();
  }

  ngOnDestroy(): void {
    this.order$.unsubscribe();
  }
}
