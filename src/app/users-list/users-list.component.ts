import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../service/user.service';
import { Location } from '../models/location.model';
import { Car } from '../models/car.model';

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
  public selectedUsersByLocation: User[] = [];
  public showUsersByLocation: boolean = false;
  private activatedUsersListChanged: Subscription;
  private activatedCloseUsersListModal: Subscription;
  private activatedCloseUsersByLocationModal: Subscription;
  public selectedLocationLatLng: string;
  public selectedLocationImg: string;

  @Input() locationLatLngs: string[];
  @Input() locationImg: string;
  @ViewChild('vilon') vilon: ElementRef;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.activatedUsersListChanged =
      this.userService.usersListChanged.subscribe(
        (list: User[]) => {
          if (!list) {
            return;
          }
          this.users = list;
          this.locationLatLngs = [];
          let locs: string[] = [];
          this.userService.locations.map((location: Location) => {
            if (locs.indexOf(location.locationLatLng) < 0) {
              locs.push(location.locationLatLng);
            }
          });
          this.users.map((user: User) => {
            user.cars.map((car: Car) => {
              car.locations.map((loc: Location) => {
                if (locs.indexOf(loc.locationLatLng) !== -1 && this.locationLatLngs.indexOf(loc.locationLatLng) === -1) {
                  this.locationLatLngs.push(loc.locationLatLng);
                }
              })
            })
          });
          this.locationLatLngs.sort();
        }
      );

    this.activatedCloseUsersListModal =
      this.userService.closeUsersListModal.subscribe(() => {
        this.showDetailes = false;
        this.hideModals();
      });

    this.userService.closeUsersByLocationModal.subscribe(() => {
      this.activatedUsersListChanged
    })
  }

  ngAfterViewInit() {
    this.hideModals();
  }

  ngOnDestroy() {
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
    this.selectedLocationLatLng = locationLatLng;
    this.users.map((user: User) => {
      user.cars.map((car: Car) => {
        car.locations.map((location: Location) => {
          if (locationLatLng === location.locationLatLng) {
            this.selectedLocationImg = location.img;
            this.selectedUsersByLocation.push(user);
          }
        })
      })
    })
    this.showUsersByLocation = true;
    this.vilon.nativeElement.hidden = false;
  }
}
