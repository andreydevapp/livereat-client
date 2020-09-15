import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HerramientasService } from 'src/app/services/herramientas.service';
import { RegistrarseService } from 'src/app/services/registrarse.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {

  constructor(public loadingController: LoadingController,
    private herramientasService:HerramientasService,
    private registrarseService:RegistrarseService,
    private userService:UserService,
    private wsService:WebsocketService,
    private storage:Storage,
    private router:Router
    ) { }

  ngOnInit() {
    
  }
  
  correo:String = '';
  pass:String = '';

  async validar(){

    if (this.correo !== '' && this.pass !== '') {
      await this.herramientasService.presentLoading();
      this.loguearse();
    }else{
      this.herramientasService.presentAlert('Es necesario llenar todos los campos');
    }
  }

  async loguearse(){
    
    this.registrarseService.iniciarSesion(this.correo,this.pass).subscribe(async res => {
      
      console.log(res);
      const user:any = res;

      if (user.res === 'usuario registrado') {
    
        //se guarda el usuario en la variable de entorno
        await this.userService.guardarUsuario(res);

        //se envia la informacion del usuario para el servicio de ws
        await this.guardarUsuarioWS(res);
        
        this.loadingController.dismiss();
        this.router.navigate(['/index-tab']);

      }else{

        this.herramientasService.dismissLoading();
        this.herramientasService.presentAlert('Tu direccion de correo electronico o contraseña son incorrectos');
      
      }  
      
    },err => {
      this.herramientasService.dismissLoading();
    });
    
  }

  guardarUsuarioWS(user:any){
   
    //se envia los datos del usuario a ws
    this.wsService.loginWS(user.nombre, user.id, user.imgUrl).then((res) => {
    
      //se guarda en el storage
      this.userService.guardarStorage();
      this.herramientasService.dismissLoading();
      this.router.navigate(['/index-tab']);
    
    }).catch((err) => {
    
      console.log(err);
      this.herramientasService.dismissLoading();
      this.herramientasService.presentAlert('usurio no registrado');
    
    });

  }

  async login() {

    
  }
  
  onLoginSuccess(res:any) {
    // const { token, secret } = res;
    

  }
  onLoginError(err) {
    console.log(err);
  }

}
