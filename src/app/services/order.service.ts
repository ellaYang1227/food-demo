import { Injectable } from '@angular/core';
import { SwalDefaultService } from '@services/swal-default.service';
import { BehaviorSubject } from 'rxjs';

let swalPopup: any;
let swalToast: any;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  order: any = {
    data: [],
    subTotal: 0
  };
  order$ = new BehaviorSubject<any>(false);
  constructor(
    private swalDefaultService: SwalDefaultService
  ) {
    swalPopup = this.swalDefaultService.popupDefault;
    swalToast = this.swalDefaultService.toastDefault;
  }

  // 清除訂單
  emptyOrder() {
    this.order.data = [];
    localStorage.removeItem('order');
    this.order$.next(false);
  }

  // 取得訂單
  getOrder() {
    let orderStr = localStorage.getItem('order');
    if (orderStr) {
      this.order = JSON.parse(orderStr);
      this.changeOrder$(this.order);
    }
  }

  // 更新訂單
  updateOrder(action: 'add' | 'del', product: any) {
    const { id, price } = product;
    const { data } = this.order;

    const findOrderIndex = data.findIndex((item: any) => item.id === id);
    if (action === 'add') {
      if (findOrderIndex === -1) {
        const qty = 1;
        data.push({ id, price, qty });
      } else {
        data[findOrderIndex].qty++;
      }
    } else if (action === 'del' && findOrderIndex > -1) {
      data.splice(findOrderIndex, 1);
    }

    this.computeSubTotal(data);

    swalToast.fire({
      icon: 'success',
      title: `成功${action === 'add' ? '新增' : '刪除'}該品項`
    });
  }

  computeSubTotal(orderItem: Array<any>) {
    this.order.subTotal = orderItem.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price * currentValue.qty, 0);

    if (!this.order.id) {
      this.order = {
        ...this.order,
        id: new Date().getTime(),
      };
    }

    this.changeOrder$(this.order, true);
    swalToast.fire({
      icon: 'success',
      title: `成功更新該品項`
    });
  }

  // 更新數量
  updateQty(action: 'plus' | 'minus', productId: string) {
    let { data } = this.order;
    data = data.map((item: any) => {
      if (item.id === productId) {
        item.qty = action === 'plus' ? item.qty + 1 : item.qty - 1;
      }

      return item;
    });

    this.computeSubTotal(data);
  }

  // 送出訂單
  sendOrder() {
    this.emptyOrder();
    swalPopup.fire({
      title: '訂單已送出',
      icon: 'success',
      showConfirmButton: false
    });
  }

  // 改變 Order$
  changeOrder$(order: any, isStoreLocalStorage?: boolean) {
    this.order$.next(order);
    if (isStoreLocalStorage) { localStorage.setItem('order', JSON.stringify(order)) }
  }
}
