import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IAsiento } from '../../../model/asiento.interface';
import { AsientoService } from '../../../service/asiento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-asiento-admin-selector-unrouted',
  templateUrl: './asiento.admin.selector.unrouted.component.html',
  styleUrls: ['./asiento.admin.selector.unrouted.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class AsientoAdminSelectorUnroutedComponent implements OnInit {
  oPage: IPage<IAsiento> | null = null;
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
  //
  readonly dialogRef = inject(MatDialogRef<AsientoAdminSelectorUnroutedComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  constructor(
    private oAsientoService: AsientoService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }
  ngOnInit() {
    this.getPage();
  }
  getPage() {
    this.oAsientoService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAsiento>) => {
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
 
  select(oAsiento: IAsiento) {
    
      // estamos en ventana emergente: no navegar
      // emitir el objeto seleccionado
      this.dialogRef.close(oAsiento);
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