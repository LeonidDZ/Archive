export class LightUser{
  constructor(
        public userIndex: string,
        public fullName: string,
        public phoneNumber: string,
        public birthday: string
    ){
        this.userIndex = userIndex;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.birthday = birthday;
    }
}