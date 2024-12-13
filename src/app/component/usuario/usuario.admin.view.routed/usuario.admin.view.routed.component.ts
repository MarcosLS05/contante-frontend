import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-usuario.admin.view.routed',
  templateUrl: './usuario.admin.view.routed.component.html',
  styleUrls: ['./usuario.admin.view.routed.component.css']
})
export class UsuarioAdminViewRoutedComponent implements OnInit {
  //
  id: number = 0;
  route: string = '';
  oUsuario: IUsuario = {} as IUsuario;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;
  //
  constructor(private oActivatedRoute: ActivatedRoute, private oUsuarioService: UsuarioService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];

    //llamada

    this.oUsuarioService.getApuntes(this.id).subscribe({
      next: (data: number) => {
        this.numeroApuntes = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });

    this.oUsuarioService.getApuntesAbiertos(this.id).subscribe({
      next: (data: number) => {
        this.numeroApuntesAbiertos = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });

    this.getOne();
  }

  getOne() {
    this.oUsuarioService.getOne(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
    });
  }
}