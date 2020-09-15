import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { Router } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  constructor(private pedidosService:PedidosService, private herramienta:HerramientasService, private router:Router, private scrollService:ScrollService, private herramientas:HerramientasService) { }

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
    this.router.navigate(["pedido"]);
  }

  async doRefresh(event) {
    await this.herramientas.presentLoading();
    this.pedidosService.obtenerLosPedidos().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.herramientas.dismissLoading();
      this.facturas = res;
      event.target.complete();
      console.log(res);
    },err => {
      this.herramientas.dismissLoading();
      console.log(err);
    });
    console.log('Async operation has ended');
    
  }

  lastX:any
  onScroll(event) {
    if (event.detail.scrollTop > Math.max(0,this.lastX)){
      //subiendo
      this.scrollService.sendScroll('subiendo');
    }else{
      //bajandoconsole.log('le estoy enviando el mensaje a tabs components');
      this.scrollService.sendScroll('bajando');
    }
     this.lastX = event.detail.scrollTop
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
