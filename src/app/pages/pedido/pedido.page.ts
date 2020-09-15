import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  pedido:any = [];
  iva = 0;
  visto :boolean = false;
  aceptado:boolean = false;
  preparacion:boolean = false;
  enviado:boolean = false;
  entregado:boolean = false;
  cancelado:boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private pedidosService:PedidosService) { }

  ngOnInit() {
    this.pedido = this.pedidosService.pedido;
    this.iva = this.pedido.totalSinIva * 0.1;
    if (this.pedido.visto.estado === true) {
      this.visto = true;
    }
    if (this.pedido.aceptado.estado === true) {
      this.aceptado = true;
    } 
    if(this.pedido.enProceso.estado === true){
      this.aceptado = true;
      this.preparacion = true;
    } 
    if(this.pedido.enviado.estado === true){
      this.aceptado = true;
      this.preparacion = true;
      this.enviado = true;
    } 
    if(this.pedido.entregado.estado === true){
      this.aceptado = true;
      this.preparacion = true;
      this.enviado = true;
      this.entregado = true;
    } 
    if(this.pedido.cancelado.estado === true){
      
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
