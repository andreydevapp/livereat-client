import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';
import { NavController, ModalController } from '@ionic/angular';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { NegociosService } from 'src/app/services/negocios.service';
import { Router } from '@angular/router';

declare var mapboxgl:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  modalPresent = false;

  lat:number;
  lon:number;

  map:any;

  constructor(private navCtrl:NavController,
    private geolocation:Geolocation,
    private scrollService:ScrollService,
    public modalController: ModalController,
    public negociosService:NegociosService,
    private router:Router,
    private renderer:Renderer2) { }


  ngOnInit() {
    this.onScroll();
  }

  onScroll() {
    this.scrollService.sendScroll('bajando');
  }

  sliderConfig = {
    spaceBetween:-10,
    centeredSlides:true,
    slidesPerView:1.6
  };

  cateorias = [
    {categoria:'cazados',
    expanded:true,
    productos:[
      {id:'1',nombre:'cazado de bistec de res',precio:1500},
      {id:'2',nombre:'cazado de chuleta de cerdo',precio:1600},
      {id:'3',nombre:'cazado de posta de cerdo',precio:1400},
      {id:'4',nombre:'cazado de higado',precio:1000},
      {id:'5',nombre:'cazado de pollo',precio:1200}
    ]},
    {categoria:'ensaladas',
    expanded:true,
    productos:[
      {id:'1',nombre:'ensalada de carnivoro',precio:1500},
      {id:'2',nombre:'ensalada fria',precio:1600},
      {id:'3',nombre:'ensalada tipica',precio:1400}
    ]},
    {categoria:'bebidas',
    expanded:true,
    productos:[
      {id:'1',nombre:'coca-cola 1lt',precio:1500}
    ]},
  ];

  cazados = [
    
  ];

  async ngAfterViewInit(){
    this.geolocation.getCurrentPosition().then((geoposition:Geoposition) =>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      console.log(geoposition);

      this.cargar_Negocios();

    });
  }

  cargar_Negocios(){
    this.negociosService.get_Negocios().subscribe(res=>{
      this.negocios = res;
      this.cargarMapa();
      console.log(res);
    },err=>{

    })
  }

  cargarMapa(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV5ZGV2byIsImEiOiJjazJmMWh1aDAwZnB2M21xd2U4cjhvYW82In0.vHZ62CmExD5nlIOQSA3DRg';
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [this.lon, this.lat], // starting position [lng, lat]
      zoom: 16 // starting zoom
    });
    this.marcadores();
  }

  negocios:any = [];

  marcadores(){

    var _self = this;
    
    function callFunction(idNegocio,nombre,imagen,lon,lat,envio) {
      _self.markerSeleccionado(idNegocio,nombre,imagen,lon,lat,envio);
    }

    new mapboxgl.Marker()
    .setLngLat([this.lon, this.lat])
    .addTo(this.map);

    for (const negocio of this.negocios) {
      console.log('hola',this.lon)
      //se crea el poputs

      
      var popup = new mapboxgl.Popup()
      .setLngLat([negocio.location.coordinates[0],negocio.location.coordinates[1]])
      .setHTML(`<span>${negocio.nombreNegocio}</span>`);

      //creamos la vista del marker
      var el = document.createElement('div');
      el.id = 'marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.style.backgroundImage = "url('../../../../../assets/marcador_restaurante.png')";
      el.style.backgroundSize = 'cover';
      //se le agrega el id del marker que viene de la db

      const funcionLocal = function(){
        callFunction(negocio._id,negocio.nombreNegocio,negocio.imagen,negocio.location.coordinates[0],negocio.location.coordinates[1],negocio.envio)};

      el.onclick = funcionLocal;
  
      //se crea el marquer
      new mapboxgl.Marker(el)
      .setLngLat([negocio.location.coordinates[0],negocio.location.coordinates[1]])
      .setPopup(popup)
      .addTo(this.map);

    }

    

  }

  
  
  async markerSeleccionado(idNegocio,nombre, imagen,lon,lat,envio){
    console.log("envio", envio);
    if (!this.modalPresent) {
      this.negociosService.negocio.idNegocio = idNegocio;
      this.negociosService.negocio.nombre = nombre;
      this.negociosService.negocio.imagen = imagen;
      this.negociosService.negocio.lon = lon; 
      this.negociosService.negocio.lat = lat;
      this.negociosService.negocio.envios = envio;
      this.subirModal();
    }else{
      this.bajarModal(idNegocio,nombre, imagen,lon,lat,envio);
    }

    // const modal = await this.modalController.create({
    //   component: ModalPage,
    //   componentProps: {
    //     idNegocio,
    //     nombre,
    //     imagen,
    //     lon,
    //     lat,
    //   }
    // });
    // await modal.present();
  }

  bajarModal(idNegocio,nombre, imagen,lon,lat,envio){
    console.log("envio", envio);
    let modalNegocio = document.getElementById('modal-negocio');
    this.renderer.setStyle(modalNegocio,'bottom',`-100px`); 
    this.renderer.setStyle(modalNegocio,'transition',`bottom 400ms`); 
    setTimeout(() => {
      this.negociosService.negocio.idNegocio = idNegocio;
      this.negociosService.negocio.nombre = nombre;
      this.negociosService.negocio.imagen = imagen;
      this.negociosService.negocio.lon = lon; 
      this.negociosService.negocio.lat = lat;
      this.negociosService.negocio.envios = envio;
      this.subirModal();
    }, 400);
    this.modalPresent = false;
  }

  subirModal(){
    console.log("subir modal");
    let modalNegocio = document.getElementById('modal-negocio');
    modalNegocio.classList.remove("d-none");
    setTimeout(() => {
      this.renderer.setStyle(modalNegocio,'bottom',`70px`); 
      this.renderer.setStyle(modalNegocio,'transition',`bottom 400ms`); 
    }, 100);
    
    this.modalPresent = true;
  }

  closeModal(){
    let modalNegocio = document.getElementById('modal-negocio');
    this.renderer.setStyle(modalNegocio,'bottom',`-100px`); 
    this.renderer.setStyle(modalNegocio,'transition',`bottom 400ms`); 
    setTimeout(() => {
      modalNegocio.classList.add("d-none");
    }, 400);
    this.modalPresent = false;
  }
  
  ver_negocio(){
    this.router.navigate(["/negocio"]);
  }

}
