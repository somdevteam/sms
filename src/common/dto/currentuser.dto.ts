;

export class CurrentUser {
    username: string;
  
    userId: string;

    email:string;
    profile: Profile;
    loginHistory: LoginHistory[]
  }

   class Profile {
    userProfileId: string;
    firstName: string;
    middleName: string;
    mobile: string;
    branchId: string;
}

 class LoginHistory {
  loginHistoryId: string;
  firstName: string;
  userId: string;
  loginDate: Date;
}