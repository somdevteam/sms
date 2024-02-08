import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './Dto/user.dto';
import * as crypto from 'crypto';
import { UserProfile } from './userprofile.entity';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { Loginhistories } from '../auth/loginhistories.entity';
import { UserFilterDto } from './Dto/search-user.dto';
import { ResetPasswordDto } from './Dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Loginhistories)
    private loginRepository: Repository<Loginhistories>,
  ) {}

  private readonly users: any[] = [];

  getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { userId: id } });
  }

  getAllUser(currentUser: CurrentUser) {
    // return this.userRepository.find();
    const id = currentUser.userId;
    return this.fetchUsersFullData();
  }

  async getByMobile(mobile: any): Promise<UserProfile | null> {
    return await this.userProfileRepository.findOne({ where: { mobile } });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async resetPassword(id:number,payload: ResetPasswordDto): Promise<any> {
    const foundedUser = await this.getById(id);
    if(!foundedUser) {
      throw new NotFoundException('this user not exists');
    }

    foundedUser.password = crypto.createHmac('sha256', payload.password).digest('hex');

   return await this.userRepository.update(foundedUser.userId,foundedUser);

  }

  async fetchUsersByBranch(data: UserFilterDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.isActive = :isActive', { isActive: data.isActive })
      .select([
        'user.userId as userId',
        'user.email as email',
        'user.username as username',
        'profile.firstName as firstName',
        'profile.middleName as middleName',
        'profile.lastName as lastName',
        'profile.mobile as mobile',
        'profile.branchId as branchId',
        'profile.userProfileId as userProfileId',
      ]);

    if (data.branchId !== 0 && data.branchId !== null) {
      query.andWhere('profile.branchId = :branchId', {
        branchId: data.branchId,
      });
    }

    return query.getRawMany();
  }

 //  async fetchSingleUsersFullData(userId: number) {
 //    return await this.userRepository
 //     .createQueryBuilder('user')
 //     .leftJoinAndSelect('user.profile', 'profile')
 //     .where('user.userId = :userId', { userId })
 //     .select([
 //       'user.userId as userId',
 //       'user.email as email',
 //       'user.username as username',
 //       'profile.firstName as firstName',
 //       'profile.middleName as middleName',
 //       'profile.lastName as lastName',
 //       'profile.mobile as mobile',
 //       'profile.branchId as branchId',
 //       'profile.userProfileId as userProfileId',
 //     ]).getRawOne();
 // }

  async fetchUsersFullData(userId?: number) {
    const usersList = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select([
        'user.userId as userId',
        'user.email as email',
        'user.username as username',
        'profile.firstName as firstName',
        'profile.middleName as middleName',
        'profile.lastName as lastName',
        'profile.mobile as mobile',
        'profile.branchId as branchId',
        'profile.userProfileId as userProfileId',
      ]);
    if (userId) usersList.where('user.userId = :userId', { userId });
    return usersList.getRawMany();
  }

  async fetchSingleUsersFullData(userId: number) {
     return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
         .leftJoinAndSelect('user.userRoles','userRoles')
         .leftJoinAndSelect('userRoles.role','role')
      .where('user.userId = :userId', { userId })
      .select([
        'user.userId as userId',
        'user.email as email',
        'user.username as username',
        'profile.firstName as firstName',
        'profile.middleName as middleName',
        'profile.lastName as lastName',
        'profile.mobile as mobile',
        'profile.branchId as branchId',
        'profile.userProfileId as userProfileId',
        'userRoles.roleId as roleId',
        'role.roleName as roleName'
      ]).getRawOne();
  }
    async fetchSpecificUserData(userId: number, loginHistoryId: number) {
        const result = await this.userRepository
            .createQueryBuilder('u')
            .select([
                'u.userId as userId',
                'u.email as email',
                'u.username as userName',
                'up.firstName as firstName',
                'up.middleName as lastName',
                'up.mobile as mobile',
                'up.branchId as branchId',
                'up.userProfileId as userProfileId',
                'lh.loginHistoryId as loginHistoryId',
                'lh.loginDate as loginDate',
                'r.roleId as roleId',
                'r.roleName as roleName',
            ])
            .leftJoin('u.profile', 'up')
            .leftJoin('u.userRoles', 'ur')
            .leftJoin('ur.role', 'r')
            .leftJoin('u.loginHistory', 'lh')
            .where('u.userId = :userId and lh.loginHistoryId = :loginHistoryId', { userId, loginHistoryId })
            .getRawOne();

        console.log(result);
        return result;
    }

    async fetchSpecificUserData1(userId: number, loginHistoryId: number) {
        const result = await this.userRepository.query(`
        SELECT
            u.userId,
            u.email,
            u.username,
            up.firstName,
            up.middleName,
            up.mobile,
            up.branchId,
            up.userProfileId,
            lh.loginHistoryId,
            lh.userId,
            lh.loginDate,
            r.roleId as roleId,
            r.roleName as roleName,
            ur.roleid as roleId
        FROM
            user u
        LEFT JOIN
            user_profiles up ON u.userId = up.userId
        LEFT JOIN
            userroles ur ON u.userId = ur.userId
        LEFT JOIN
            roles r ON ur.roleId = r.roleId
        LEFT JOIN
            login_history lh ON u.userId = lh.userId
        WHERE
            u.userId = ? AND lh.loginHistoryId = ?
    `, [userId, loginHistoryId]);

        console.log(result[0]); // Assuming the result is an array of rows
        return result[0]; // Assuming you want to return the first row
    }


  async create(payload: UserDto) {
    const username = await this.getByUsername(payload.username);
    if (username) {
      throw new NotAcceptableException(
        'The account with the provided username currently exists. Please choose another one.',
      );
    }
    const existingUserWithMobile = await this.getByMobile(payload.mobile);
    if (existingUserWithMobile) {
      throw new ConflictException(
        'The provided mobile number is already associated with an account.',
      );
    }
    const existingUserWithEmail = await this.getByEmail(payload.email);
    if (existingUserWithEmail) {
      throw new ConflictException(
        'The provided Email  is already associated with an account.',
      );
    }

    const user = new UserEntity();
    user.isActive = payload.isActive;
    user.password = crypto.createHmac('sha256', payload.password).digest('hex');
    user.username = payload.username;
    user.email = payload.email;
    const currentDate = new Date();
    user.datecreated = currentDate;
    user.dateModified = currentDate;

    try {
      const savedUser = await this.userRepository.save(user); // Step 1: Save UserEntity

      const userProfile = new UserProfile();
      userProfile.firstName = payload.firstName;
      userProfile.lastName = payload.lastName;
      userProfile.middleName = payload.middleName;
      userProfile.mobile = payload.mobile;
      userProfile.branchId = payload.branchId > 0 ? payload.branchId : null;
      userProfile.user = savedUser; // Step 2: Associate UserProfile with UserEntity

      userProfile.datecreated = currentDate;
      userProfile.dateModified = currentDate;

      await this.userProfileRepository.save(userProfile);

      return savedUser;
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async update(id: number, payload: UserDto): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({ userId: id });

    if (!foundUser) {
      throw new NotFoundException('User Not found');
    }
    const currentDate = new Date();
    const userId = payload.userId;
    foundUser.email = payload.email;
    foundUser.username = payload.username;
    foundUser.isActive = payload.isActive;
    foundUser.dateModified = currentDate;

    const existingUserProfile = await this.userProfileRepository.findOneBy({
      user: { userId: foundUser.userId },
    });
    existingUserProfile.firstName = payload.firstName;
    existingUserProfile.middleName = payload.middleName;
    existingUserProfile.lastName = payload.lastName;
    existingUserProfile.mobile = payload.mobile;
    existingUserProfile.branchId = payload.branchId;
    existingUserProfile.dateModified = currentDate;

    const updatedUser = await this.userRepository.update(
      foundUser.userId,
      foundUser,
    );
    const updateUserProfile = await this.userProfileRepository.update(
      { user: { userId: foundUser.userId } },
      existingUserProfile,
    );
    return updatedUser;
  }

  async getByUsernameAndPass(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');

    return this.userRepository.findOne({
      where: {
        username,
        password: hashedPassword,
      },
    });
  }

  async addLoginHisotry(payload, user) {
    const loginHistory = new Loginhistories();
    const currentDate = new Date();
    loginHistory.ip = payload.ip;
    loginHistory.browser = payload.browser;
    loginHistory.user = user;
    loginHistory.loginDate = currentDate;
    loginHistory.logoutDate = null;

    try {
      const savedLoginHistory = await this.loginRepository.save(loginHistory); // Step 1: Save UserEntity

      return savedLoginHistory;
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async getUserLoginHistory(userId) {
    const userLoginHistories = await this.loginRepository.find({where: {userId}});
    return userLoginHistories;
  }
}
