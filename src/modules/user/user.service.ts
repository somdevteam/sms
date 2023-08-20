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

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
                @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>) {
    }

    private readonly users: any[] = [];

    getByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({where: {username}});
    }

    getById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({where: {userId: id}})
    }

    getAllUser(currentUser: CurrentUser) {
        return this.userRepository.find();
    }

    async getByMobile(mobile: number): Promise<UserProfile | null> {
        return await this.userProfileRepository.findOne({where: {mobile}});
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({where: {email}});
    }

    async fetchSpecificUserData(userId: number) {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.userId = :userId', {userId})
            .select([
                'user.userId',
                'user.email',
                'user.username',
                'profile.firstName',
                'profile.middleName',
                'profile.mobile',
                'profile.branchId',
                'profile.userProfileId',
            ])
            .getOne();
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
            throw new ConflictException('The provided mobile number is already associated with an account.');
        }
        const existingUserWithEmail = await this.getByEmail(payload.email);
        if (existingUserWithEmail) {
            throw new ConflictException('The provided Email  is already associated with an account.');
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
            throw new InternalServerErrorException('An error occurred while creating the user.');
        }
    }


    async update(payload: UserDto) :Promise<any>{
        const foundUser = await this.userRepository.findOneBy({userId: payload.userId});

        if (!foundUser) {
            throw new NotFoundException("User Not found");
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
       return updatedUser;

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

}
