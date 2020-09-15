import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./pages/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./pages/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'index-tab',
    loadChildren: () => import('./pages/tabs/index-tab/index-tab.module').then( m => m.IndexTabPageModule)
  },
  {
    path: 'estado-pedido',
    loadChildren: () => import('./pages/estado-pedido/estado-pedido.module').then( m => m.EstadoPedidoPageModule)
  },
  {
    path: 'contactos',
    loadChildren: () => import('./pages/tabs/tab-chat/contactos/contactos.module').then( m => m.ContactosPageModule)
  },
  {
    path: 'tab-chat',
    loadChildren: () => import('./pages/tabs/tab-chat/tab-chat.module').then( m => m.TabChatPageModule)
  },
  {
    path: 'mensajes/:id',
    loadChildren: () => import('./pages/mensajes/mensajes.module').then( m => m.MensajesPageModule)
  },
  {
    path: 'negocio',
    loadChildren: () => import('./pages/negocio/negocio.module').then( m => m.NegocioPageModule)
  },
  {
    path: 'facturas',
    loadChildren: () => import('./pages/facturas/facturas.module').then( m => m.FacturasPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./pages/pedido/pedido.module').then( m => m.PedidoPageModule)
  },
  {
    path: 'pay-method',
    loadChildren: () => import('./pages/pay-method/pay-method.module').then( m => m.PayMethodPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
