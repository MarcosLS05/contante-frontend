import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ITipocuenta } from '../model/tipocuenta.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TipoCuentaService {

serverURL: string = serverURL + '/tipoCuenta';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ITipocuenta>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ITipocuenta>>(URL, httpOptions);
  }

  get(id: number): Observable<ITipocuenta> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ITipocuenta>(URL);
  }

  create(oTipoCuenta: ITipocuenta): Observable<ITipocuenta> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipocuenta>(URL, oTipoCuenta);
  }

  update(oTipoCuenta: ITipocuenta): Observable<ITipocuenta> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipocuenta>(URL, oTipoCuenta);
  }

  getOne(id: number): Observable<ITipocuenta> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ITipocuenta>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL + '/' + id);
  }

  getPageSubcuenta(id: number){
    return this.oHttp.get<number>(this.serverURL + "/subcuenta/" + id);
  }


  getXBalance(id: number): Observable<ITipocuenta> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/xbalance/' + id;
    return this.oHttp.get<ITipocuenta>(URL);
  }


  getPageXBalance(
    page: number,
    size: number,
    id: number
  ): Observable<IPage<ITipocuenta>> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/xbalance/' + id;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    
    return this.oHttp.get<IPage<ITipocuenta>>(URL, httpOptions);
  }

  getPageXBalanceNoTiene(
    page: number,
    size: number,
    id: number
  ): Observable<IPage<ITipocuenta>> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/xbalancenotiene/' + id;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    
    return this.oHttp.get<IPage<ITipocuenta>>(URL, httpOptions);
  }
}
