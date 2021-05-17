import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'; 
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {Stock} from './stocks.model'; 
import {Chart} from 'node_modules/chart.js'; 

@Injectable({
    providedIn: 'root'
  })
  export class StocksService {
    private url = "./assets/data/";
    private _url = "./assets/data/files2send.txt";

    constructor(private http: HttpClient){}

    getStockData(temp: string): Observable<Stock[]>{
        return this.http.get<Stock[]>(this.url + temp);
    }

    getStockSelection(){
      return this.http.get(this._url); 
    }

  }