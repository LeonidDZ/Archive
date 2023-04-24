import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from "../models/user.model";
import { Car } from '../models/car.model';
import { Location } from '../models/location.model';
import { LightUser } from "../models/light-user.model";
import { CookieService } from 'ngx-cookie';
import { SavedEntities } from '../models/saved-entities.model';

@Injectable()
export class UserService {

    usersPath: string = '../assets/data/people.json';
    carsPath: string = '../assets/data/cars.json';
    locationsPath: string = '../assets/data/location.json';
    public pagedUsers: any = {};
    public users: User[] = [];
    public currUsers: User[] = [];
    public cars: Car[] = [];
    public locations: Location[] = [];
    private lightUsers: LightUser[] = [];
    private usersChanged: boolean = false;
    private carsChanged: boolean = false;
    private locationsChanged: boolean = false;
    public rowsPerPage: number = 5;
    public currPage: number = 0;
    private defaultRowsPerPage: number = 10;
    public pagesQuantity: number = 10;
    private cookieName: string = 'savedEntities';
    private savedEntities: SavedEntities;

    public usersListChanged = new Subject<User[]>();
    public lightUsersListChanged = new Subject<LightUser[]>();
    public closeUsersListModal = new Subject<void>();
    public closeUsersByLocationModal = new Subject<void>();
    public pagesQuantityChanged = new Subject<number>();

    constructor(
        private http: HttpClient,
        private cookieService: CookieService) {
        const rpp = this.cookieService.get(this.cookieName);
        if (rpp) {
            var o = JSON.parse(rpp);
            if (o.rowsPerPage) {
                this.savedEntities = o;
                this.rowsPerPage = this.savedEntities.rowsPerPage;
                this.currPage = this.savedEntities.currPage;
            }
            else {
                this.saveSavedEntities();
            }
        }
        else {
            this.saveSavedEntities();
        }
    }

    saveSavedEntities() {
        this.savedEntities = new SavedEntities(this.rowsPerPage, this.currPage);
        this.cookieService.put(this.cookieName, JSON.stringify(this.savedEntities));
    }

    setCurrPage(cp: number) {
        this.currPage = cp || cp === 0 ? cp : this.currPage;
        this.fillCurrUsers();
        this.usersListChanged.next(this.currUsers);
        this.setPagedUsers();
    }

    setPagesQuantity() {
        this.pagesQuantity = Math.ceil(this.users.length / this.rowsPerPage);
        const pq = this.pagesQuantity;
        this.saveSavedEntities();
        this.pagesQuantityChanged.next(pq);
    }

    setRowsPerPage(rpp: number) {
        this.rowsPerPage = rpp;
        this.cookieService.put(this.cookieName, this.rowsPerPage.toString());
        this.setPagedUsers();
    }

    readLightData() {//There is no reason to use light data, because there is no DB
        this.http.get<LightUser[]>(this.usersPath)
            .subscribe((data) => {
                this.lightUsers = data;
                this.lightUsersListChanged.next(data);
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
            this.setPagesQuantity();
            this.setPagedUsers();
        }
    }

    fillUsers() {
        this.cars.map((car: Car) => {
            car.locations = [];
            this.locations.map((location: Location) => {
                if (car.carNumber === location.carNumber) {
                    car.locations.push(location);
                }
            });
        });

        this.users.map((user: User) => {
            user.cars = [];
            this.cars.map((car: Car) => {
                if (car.userIndex === user.userIndex) {
                    user.cars.push(car);
                }
            });
        });
    }

    setPagedUsers() {
        this.fillPagedUsers();
        this.fillCurrUsers();
        this.usersListChanged.next(this.currUsers);
    }

    fillPagedUsers() {
        this.pagedUsers = {}
        let cnt = 0;
        for (let i = 0; i < this.users.length; i += this.rowsPerPage) {
            this.pagedUsers[cnt++] = this.users.slice(i, i + this.rowsPerPage);
        }
    }

    fillCurrUsers() {
        this.currPage = this.currPage > Object.keys(this.pagedUsers).length - 1 ? 0 : this.currPage;
        this.currUsers = this.pagedUsers[this.currPage];
    }
}