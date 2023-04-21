import { Car } from "./car.model";

export class User{
    
    constructor(
        public userIndex: string,
        public fullName: string,
        public address: string,
        public phoneNumber: string,
        public img: string,
        public birthday: string,
        public cars: Car[]
    ){
        this.userIndex = userIndex;
        this.fullName = fullName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.img = img;
        this.birthday = birthday;
        this.cars = cars;
    }
}