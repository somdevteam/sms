import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/requirePermissions.decorator';
import { UserPermissions } from '../enum/sms.enum';
import {RolePermissionsService} from "../../modules/rolePermissions/rolePermissions.service";

@Injectable()
export class UserPermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private rolePermissionsService: RolePermissionsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<
            UserPermissions[]
            >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredPermissions) {
            return true;
        }
       //const user  = context.switchToHttp().getRequest();

        const {
            user: { user },
        } = context.switchToHttp().getRequest();

        const roleId = user.roleId;
        const response = await this.rolePermissionsService.findRolePermissionById(roleId);
        const permissions = response.map(item => item["permissionName"]);

        console.log(permissions);
        // const permissions = (response?.map((p) => p.permissionName));
       //  console.log(permissions);
        //
        return requiredPermissions.some((permission) =>
            permissions.includes(permission),
        );
    }
}
