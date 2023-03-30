import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SwalDefaultService } from '@services/swal-default.service';

let swalPopup: any;
let swalToast: any;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  order: Array<any> = [];
  order$ = new BehaviorSubject<any>(false);
  constructor(
    private swalDefaultService: SwalDefaultService
  ) {
    swalPopup = this.swalDefaultService.popupDefault;
    swalToast = this.swalDefaultService.toastDefault;
  }

  emptyOrder() {
    this.order = [];
    localStorage.removeItem('order');
    this.order$.next(false);
  }

  getOrder() {
    console.log('getorder')
    let orderStr = localStorage.getItem('order');
    if (orderStr) {
      const order = JSON.parse(orderStr);
      this.order = order.data;
      this.changeOrder$(order);
    }
  }

  updateOrder(action: 'add' | 'del', product: any) {
    const { id, price } = product;

    console.log(id, this.order)
    const findOrderIndex = this.order.findIndex((item: any) => item.id === id);
    console.log(findOrderIndex)
    if (action === 'add') {
      if (findOrderIndex === -1) {
        const qty = 1;
        this.order.push({ id, price, qty });
      } else {
        this.order[findOrderIndex].qty++;
      }
    } else if (action === 'del' && findOrderIndex > -1) {
      console.log(findOrderIndex)
      this.order.splice(findOrderIndex, 1);
    }


    let subTotal = this.order.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price * currentValue.qty, 0);
    const addOrder = {
      id: new Date().getTime(),
      data: this.order,
      subTotal
    };

    this.changeOrder$(addOrder, true);

    swalToast.fire({
      icon: 'success',
      title: `成功${action === 'add' ? '新增' : '刪除'}該品項`
    });
  }

  sendOrder() {
    this.emptyOrder();
    swalPopup.fire({
      title: '訂單已送出',
      icon: 'success',
      //confirmButtonText: '立即登入',
      showConfirmButton: false
    });
  }

  changeOrder$(data: any, isStoreLocalStorage?: boolean) {
    this.order$.next(data);
    if (isStoreLocalStorage) { localStorage.setItem('order', JSON.stringify(data)) }
  }
}
