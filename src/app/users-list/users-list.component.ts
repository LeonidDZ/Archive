import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../service/user.service';
import { Location } from '../models/location.model';
import { Car } from '../models/car.model';

//declare var $: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {

  public users: User[];
  public sort: string = '-fullName';
  public showDetailes: boolean = false;
  public selectedUser: User;
  public locations: string[] = [];
  public selectedUsersByLocation: User[] = [];
  public showUsersByLocation: boolean = false;
  private activatedUsersListChanged: Subscription;
  private activatedCloseUsersListModal: Subscription;
  private activatedCloseUsersByLocationModal: Subscription;

  @ViewChild('vilon') vilon: ElementRef;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.activatedUsersListChanged = 
     this.userService.usersListChanged.subscribe(
      (list: User[]) => {
        this.users = list;
        this.userService.locations.map((location: Location) => {
          if (this.locations.indexOf(location.locationLatLng) < 0) {
            this.locations.push(location.locationLatLng);
          }
        });
        this.locations.sort();
      }
    );

    this.activatedCloseUsersListModal =
    this.userService.closeUsersListModal.subscribe(() => {
      this.showDetailes = false;
      this.hideModals();
    });

    this.userService.closeUsersByLocationModal.subscribe(()=>{
      this.activatedUsersListChanged
    })
  }

  ngAfterViewInit() {
    this.hideModals();
  }

  ngOnDestroy(){
    this.activatedUsersListChanged.unsubscribe();
    this.activatedCloseUsersListModal.unsubscribe();
    this.activatedCloseUsersByLocationModal.unsubscribe();
  }

  showUserDetailes(user: User) {
    this.selectedUser = user;
    this.showDetailes = true;
    this.vilon.nativeElement.hidden = false;
  }

  hideModals() {
    this.showUsersByLocation = false;
    this.showDetailes = false;
    this.vilon.nativeElement.hidden = true;
  }

  sortTable(colName: string) {
    this.sort = colName;
  }

  searchUsersByLocation(locationLatLng: string) {
    this.users.map((user: User) => {
      user.cars.map((car: Car) => {
        car.locations.map((location: Location) => {
          if (locationLatLng === location.locationLatLng) {
            this.selectedUsersByLocation.push(user);
          }
        })
      })
    })
    this.showUsersByLocation = true;
    this.vilon.nativeElement.hidden = false;
  }
}
