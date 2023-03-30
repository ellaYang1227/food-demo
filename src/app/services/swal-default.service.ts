import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalDefaultService {
  // popup
  public get popupDefault(): any {
    return Swal.mixin({
      heightAuto: false,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary',
      },
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '關閉',
      buttonsStyling: false,
      showCloseButton: true,
      reverseButtons: true,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }

  // toast
  public get toastDefault(): any {
    return Swal.mixin({
      toast: true,
      position: window.screen.width >= 768 ? 'bottom-end' : 'bottom',
      showConfirmButton: false,
      showCancelButton: false,
      width: '250px',
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }

  constructor() { }
}
