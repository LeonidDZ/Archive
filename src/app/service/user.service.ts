import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from "../models/user.model";
import { Car } from '../models/car.model';
import { Location } from '../models/location.model';
import { CookieService } from 'ngx-cookie';
import { SavedEntities } from '../models/saved-entities.model';

declare var $: any;

@Injectable()
export class UserService {

    usersPath: string = '../assets/data/people.json';
    carsPath: string = '../assets/data/cars.json';
    locationsPath: string = '../assets/data/location.json';
    public init: boolean = true;
    public pagedUsers: any = {};
    public users: User[] = [];
    public currUsers: User[] = [];
    public cars: Car[] = [];
    public locations: Location[] = [];
    private usersChanged: boolean = false;
    private carsChanged: boolean = false;
    private locationsChanged: boolean = false;
    public rowsPerPage: number = 5;
    public currPage: number = 0;
    public pagesQuantity: number = 10;
    private cookieName: string = 'savedEntities';
    private savedEntities: SavedEntities;

    public usersListChanged = new Subject<User[]>();
    public closeUsersListModal = new Subject<void>();
    public closeUsersByLocationModal = new Subject<void>();
    public pagesQuantityChanged = new Subject<SavedEntities>();

    constructor(
        private http: HttpClient,
        private cookieService: CookieService) {
        const savedEntitiesJson = this.cookieService.get(this.cookieName);
        if (savedEntitiesJson) {
            var o = JSON.parse(savedEntitiesJson);
            if (o.rowsPerPage) {
                this.savedEntities = o;
                this.pagesQuantity = this.savedEntities.pagesQuantity;
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
        const o = new SavedEntities();
        o.pagesQuantity = this.pagesQuantity;
        o.rowsPerPage = this.rowsPerPage;
        o.currPage = this.currPage;
        this.cookieService.put(this.cookieName, JSON.stringify(o));
    }

    setCurrPage(cp: number) {
        this.currPage = cp || cp === 0 ? cp : this.currPage;
        this.saveSavedEntities();
        this.fillCurrUsers();
        this.usersListChanged.next(this.currUsers);
        this.setPagedUsers();
    }

    setPagesQuantity() {
        this.pagesQuantity = Math.ceil(this.users.length / this.rowsPerPage);
        this.saveSavedEntities();
        const o = new SavedEntities();
        o.pagesQuantity = this.pagesQuantity;
        o.currPage = this.init ? this.currPage : 0;
        o.rowsPerPage = this.rowsPerPage;
        this.pagesQuantityChanged.next(o);
    }

    setRowsPerPage(rpp: number) {
        this.rowsPerPage = rpp;
        this.cookieService.put(this.cookieName, this.rowsPerPage.toString());
        this.setPagedUsers();
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
                if (car.userIndex.indexOf(user.userIndex) >= 0) {
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
        if (!this.pagedUsers || $.isEmptyObject(this.pagedUsers)) {
            this.fillPagedUsers();
        }
        else {
            this.currPage = this.currPage > Object.keys(this.pagedUsers).length - 1 ? 0 : this.currPage;
            this.currUsers = this.pagedUsers[this.currPage];
        }
    }
}