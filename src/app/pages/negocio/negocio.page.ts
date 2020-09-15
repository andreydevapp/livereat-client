import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NegociosService } from '../../services/negocios.service';
import { PlatillosService } from '../../services/platillos.service';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Crop } from '@ionic-native/crop/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-negocio',
  templateUrl: './negocio.page.html',
  styleUrls: ['./negocio.page.scss'],
})
export class NegocioPage implements OnInit {

  uri = environment.URI;
  idNegocio;
  nombre;//negocio
  imagen;//negocio
  lon;//negocio
  lat;//negocio
  platillos:any = [];
  tipo = "Platillo";

  negocio:any = [];
  envio:any = [];
  cantidadEnCarrito = 0;

  buscadorActivo: boolean = false;
  fileTransfer: FileTransferObject;


  private unsubscribe$ = new Subject<void>();

  constructor(public modalController: ModalController,
      private renderer:Renderer2,
      public carritoService:CarritoService,
      private router: Router,
      private negocioService:NegociosService,
      private platillosService:PlatillosService,
      private herramientas:HerramientasService,
      private route: ActivatedRoute,
      private transfer: FileTransfer, private file: File) { }

  ngOnInit() {

    this.idNegocio = this.negocioService.negocio.idNegocio;
    this.nombre = this.negocioService.negocio.nombre;
    this.imagen = this.negocioService.negocio.imagen;
    this.lon = this.negocioService.negocio.lon;
    this.lat = this.negocioService.negocio.lat;
    this.envio = this.negocioService.negocio.envios;
    console.log("envio",this.negocioService.negocio.envios);
    this.obtenerLosPlatillos();
    this.cantidadEnCarrito = this.carritoService.cantidadEnCarrito;
    
    /*
    if (this.abiertoDesde === 'publicaciones') {
      this.negociosService.get_Negocio(this.idNegocio).subscribe(res => {
        this.negocio = res;
        this.nombre = this.negocio.nombre;
        this.imagen = this.negocio.imagen;

      },err => {
        console.log(err);
      });
    }
    */

    
  }

  async obtenerLosPlatillos(){
    this.platillos = [];
    await this.herramientas.presentLoading();
    this.platillosService.obtenerTodosLosPlatillos(this.idNegocio,this.tipo).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( async res => {
      this.platillos = res;
      await this.herramientas.dismissLoading();
      console.log(this.platillos);
    },err => {
      console.log(err);
    })
  }

  irAlCarrito(){
    this.router.navigate(['/carrito']);
    this.modalController.dismiss();
  }

  segmentChanged(ev: any) {
    this.tipo = ev.detail.value;
    this.obtenerLosPlatillos();
    console.log('Segment changed', ev);
  }

  lastX:any
  onScroll(event) {
    let header = document.getElementById('headerNegocio');
    let tabs = document.getElementById('toolbarNegocio');
    if (event.detail.scrollTop > Math.max(0,this.lastX)){
      //subiendo
      this.renderer.setStyle(header,'margin-top',`-${header.clientHeight}px`); 
      this.renderer.setStyle(header,'transition',`margin-top 400ms`); 
    }else{
      this.renderer.setStyle(header,'margin-top','0'); 
      this.renderer.setStyle(header,'transition',`margin-top 400ms`);
      
    }
     this.lastX = event.detail.scrollTop;
  }

  agregarAlCarrito(id,nombre,imagen,imagenMin,precio){
    const payload = {
      idNegocio: this.idNegocio,
      nombreNegocio: this.nombre,
      imgUrlNegocio: this.imagen,
      idPlatillo: id,
      imgUrlPlatillo: imagen, 
      imgUrlPlatilloMin: imagenMin, 
      nombrePlatillo: nombre,
      precio,
      cantidad:1,
      lon:this.lon,
      lat:this.lat,
      zonasDeEnvio:this.envio
    };
    this.carritoService.agregarCarrito(payload);
    this.cantidadEnCarrito ++;
  }

  //shared
  
  download(url) {
    console.log("si entre");
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.download(url, this.file.externalRootDirectory+"jpg").then(
      (data) => {
        console.log("descarga completada");
      }
    ).catch(
      (err) =>{
        console.log("ocurrio un error", err);
      }
    )
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
