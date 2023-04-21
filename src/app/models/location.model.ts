export class Location{
    constructor(
        public locationLatLng: string,
        public carNumber: string,
        public dateTime: string,
        public img: string
    ){
        this.locationLatLng = locationLatLng;
        this.carNumber = carNumber;
        this.dateTime = dateTime;
        this.img = img;
    }
}