import { ITipoapunte } from './../../../model/tipoapunte.interface';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubcuentaService } from '../../../service/subcuenta.service';

@Component({
  selector: 'app-tipocuenta-admin-routed',
  templateUrl: './tipocuenta.admin.plist.routed.component.html',
  styleUrls: ['./tipocuenta.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})

export class TipocuentaAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ITipocuenta> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();
  oTipocuenta: ITipocuenta = {} as ITipocuenta;
  numeroSubcuentas: number = 0;
  id: number = 0;
  arrNumSubcuentas: Number[] = [];

  constructor(
    private oTipoCuentaService: TipoCuentaService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oSubcuentaService: SubcuentaService
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getOne() {
    this.oTipoCuentaService.getOne(this.id).subscribe({
      next: (data: ITipocuenta) => {
        this.oTipocuenta = data;

      },
    });
  }

  getPage() {
    this.oTipoCuentaService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<ITipocuenta>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );

          this.arrNumSubcuentas = [];
          oPageFromServer.content.forEach(element => {
            this.oSubcuentaService.countSubcuentaXTipocuenta(element.id).subscribe({
              next: (data: number) => {
                // add to array                
                this.arrNumSubcuentas.push(data);
              }
            })

          });

        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oTipoCuenta: ITipocuenta) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipoCuenta/edit', oTipoCuenta.id]);
  }

  view(oTipoCuenta: ITipocuenta) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipoCuenta/view', oTipoCuenta.id]);
  }

  remove(oTipoCuenta: ITipocuenta) {
    this.oRouter.navigate(['admin/tipoCuenta/delete/', oTipoCuenta.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }

  getPageSubcuenta(id: number) {
    this.oTipoCuentaService.getPageSubcuenta(id).subscribe({
      next: (data: number) => {
        this.numeroSubcuentas = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

}
