import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPopoverPage } from './list-popover';

@NgModule({
  declarations: [
    ListPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPopoverPage),
  ]
})
export class ListPopoverPageModule {}
