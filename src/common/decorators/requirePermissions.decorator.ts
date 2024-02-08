import { SetMetadata } from '@nestjs/common';
import { UserPermissions } from '../enum/sms.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: UserPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
