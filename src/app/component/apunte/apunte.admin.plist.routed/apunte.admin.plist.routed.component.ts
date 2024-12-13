import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IApunte } from '../../../model/apunte.interface';
import { ApunteService } from '../../../service/apunte.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoApunteAdminSelectorUnroutedComponent } from '../../tipoapunte/tipoapunte.admin.selector.unrouted/tipoapunte.admin.selector.unrouted.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apunte.admin.routed',
  templateUrl: './apunte.admin.plist.routed.component.html',
  styleUrls: ['./apunte.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ApunteAdminPlistRoutedComponent implements OnInit {
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
  private debounceSubject = new Subject<string>();
  readonly dialog = inject(MatDialog);

  constructor(
    private oApunteService: ApunteService,
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
    this.oApunteService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
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

  openModal(oApunte: IApunte) {

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


  showTipocuentaSelectorModal(id: number | undefined) {
    if (id) {
      const dialogRef = this.dialog.open(TipoApunteAdminSelectorUnroutedComponent, {
        height: '800px',
        maxHeight: '1200px',
        width: '80%',
        maxWidth: '90%',

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log(result);

          /*   ----> ejercicio
          // sustituir el tipo de apunte en el id de apunte seleccionado en oPage.content        
          this.oPage?.content.forEach((apunte) => {
            if (apunte.id === id) {
              apunte.tipoapunte = result;
            }
          });
          */

          // llamada al servidor
          this.oApunteService.setTipoapunte(id, result.id).subscribe({
            next: (response: IApunte) => {
              console.log(response);
              this.getPage();
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          });

        }
      });
      return false;
    } else {
      return false;
    }

  }


}
