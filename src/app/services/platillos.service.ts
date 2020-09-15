import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment, http_platillo } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlatillosService {

  constructor(private http:HttpClient, private userService:UserService) { }

  obtenerTodosLosPlatillos(idNegocio,tipo){

    const payload = {
      idNegocio,
      tipo,
      token:this.userService.usuario.token
    }

    return this.http.post(`${environment.URI}${http_platillo.obtener}`,payload);
  
  }

}
