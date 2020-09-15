import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.page.html',
  styleUrls: ['./estado-pedido.page.scss'],
})
export class EstadoPedidoPage implements OnInit {

  pedidos:any = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private pedidosService:PedidosService,
    private herramienta:HerramientasService) { }

  ngOnInit() {
    this.list_pedidos();
  }

  async list_pedidos(){

    await this.herramienta.presentLoading();

    this.pedidosService.obtenerLosPedidos().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( async res => {
      this.pedidos = res;
      await this.herramienta.dismissLoading();
      console.log(this.pedidos);
    },async err => {
      await this.herramienta.dismissLoading();
      console.log(err);
    })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
