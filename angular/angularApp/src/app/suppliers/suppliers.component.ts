import {Component, OnInit} from '@angular/core';
import {SupplierService} from '../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
   suppliers: any;
   errorMessage:any;

  constructor(private supplierService: SupplierService) {
  }
  ngOnInit():void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    }, err => {
      this.errorMessage=err.error.message;
      console.log(err);
    });
  }

}
