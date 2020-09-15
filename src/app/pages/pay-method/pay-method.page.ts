import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { AlertController } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pay-method',
  templateUrl: './pay-method.page.html',
  styleUrls: ['./pay-method.page.scss'],
})
export class PayMethodPage implements OnInit {

  constructor(private carritoService:CarritoService,private herramientas:HerramientasService,private pedidosService:PedidosService,public alertController: AlertController,
  private geolocation:Geolocation) { }

  negocioPedido:any = [];
  lat:number;
  lon:number;
  ista: any = [];

  ngOnInit() {
    this.negocioPedido = this.carritoService.negocioPedido;
    console.log(this.negocioPedido);
  }

  numCard:string = "";
  cvv:string = "";
  propietario:string = "";
  ano:any = "2019-1-1";
  mes:any = "2019-1-1"; 

  private unsubscribe$ = new Subject<void>();

  changeValuesCard($event){
    if (this.numCard[0] === "4") {
      console.log("es visa");
      const visa = document.getElementById("img-visa");
      const masterCard = document.getElementById("img-mastercard");
      visa.classList.remove("difuminar");
      masterCard.classList.add("difuminar");
    }
    else if (this.numCard[0] === "5") {
      if (this.numCard[1] === "1" || this.numCard[1] === "2" || this.numCard[1] === "3" ||this.numCard[1] === "4") 
      {
        console.log("es mastercard");
        const visa = document.getElementById("img-visa");
        const masterCard = document.getElementById("img-mastercard");
        visa.classList.add("difuminar");
        masterCard.classList.remove("difuminar");
      }else{
        const visa = document.getElementById("img-visa");
        const masterCard = document.getElementById("img-mastercard");
        visa.classList.remove("difuminar");
        masterCard.classList.remove("difuminar");
        }  
    }
    else{
      const visa = document.getElementById("img-visa");
      const masterCard = document.getElementById("img-mastercard");
      visa.classList.remove("difuminar");
      masterCard.classList.remove("difuminar");
    }
    console.log($event);
  }

  cardSelected(opc){
    if (opc === 1) {
      //visa
      this.numCard = "4242424242424242";
      this.cvv = "257";
    }else if (opc === 2) {
      //mastercard
      this.numCard = "5281037048916168";
      this.cvv = "043";
    }else{
      //american
      this.numCard = "342498818630298";
      this.cvv = "3156";
    }

    if (this.numCard[0] === "4") {
      console.log("es visa");
      const visa = document.getElementById("img-visa");
      const masterCard = document.getElementById("img-mastercard");
      visa.classList.remove("difuminar");
      masterCard.classList.add("difuminar");
    }
    else if (this.numCard[0] === "5") {
      if (this.numCard[1] === "1" || this.numCard[1] === "2" || this.numCard[1] === "3" ||this.numCard[1] === "4") 
      {
        console.log("es mastercard");
        const visa = document.getElementById("img-visa");
        const masterCard = document.getElementById("img-mastercard");
        visa.classList.add("difuminar");
        masterCard.classList.remove("difuminar");
      }else{
        const visa = document.getElementById("img-visa");
        const masterCard = document.getElementById("img-mastercard");
        visa.classList.remove("difuminar");
        masterCard.classList.remove("difuminar");
        }  
    }
    else{
      const visa = document.getElementById("img-visa");
      const masterCard = document.getElementById("img-mastercard");
      visa.classList.remove("difuminar");
      masterCard.classList.remove("difuminar");
    }
  }

  async confirmarPedido(){
    console.log("año",new Date(this.ano).getFullYear());
    console.log("mes",new Date(this.mes).getMonth()+1);
    


    const alert = await this.alertController.create({
      header: "Confirmar pedido",
      message: `¿Deseas realizar el pedido?`, 
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
            this.getGeolocationClient();
          }
        }
      ]
    });

    await alert.present();
      
  }

  getGeolocationClient(){
    this.geolocation.getCurrentPosition().then((geoposition:Geoposition) =>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      console.log(geoposition);
      this.realizarPedido();

    });
  }

  async realizarPedido(){
    await this.herramientas.presentLoading();
  
    this.pedidosService.nuevoPedido(this.negocioPedido,this.lon,this.lat,this.propietario,this.numCard,this.cvv,new Date(this.ano).getFullYear(),new Date(this.mes).getMonth()+1).pipe(
      takeUntil(this.unsubscribe$))
    .subscribe( async res => {
      const data:any = res;
      console.log(res);
      await this.herramientas.dismissLoading();
      if (data.res !== 'forbiden') {
        if (data.res === 'Pedido realizado') {
          this.herramientas.presentAlert("Pedido realizado");
        }else{
  
        }
      }
    },async err => {
      console.log(err);
      await this.herramientas.dismissLoading();
    });
  }

  // async enviarPedidoWS(){
  //   let id = '';
  //   for (const iterator of this.lista) {
  //     if (iterator.idNegocio !== id) {
  //       this.pedidosService.wsRealizarPedido(this.id);
  //       id = iterator.idNegocio;
  //     }
  //   }
  
  //   this.pedidosService.wsRealizarPedido(this.id);
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
