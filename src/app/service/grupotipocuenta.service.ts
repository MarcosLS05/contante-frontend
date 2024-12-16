import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IGrupotipocuenta } from '../model/grupotipocuenta.interface';

@Injectable({
  providedIn: 'root',
})
export class GrupoTipoCuentaService {
  serverURL: string = serverURL + '/grupoTipoCuenta';

  constructor(private oHttp: HttpClient) {}

  delete(idb: number, idtc: number): Observable<number> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + idb + '/' + idtc;
    return this.oHttp.delete<number>(URL);
  }

  create(oGrupotipocuenta: IGrupotipocuenta): Observable<IGrupotipocuenta> {
    //hack para evitar error de tipo en el servidor
    //tipocuenta
    oGrupotipocuenta.tipocuenta.grupotipocuentas = [];
    oGrupotipocuenta.tipocuenta.cuentas = [];
    //balance
    oGrupotipocuenta.balance.grupotipoasientos = [];
    oGrupotipocuenta.balance.gruposubcuentas = [];
    oGrupotipocuenta.balance.grupotipocuentas = [];
    oGrupotipocuenta.balance.grupocuentas = [];
    oGrupotipocuenta.balance.grupotipoapuntes = [];
    //----
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IGrupotipocuenta>(URL, oGrupotipocuenta);
  }
}
