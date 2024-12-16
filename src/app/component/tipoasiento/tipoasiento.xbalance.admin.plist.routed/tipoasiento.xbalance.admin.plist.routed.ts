import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';
import { IBalance } from '../../../model/balance.interface';
import { BalanceService } from '../../../service/balance.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { TipoasientoAdminSelectorUnroutedComponent } from '../tipoasiento.admin.selector.unrouted/tipoasiento.admin.selector.unrouted.component';

declare let bootstrap: any;

@Component({
  selector: 'app-tipoasiento-admin-plist-routed',
  templateUrl: './tipoasiento.xbalance.admin.plist.routed.html',
  styleUrls: ['./tipoasiento.xbalance.admin.plist.routed.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TrimPipe,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class TipoasientoXbalanceAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ITipoasiento> | null = null;
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
  oBalance: IBalance = {} as IBalance;
  oTipoasiento: ITipoasiento = {} as ITipoasiento;
  //
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  //

  private debounceSubject = new Subject<string>();
  constructor(
    private oTipoAsientoService: TipoAsientoService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oBalanceService: BalanceService,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.nPage = 0;
      this.getPage();
    });
    // get id from route admin/tipoAsiento/plist/xbalance/:id
    this.oActivatedRoute.params.subscribe((params) => {
      this.oBalanceService.get(params['id']).subscribe({
        next: (oBalance: IBalance) => {
          this.oBalance = oBalance;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    });
  }

  ngOnInit() {}

  getPage() {
    this.oTipoAsientoService
      .getPageXBalance(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oBalance.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<ITipoasiento>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
          this.getPage();
        },
        error: (err) => {
          console.log(err);
        },
      });
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

  quitar(oTipoasiento: ITipoasiento, oBalance: IBalance) {
    this.oTipoAsientoService.quitarBalance(oTipoasiento, oBalance).subscribe({
      next: () => {
        this.getPage();
      },
    });
  }

  agregar(oTipoasiento: ITipoasiento, oBalance: IBalance) {
    this.oTipoAsientoService.agregarBalance(oTipoasiento, oBalance).subscribe({
      next: () => {
        this.getPage();
      },
    });
  }

  showTipoasientoSelectorModal() {
    const dialogRef = this.dialog.open(
      TipoasientoAdminSelectorUnroutedComponent,
      {
        height: '800px',
        maxHeight: '1200px',
        width: '80%',
        maxWidth: '90%',
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.oTipoAsientoService.agregarBalance(result, this.oBalance).subscribe({
        next: () => {
          this.getPage();
        },
      });
    });
    return false;
  }
}
