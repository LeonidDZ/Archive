import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { OrderBy } from './globals/orderBy.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './modal/modal.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsersByLocationComponent } from './modal-users-by-location/modal-users-by-location.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ModalComponent,
    UsersListComponent,
    OrderBy,
    ModalUsersByLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
