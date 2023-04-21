import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from "../models/user.model";
import { Car } from '../models/car.model';
import { Location } from '../models/location.model';
import { LightUser } from "../models/light-user.model";

@Injectable()
export class UserService {

    usersPath: string = '../assets/data/people.json';
    carsPath: string = '../assets/data/cars.json';
    locationsPath: string = '../assets/data/location.json';
    private users: User[] = [];
    public cars: Car[] = [];
    public locations: Location[] = [];
    private lightUsers: LightUser[] = [];
    public usersListChanged = new EventEmitter<User[]>();
    public lightUsersListChanged = new EventEmitter<LightUser[]>();
    public closeUsersListModal = new EventEmitter();
    public closeUsersByLocationModal = new EventEmitter();
    private usersChanged: boolean = false;
    private carsChanged: boolean = false;
    private locationsChanged: boolean = false;

    constructor(private http: HttpClient) { }

    readLightData() {//There is no reason to use light data, because there is no DB
        this.http.get<LightUser[]>(this.usersPath)
            .subscribe((data) => {
                this.lightUsers = data;
                this.lightUsersListChanged.emit(data);
            },
                (error) => {
                    console.log('Error: ', error);
                }
            );
    }

    readAllData() {
        this.http.get<User[]>(this.usersPath)
            .subscribe((data) => {
                this.users = data;
                this.usersChanged = true;
                this.checkCondition();
            },
                (error) => {
                    console.log('Error: ', error);
                }
            );

        this.http.get<Car[]>(this.carsPath)
            .subscribe((cars) => {
                this.cars = cars;
                this.carsChanged = true;
                this.checkCondition();
            },
                (error) => {
                    console.log('Error: ', error);
                }
            );

        this.http.get<Location[]>(this.locationsPath)
            .subscribe((locs) => {
                this.locations = locs;
                this.locationsChanged = true;
                this.checkCondition();
            },
                (error) => {
                    console.log('Error: ', error);
                }
            )
    }

    checkCondition() {
        if (this.usersChanged && this.carsChanged && this.locationsChanged) {
            this.fillUsers();
            this.usersListChanged.emit(this.users);
        }
    }

    fillUsers() {
        this.cars.map((car: Car) => {
            car.locations = [];
            this.locations.map((location: Location) => {
                if(car.carNumber === location.carNumber){
                    car.locations.push(location);
                }
            });
        });

        this.users.map((user: User) => {
            user.cars = [];
            this.cars.map((car: Car) => {
                if(car.userIndex === user.userIndex){
                    user.cars.push(car);
                }
            });
        });
    }
}