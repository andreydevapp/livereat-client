import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-index-tab',
  templateUrl: './index-tab.page.html',
  styleUrls: ['./index-tab.page.scss'],
})
export class IndexTabPage implements OnInit {

  @Input('header') header:any;

  direccionScroll:any = [];

  avatar:any;

  mensajesSinVer = 0;

  constructor(private scrollService:ScrollService,
    private renderer:Renderer2,
    public wsService:WebsocketService) {
      this.scrollService.getScroll().subscribe(res => {
        this.direccionScroll = res;
        console.log(res);
        let direcion = this.direccionScroll.direccion;
        let header = document.getElementById('header');
        let tabs = document.getElementById('tabs');
  
        if (direcion === 'subiendo') {
  
          this.renderer.setStyle(header,'margin-top',`-${header.clientHeight}px`); 
          this.renderer.setStyle(header,'transition',`margin-top 400ms`); 
  
          this.renderer.setStyle(tabs,'margin-top',`0px`); 
          this.renderer.setStyle(tabs,'transition',`margin-top 400ms`); 
  
        }else{
  
          this.renderer.setStyle(header,'margin-top','0'); 
          this.renderer.setStyle(header,'transition',`margin-top 400ms`);
  
          this.renderer.setStyle(tabs,'margin-top',`55px`); 
          this.renderer.setStyle(tabs,'transition',`margin-top 400ms`); 
  
        } 
      });
    }

  ngOnInit() {
  }

  bajarScroll() {
    this.scrollService.sendScroll('bajando');
  }

}
