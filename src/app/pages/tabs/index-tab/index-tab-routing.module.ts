import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexTabPage } from './index-tab.page';



const routes: Routes = [
  {
    path: '',
    redirectTo:'map',

  },
  {
    path: '',
    component: IndexTabPage,
    children: [
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
      },
      {
        path: 'mi_perfil',
        loadChildren: () => import('./mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
      },
      {
        path: 'pedidos',
        loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule)
      }
    ]
  }
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexTabPageRoutingModule {}
