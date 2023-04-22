import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { OrderBy } from './globals/orderBy.pipe';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './modal/modal.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsersByLocationComponent } from './modal-users-by-location/modal-users-by-location.component';
import { PaginatorComponent } from './users-list/paginator/paginator.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ModalComponent,
    UsersListComponent,
    OrderBy,
    ModalUsersByLocationComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CookieModule.withOptions(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
