import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment, http_pedidos } from 'src/environments/environment.prod';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http:HttpClient, private userService:UserService, private wsService:WebsocketService) { }

  pedido:any = [];

  nuevoPedido(negocio:object, lon, lat, propietario, numCard, cvv, ano, mes){
    const payload = {
      negocio,
      lonCliente:lon,
      latCliente:lat,
      token:this.userService.usuario.token,
      idCliente:this.userService.usuario.id,
      propietario,
      numCard,
      cvv,
      ano,
      mes
    };
    console.log(payload);
    return this.http.post(`${environment.URI}${http_pedidos.nuevo_pedido}`,payload);
  }

  obtenerLosPedidos(){
    const payload = {
      token:this.userService.usuario.token,
      idCliente:this.userService.usuario.id
    };
    return this.http.post(`${environment.URI}${http_pedidos.obtener_pedido}`,payload);
  }

  obtenerEstadoDelPedido(idNegocio,idFactura){
    const payload = {
      token:this.userService.usuario.token,
      idCliente:this.userService.usuario.id,
      idNegocio,
      idFactura
    };
    return this.http.post(`${environment.URI}${http_pedidos.obtener_pedido}`,payload);
  }

  // socket

  wsRealizarPedido(idNegocio){
    const idCliente = this.userService.usuario.id;
    return this.wsService.emit( 'enviar-cantidad-pedido',{idNegocio,idCliente});
    
  }

}
