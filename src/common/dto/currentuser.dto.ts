;

export class CurrentUser {
    username: string;
  
    userId: string;

    email:string;
    profile: Profile
  }

  export class Profile {
    userProfileId: string;
    firstName: string;
    middleName: string;
    mobile: string;
    branchId: string;
}