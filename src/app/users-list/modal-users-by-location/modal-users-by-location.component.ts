import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Car } from '../../models/car.model';
import { Location } from '../../models/location.model';
import { UserService } from '../../service/user.service';
import { CarLocationUsers } from '../../models/car-location-users.model';

@Component({
  selector: 'app-modal-users-by-location',
  templateUrl: './modal-users-by-location.component.html',
  styleUrls: ['./modal-users-by-location.component.css']
})
export class ModalUsersByLocationComponent implements OnInit {

  private users: User[];
  public selectedLocation: string;
  public selectedLocationImg: string;
  public selected: string;
  public carLocationUsers: any;
  public keys: string[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.users = this.userService.currUsers;
    this.fillCarLocationUsers();
  }

  closeModal() {
    this.userService.closeUsersListModal.next();
  }

  fillCarLocationUsers() {
    this.carLocationUsers = {};
    this.users.map((user: User) => {
      user.cars.map((car: Car) => {
        const clu = new CarLocationUsers();
        clu.userNames = [];
        clu.visitDates = [];
        clu.carNumber = car.carNumber;
        if (clu.userNames.indexOf(user.fullName) < 0) {
          clu.userNames.push(user.fullName);
        }
        clu.locationLatLng = car.locations[0].locationLatLng;
        clu.locationImg = car.locations[0].img;

        car.locations.map((location: Location) => {
          if (clu.visitDates.indexOf(location.dateTime) < 0) {
            clu.visitDates.push(location.dateTime);
          }
        })

        if (!this.carLocationUsers.hasOwnProperty(car.carNumber)) {
          this.carLocationUsers[car.carNumber] = [];
        }
        this.carLocationUsers[car.carNumber].push(clu);
      });
    });
    this.keys = Object.keys(this.carLocationUsers);
    this.selectedLocation = this.carLocationUsers[this.keys[0]][0].locationLatLng;
    this.selectedLocationImg =  this.carLocationUsers[this.keys[0]][0].locationImg;
  }
}
