//Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { UserAuthenticationService } from './service/user-authentication.service';
import { UserInteractionService } from './service/user-interaction.service';
import { FileUploadService } from './service/file-upload.service';
import { SocketService } from './service/socket.service';
import { HttpClientModule } from '@angular/common/http';
import { AddUserComponent } from './form/add-user/add-user.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { AddGroupComponent } from './form/add-group/add-group.component';
import { AddChannelComponent } from './form/add-channel/add-channel.component';
import { ChannelComponent } from './channel/channel.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AddUserComponent,
    GroupDetailComponent,
    AddGroupComponent,
    AddChannelComponent,
    ChannelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserAuthenticationService, UserInteractionService, FileUploadService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
