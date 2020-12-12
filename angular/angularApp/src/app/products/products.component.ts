import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  products: any[] = [];
  constructor() { }

  ngOnInit() {
  this.products=[{id:1,name:"Compute HP 54",price:7860},
    {id:1,name:"Printer LX ER",price:1200},
    {id:1,name:"Smart phone sumsung s20",price:120000}
  ]
  }

}
