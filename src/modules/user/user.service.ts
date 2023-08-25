import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {UserDto} from "./Dto/user.dto";
import * as crypto from 'crypto';
import {UserProfile} from "./userprofile.entity";
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import {Loginhistories} from "../auth/loginhistories.entity";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
                @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>,
                @InjectRepository(Loginhistories) private loginRepository: Repository<Loginhistories>) {
    }

    private readonly users: any[] = [];

    getByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({where: {username}});
    }

    getById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({where: {userId: id}})
    }

    async getAllUser(currentUser: CurrentUser) {
        var allUsers = await this.userRepository.find();
        return new ApiBaseResponse('success', 200, allUsers);
    }

    async getByMobile(mobile: number): Promise<UserProfile | null> {
        return await this.userProfileRepository.findOne({where: {mobile}});
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({where: {email}});
    }

    async fetchSpecificUserData(userId: number, loginHistoryId: number) {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.loginHistory', 'loginHistory')
            .where('user.userId = :userId and loginHistory.loginHistoryId = :loginHistoryId', { userId, loginHistoryId })
            .select([
                'user.userId',
                'user.email',
                'user.username',
                'profile.firstName',
                'profile.middleName',
                'profile.mobile',
                'profile.branchId',
                'profile.userProfileId',
                'loginHistory.loginHistoryId',
                'loginHistory.userId',
                'loginHistory.loginDate'
            ])
            .getOne();
    }

    async create(payload: UserDto) {
        const username = await this.getByUsername(payload.username);
        if (username) {
            throw new NotAcceptableException(
                new ApiBaseResponse('The account with the provided username currently exists. Please choose another one.', 6001, null)
            );
        }
        const existingUserWithMobile = await this.getByMobile(payload.mobile);
        if (existingUserWithMobile) {
            throw new ConflictException(
                new ApiBaseResponse('The provided mobile number is already associated with an account.', 6001, null)
            );
        }
        const existingUserWithEmail = await this.getByEmail(payload.email);
        if (existingUserWithEmail) {
            throw new ConflictException(
                new ApiBaseResponse('The provided Email  is already associated with an account.', 6001, null)
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


            return new ApiBaseResponse('success', 200, savedUser);
        } catch (error) {
            if (error) {
                throw new ConflictException(
                    new ApiBaseResponse(error.message, 6001, null)
                );
            }
            throw new InternalServerErrorException(
                new ApiBaseResponse('An error occurred while creating the user.', 6001, null)
            );
        }
    }


    async update(payload: UserDto) :Promise<any>{
        const foundUser = await this.userRepository.findOneBy({userId: payload.userId});

        if (!foundUser) {
            throw new NotFoundException(
                new ApiBaseResponse('The User Not found', 6006, null)
            );
        }
        const currentDate = new Date();
        const userId = payload.userId;
        foundUser.email = payload.email;
        foundUser.password = crypto.createHmac('sha256', payload.password).digest('hex');
        foundUser.username = payload.username;
        foundUser.isActive = payload.isActive;
        foundUser.dateModified = currentDate;

        const existingUserProfile = await this.userProfileRepository.findOneBy({ user: { userId: foundUser.userId } });
        existingUserProfile.firstName = payload.firstName;
        existingUserProfile.middleName = payload.middleName;
        existingUserProfile.lastName = payload.lastName;
        existingUserProfile.mobile =payload.mobile;
        existingUserProfile.branchId = payload.branchId;
        existingUserProfile.dateModified =currentDate;

       const updatedUser =  await this.userRepository.update({userId}, foundUser);
       const updateUserProfile = await this.userProfileRepository.update({user:{userId:foundUser.userId}},existingUserProfile);
       return new ApiBaseResponse('success', 200, updatedUser);

    }

    async getByUsernameAndPass(username: string, password: string): Promise<UserEntity> {
        const hashedPassword = crypto.createHmac('sha256', password).digest('hex')

        return this.userRepository.findOne({
            where: {
                username,
                password: hashedPassword
            }
        });
    }

    async addLoginHisotry(payload, user) {

        const loginHistory = new Loginhistories();
        const currentDate = new Date();
        loginHistory.ip = payload.ip;
        loginHistory.browser = payload.browser.toString();
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
            throw new InternalServerErrorException('An error occurred while creating the user.');
        }
    }
}
