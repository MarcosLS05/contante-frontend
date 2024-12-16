import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IApunte } from '../../../model/apunte.interface';
import { ApunteService } from '../../../service/apunte.service';
import { TipoApunteService } from '../../../service/tipoapunte.service';
import { ITipoapunte } from '../../../model/tipoapunte.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ISumas } from '../../../model/sumas.interface';

@Component({
  selector: 'app-apunte.admin.routed',
  templateUrl: './apunte.xtipoapunte.admin.plist.routed.component.html',
  styleUrls: ['./apunte.xtipoapunte.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ApunteXTipoapunteAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IApunte> | null = null;
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
  oTipoapunte: ITipoapunte = {} as ITipoapunte;
  private debounceSubject = new Subject<string>();
  oTotal: ISumas = {} as ISumas;

  constructor(
    private oApunteService: ApunteService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oTipoapunteService: TipoApunteService
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    this.oActivatedRoute.params.subscribe((params) => {
      this.oTipoapunteService.get(params['id']).subscribe({
        next: (oTipoapunte: ITipoapunte) => {
          this.oTipoapunte = oTipoapunte;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });

      this.oActivatedRoute.params.subscribe((params) => {
        this.oApunteService.getTotalApuntesXTipoapunte(params['id']).subscribe({
          next: (oSuma: ISumas) => {
            this.oTotal = oSuma;
            console.log(this.oTotal);            
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
      })


    })
  }

  ngOnInit() {
  }

  getPage() {
    this.oApunteService
      .getPageXTipoApunte(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oTipoapunte.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IApunte>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oApunte: IApunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/apunte/edit', oApunte.id]);
  }

  view(oApunte: IApunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/apunte/view', oApunte.id]);
  }

  remove(oApunte: IApunte) {
    this.oRouter.navigate(['admin/apunte/delete/', oApunte.id]);
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

}

