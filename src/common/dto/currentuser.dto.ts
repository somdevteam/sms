;

export class CurrentUser {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  mobile: string;
  branchId: number | null;
  userProfileId: number;
  loginHistoryId: number;
  loginDate: Date;
  roleId: number;
  roleName: string;
}