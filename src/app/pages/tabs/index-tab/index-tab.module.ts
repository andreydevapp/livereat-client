import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexTabPageRoutingModule } from './index-tab-routing.module';

import { IndexTabPage } from './index-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexTabPageRoutingModule
  ],
  declarations: [IndexTabPage]
})
export class IndexTabPageModule {}
