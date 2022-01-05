import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { AppDataState, DataStateEnum } from 'src/app/state/product.state';
import { catchError, map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
//deuxieme methode
//products$:Observable<Product[]> |null=null;

//troisieme methode
products$:Observable<AppDataState<Product[]>> |null=null
readonly DataStateEnum=DataStateEnum;

  //premiere solution
  //products?:Product[];

//products:Product[]|null=null
  constructor(private productService:ProductsService) { }

  ngOnInit(): void {
  }
//premiere solution 
  // getAllProducts(){
  //   this.productService.getAllProducts().subscribe(
  //     data=>{
  //       this.products=data;
  //     },err=>{
  //       console.log(err);
  //     }
  //   )
  // }


  //deuxieme solution
  /*getAllProducts(){
    this.products$=this.productService.getAllProducts();
  }*/

  getAllProducts(){
    this.products$=this.productService.getAllProducts().pipe(
        map(data=>({dataState:DataStateEnum.LOADED, data:data})),
        startWith({dataState:DataStateEnum.LOADING}),
        catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    )  
  }
  getSelectedProducts(){
    this.products$=this.productService.getSelectedProducts().pipe(
      map(data=>({dataState:DataStateEnum.LOADED, data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
  )  
  }

  getAvailableProducts(){
    this.products$=this.productService.getAvailableProducts().pipe(
      map(data=>({dataState:DataStateEnum.LOADED, data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
  )  
  }

  onSearch(dataForm:any){
    this.products$=this.productService.searchProducts(dataForm.keyword).pipe(
      map(data=>({dataState:DataStateEnum.LOADED, data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
  )

  }

  onSelect(p:Product){
    this.productService.select(p).subscribe(
      data=> {
        p.selected=data.selected;
        this.getAllProducts(); 
      
      }
    )


  }

  onDelete(p:Product){
    var c =confirm("Etes vous sur de vouloir supprimer?")
    if(c==true)
    this.productService.deletep(p).subscribe(
      data=>{
        this.getAllProducts();
      }
    )

  }





}
