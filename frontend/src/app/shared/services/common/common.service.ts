import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private snack: MatSnackBar) { }
  callSnackBarMessage(message,status){
    this.snack.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: status == 'success' ?['custom-snack-bar-success'] : status == 'info' ? ['custom-snack-bar-info']: ['custom-snack-bar']
    });
  }
}
