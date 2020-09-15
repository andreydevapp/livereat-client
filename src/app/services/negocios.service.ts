import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment,cliente} from '../../environments/environment.prod';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private http:HttpClient,private userService:UserService) { }

  negocio = {
    idNegocio:"",
    nombre:"",
    imagen:"",
    lon:0,
    lat:0,
    envios:[]
  }

  get_Negocios(){
    console.log("token", this.userService.usuario.token);

    const user = this.userService.getUsuario();
    
    return this.http.get(`${environment.URI}cliente/get_negocios/${this.userService.usuario.token}`,);
  }

  get_Negocio(id){
    const payload = {
      token: this.userService.usuario.token,
      id
    }
    return this.http.post(`${environment.URI}get_negocio`,payload);
  }

  // parametros entre componentes
  

}
