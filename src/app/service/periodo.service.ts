import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IPeriodo } from '../model/periodo.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  serverURL: string = serverURL + '/periodo';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IPeriodo>> {
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
    return this.oHttp.get<IPage<IPeriodo>>(URL, httpOptions);

  }

  get(id: number): Observable<IPeriodo> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IPeriodo>(URL);
  }

  create(oPeriodo: IPeriodo): Observable<IPeriodo> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.post<IPeriodo>(URL, oPeriodo);
  }

  update(oPeriodo: IPeriodo): Observable<IPeriodo> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IPeriodo>(URL, oPeriodo);
  }

  getOne(id: number): Observable<IPeriodo> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IPeriodo>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL + "/" + id);
  }

  flip(oPeriodo: IPeriodo): Observable<IPeriodo> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/flip';
    return this.oHttp.put<IPeriodo>(URL + "/" + oPeriodo.id, oPeriodo);
  }

}
