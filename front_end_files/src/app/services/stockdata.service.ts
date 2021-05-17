import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'; 
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { StockData } from '../models/stocksData.model';



@Injectable({
    providedIn: 'root'
  })
  export class StocksDataService {
    private url = "./assets/data/";

    constructor(private http: HttpClient){}

    getStockData(temp: string): Observable<StockData[]>{
      return this.http.get<StockData[]>(this.url + temp);
  }

  }