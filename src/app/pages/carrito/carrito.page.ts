import { Component, OnInit, Renderer2 } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MenuController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  constructor(public carritoService: CarritoService,private renderer:Renderer2,
    private menuCtrl:MenuController,
    public userService:UserService,
    private router:Router,
    public alertController: AlertController,
    private pedidosService:PedidosService,
    private geolocation:Geolocation,
    private herramientas:HerramientasService) {  }

  uri = environment.URI;  
  lista: any = [];
  listaOrdenada: any = [];
  lat:number;
  lon:number;
  cantidadEnCarrito = 0;

  carrito:any = [];
  zonas:any = [];

  private unsubscribe$ = new Subject<void>();

  async ngOnInit() {
    this.cantidadEnCarrito = this.carritoService.cantidadEnCarrito;
    this.carrito = this.carritoService.carrito;
    
    
  };
  

  irHome(){
    this.router.navigate(['tabs/home']);
  }

  irMapa(){
    this.router.navigate(['tabs/mapa']);
  }

  lastX:any
  onScroll(event) {
    if (event.detail.scrollTop > Math.max(0,this.lastX)){
      //subiendo
      this.sendScroll('subiendo');
      
    }else{
      //bajandoconsole.log('le estoy enviando el mensaje a tabs components');
      this.sendScroll('bajando');
      
    }
     this.lastX = event.detail.scrollTop;
  }

  sendScroll(direcion){
    
    let header = document.getElementById('headerCarrito');
    if (direcion === 'subiendo') {
      console.log('subiendo');
      this.renderer.setStyle(header,'margin-top',`-${header.clientHeight}px`); 
      this.renderer.setStyle(header,'transition',`margin-top 400ms`); 
    }else{
      console.log('bajando');
      this.renderer.setStyle(header,'margin-top','0'); 
      this.renderer.setStyle(header,'transition',`margin-top 400ms`);
    }
  }

  aumentar(idPlatillo,idNegocio){
    console.log("entre a aumentar el carrito");
    console.log(idPlatillo);
    console.log(idNegocio);
    const data:any = this.carritoService.aumentarPedido(idPlatillo, idNegocio);
    this.carrito = data.carrito;
    this.cantidadEnCarrito = data.cantidadEnCarrito;
    //this.lista = this.carritoService.aumentar(idPlatillo);
  }

  disminuir(idPlatillo, idNegocio){
    console.log("entre a disminuir el carrito");
    const data:any = this.carritoService.disminurPedido(idPlatillo, idNegocio);
    this.carrito = data.carrito;
    this.cantidadEnCarrito = data.cantidadEnCarrito;
    //this.lista = this.carritoService.disminuir(id);
  }

  eliminar(idPlatillo, idNegocio){
    const data:any = this.carritoService.eliminarPedido(idPlatillo, idNegocio);
    this.carrito = data.carrito;
    this.cantidadEnCarrito = data.cantidadEnCarrito;
    //this.lista = this.carritoService.eliminar<(id);
  }

  valueCheck(idNegocio, idEnvio){
    console.log(idNegocio);
    console.log(idEnvio);
    this.carrito = this.carritoService.valueCheck(idNegocio, idEnvio);
    console.log("modificado",this.carrito);
  }

  async confirmarPedido(idNegocio){

    
    const alert = await this.alertController.create({
      header: 'Selecciona un metodo de pago',
      inputs: [
        {
          name: 'checkbox1',
          type: 'checkbox',
          label: 'Targeta de crédito',
          value: 'credicCard',
          checked: true
        },
        {
          name: 'checkbox2',
          type: 'checkbox',
          label: 'Efectivo',
          value: 'Efectivo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: (value) => {
            console.log('Confirm Ok');
            console.log(value);
            if (value[0] === "credicCard") {
              this.realizarPedido(idNegocio);
            }
            
          }
        }
      ]
    });
    await alert.present();
      
  }

  // getGeolocationClient(idNegocio){
  //   this.geolocation.getCurrentPosition().then((geoposition:Geoposition) =>{
  //     this.lat = geoposition.coords.latitude;
  //     this.lon = geoposition.coords.longitude;
  //     console.log(geoposition);

  //     this.realizarPedido(idNegocio);

  //   });
  // }

  async realizarPedido(idNegocio){
    let negocioPedido = await this.carrito.filter(negocio => negocio.idNegocio === idNegocio);
    console.log(negocioPedido[0]);
    this.carritoService.negocioPedido = negocioPedido[0];
    this.router.navigate(["/pay-method"]);
    // this.pedidosService.nuevoPedido(negocioPedido[0],this.lon,this.lat).pipe(
    //   takeUntil(this.unsubscribe$))
    // .subscribe( async res => {
    //   const data:any = res;
    //   console.log(res);
    //   await this.herramientas.dismissLoading();
    //   if (data.res !== 'forbiden') {
    //     if (data.res === 'Pedido realizado') {
    //       this.enviarPedidoWS();
    //     }else{
  
    //     }
    //   }
    // },async err => {
    //   console.log(err);
    //   await this.herramientas.dismissLoading();
    // });
  }

  toggleMenu(){
    this.menuCtrl.toggle();
  }

  id = '';

  ordenar(){
    
    let cont = 0;
    let nombre = '';
    let mismoNegocio = true;
    const tamanoLista = this.lista.length;

    let idNegocio = '';

    if (this.lista.length !== 1) {
      for (const iterator of this.lista) {
        if (cont === 0) {
          idNegocio = iterator.idNegocio;
        }else{
          if (idNegocio !== iterator.idNegocio) {
            mismoNegocio = false;
            break;
          }
        }
        cont = 1;
      }
    }

    if (mismoNegocio) {
      this.presentAlertConfirm('!Confirmar pedido¡','¿Deseas realizar el pedido?');
    }else{
      this.presentAlertConfirm('Pedido a más de un establecimiento','¿Deseas realizar el pedido a diferentes establecimientos?');
    }
  }

  async presentAlertConfirm(header,message) {
    const alert = await this.alertController.create({
      header,
      message, 
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Ordenar',
          handler: () => {
            console.log('Confirm Okay');
            this.geolocationClient();
          }
        }
      ]
    });

    await alert.present();
  }

  geolocationClient(){
    this.geolocation.getCurrentPosition().then((geoposition:Geoposition) =>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      console.log(geoposition);

      //this.nuevoPedido();

    });
  }

  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
