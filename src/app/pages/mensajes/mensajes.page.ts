import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(private activateRoute:ActivatedRoute,
    public wsService:WebsocketService,
    private scrollService:ScrollService,
    private chatService:ChatService,
    public userService:UserService) { }

  nombre='';
  imagen='';
  idUser='';
  id_fb;
  idNegocio;
  logueadoConFB = "undefined";
  mensajes:any = [];
  imagenConsulta = '';

  vistos = false;
  usuarioActivo: any= [];
  nuevoMensaje = "";

  uri = environment.URI;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {

    const datosReceptor = this.activateRoute.snapshot.paramMap.get('id');
    const split = datosReceptor.split('separador');
    this.idUser = split[0];
    this.nombre = split[1];
    this.imagen = split[2];

    console.log(split.length);

    if (split.length === 5) {
      //viene la imagen de consulta
      this.imagenConsulta = split[4];
      console.log(this.imagenConsulta);
    }

    this.wsService.emitirUsusarioEnLina(split[0]);
    
    this.wsService.getUsusarioEnLinea().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.usuarioActivo = res;
    },err => {
      console.log(err);
    });

    this.chatService.getMensajesWS().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      console.log('nuevo mensaje entrante');
      this.mensajes = res;
      
      const noVistos = this.mensajes.filter(mensaje => mensaje.remitenteOriginal !== this.userService.usuario.id && mensaje.visto === false)
      console.log(noVistos.length);
      if (noVistos.length > 0) {
        console.log("mensajes no visots",noVistos);
        this.chatService.marcarVisto(this.userService.usuario.id,this.idUser);
      }
      
      
    },err => {

    });

    this.chatService.getMensajes(this.userService.usuario.id,this.idUser).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.mensajes = res;
      console.log(this.mensajes);
      for (let mensaje of this.mensajes) {
        if (mensaje.visto === false && mensaje.de !== this.userService.usuario.id) {
          //mando a modificar a la bd
          console.log("marco el visto");
          this.chatService.marcarVisto(this.userService.usuario.id,this.idUser);
          this.chatService.modificarMensajesSinver(this.userService.usuario.id,this.idUser).subscribe(res => {console.log(res);},
          err => {});
          break;
        }
        
      }

      

    },err => {

    });

   

    this.chatService.obtenerVistos().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.mensajes = res;
      console.log(this.mensajes);
      
    },err => {

    })

  }

  enviarMensaje(){
   

    const payload = {
      myId:this.idUser,
      otherId:this.userService.usuario.id,
      mensaje:this.nuevoMensaje,
      miNombre:this.userService.usuario.nombre,
      otherNombre:this.nombre,
      miImagen:this.userService.usuario.imagen,
      otherImagen:this.imagen,
      body:this.mensajes,
      imagenConsulta:this.imagenConsulta
    };

    console.log(payload);

    this.mensajes.push(payload);

    this.chatService.postMensaje(this.userService.usuario.id,this.idUser,this.nuevoMensaje,this.userService.usuario.nombre,this.nombre,this.userService.usuario.imagen,this.imagen,this.imagenConsulta);

    this.nuevoMensaje = '';

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this. unsubscribe$.next();
    this. unsubscribe$.complete();
    console.log('desuscrito');
  }

}
