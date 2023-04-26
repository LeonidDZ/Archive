import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Car } from '../../models/car.model';
import { Location } from '../../models/location.model';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-modal-users-by-location',
  templateUrl: './modal-users-by-location.component.html',
  styleUrls: ['./modal-users-by-location.component.css']
})
export class ModalUsersByLocationComponent implements OnInit {

  private users: User[];
  public selectedLocation: string;
  public selected: string;
  public carLocationUsers: any;
  public keys: string[];
  public bigImg: boolean = false;
  public carsUsersDates: any;
  private prevCarNumber: string = '0';

  @Input() selectedocationLatLngs: string[];
  @Input() selectedLocationLatLng: string;
  @Input() selectedLocationImg: string;
  @Input() selectedUsersByLocation: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.users = this.userService.currUsers;
    this.fillCarLocationUsers();
  }

  closeModal() {
    this.userService.closeUsersListModal.next();
  }

  showBigImg(set: boolean, evt: any = null) {
    if(evt){
      evt.stopPropagation();
    }
    this.bigImg = set;
  }

  fillCarLocationUsers() {

    this.carsUsersDates = {}
    this.userService.locations.map((loc: Location) => {
      if (loc.locationLatLng === this.selectedLocationLatLng) {
        if (!this.carsUsersDates.hasOwnProperty(loc.carNumber)) {
          this.carsUsersDates[loc.carNumber] = {};
          this.carsUsersDates[loc.carNumber].users = [];
          this.carsUsersDates[loc.carNumber].dates = [];
        }
        this.carsUsersDates[loc.carNumber].dates.push(loc.dateTime);
      }
    })

    this.userService.currUsers.map((user: User) => {
      user.cars.map((car: Car) => {
        if (this.carsUsersDates.hasOwnProperty(car.carNumber) && this.carsUsersDates[car.carNumber].users.indexOf(user.fullName) === -1) {
          this.carsUsersDates[car.carNumber].users.push(user.fullName);
        }
      })
    })
  }

  getUsers(carUsersDates: any) {
    let users: [] = carUsersDates.value.users;
    return users;
  }

  getDates(carUsersDates: any) {
    let dates: [] = carUsersDates.value.dates;
    return dates;
  }

  showCar(carNumber: string) {
    let response = carNumber === this.prevCarNumber ? '' : carNumber;
    this.prevCarNumber = carNumber;
    return response;
  }
}
