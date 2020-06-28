import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NodeuiComponent } from './nodeui/nodeui.component';
import { PathfinderService } from './pathfinder.service';

@NgModule({
  declarations: [
    AppComponent,
    NodeuiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    PathfinderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
