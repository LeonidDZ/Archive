import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Car } from '../models/car.model';
import { Location } from '../models/location.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() user: User;
  public locations: Location[];

  constructor(private userService: UserService){}

  ngOnInit(): void {
    const firstCar: Car = this.user.cars[0];
    this.showLocations(firstCar);
  }

  showLocations(car: Car) {
    this.locations = car.locations;
  }

  closeModal(){
    this.userService.closeUsersListModal.emit();
  }

}
