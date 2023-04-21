import { Location } from "./location.model";

export class Car{

    constructor(
        public carNumber: string,
        public carColor: string,
        public carBranch: string,
        public userIndex: string,
        public img: string,
        public locations: Location[]
    ){
        this.carNumber = carNumber;
        this.carColor = carColor;
        this.carBranch = carBranch;
        this.userIndex = userIndex;
        this.img = img;
        this.locations = locations;
    }
}