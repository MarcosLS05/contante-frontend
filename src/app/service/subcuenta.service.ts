import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ISubcuenta } from '../model/subcuenta.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SubcuentaService {

  serverURL: string = serverURL + '/subcuenta'; 

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ISubcuenta>> {
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
    return this.oHttp.get<IPage<ISubcuenta>>(URL, httpOptions);
  }

  get(id: number): Observable<ISubcuenta> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ISubcuenta>(URL);
  }

  create(oSubcuenta: ISubcuenta): Observable<ISubcuenta> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ISubcuenta>(URL, oSubcuenta);
  }

  update(oSubcuenta: ISubcuenta): Observable<ISubcuenta> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ISubcuenta>(URL, oSubcuenta);
  }

  getOne(id: number): Observable<ISubcuenta> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/subcuenta';
    URL += '/' + id;
    return this.oHttp.get<ISubcuenta>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/subcuenta/' + id);
  }

  countSubcuentaXTipocuenta(id: number): Observable<number> {
    return this.oHttp.get<number>(this.serverURL + "/xtipocuenta/" + id);
  }
    

}
