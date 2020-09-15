import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {

  constructor(private pedidosService:PedidosService, private herramienta:HerramientasService, private router:Router) { }

  facturas:any = [];
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {

    this.list_pedidos();
  }

  async list_pedidos(){

    await this.herramienta.presentLoading();

    this.pedidosService.obtenerLosPedidos().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( async res => {
      this.facturas = res;
      console.log(this.facturas);
      if (this.facturas.res == 'el token no coincide') {
        await this.herramienta.presentAlert("Ocurrio un error"); 
      }
      await this.herramienta.dismissLoading();
    },async err => {
      await this.herramienta.dismissLoading();
      console.log(err);
    })

  }

  ver_pedido(factura:any){
    this.pedidosService.pedido = factura;
    this.router.navigate(["tab-pedido"]);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
