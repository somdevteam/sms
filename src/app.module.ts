import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { BranchModule } from './modules/branch/branch.module';
import { ClassModule } from './modules/academicModule/class/class.module';
import { SubjectModule } from './modules/academicModule/subject/subject.module';
import { LevelModule } from './modules/academicModule/level/level.module';
import { LevelclassModule } from './modules/academicModule/levelclass/levelclass.module';
import { AcademicModule } from './modules/academicModule/academic/academic.module';
import { ClassSubjectModule } from './modules/academicModule/class-subject/class-subject.module';
import { ClassSectionModule } from './modules/academicModule/class-section/class-section.module';
import { SectionModule } from './modules/academicModule/section/section.module';
import { StudentModule } from './modules/studentModule/student/student.module';
import { ResponsibleModule } from './modules/studentModule/responsible/responsible.module';
import { StudentclassModule } from './modules/studentModule/studentclass/studentclass.module';
import { MenusModule } from './modules/menus/menus.module';
import { TabsModule } from './modules/tabs/tabs.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TabPermissions } from './modules/tabPermissions/entities/tabPermissions.entity';
import { RolesModule } from './modules/roles/roles.module';
import { UserTypesModule } from './modules/userTypes/userTypes.module';
import { UserTypePermissions } from './modules/usertypepermissions/usertypepermissions.entity';
import { TabPermissionsModule } from './modules/tabPermissions/tabPermissions.module';
import { UserRolesModule } from './modules/userroles/userroles.module';
import { RolePermissionsModule } from './modules/rolePermissions/rolePermissions.module';
import { ExamsModule } from './modules/exam-module/exams/exams.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { StudentExamMarksModule } from './modules/exam-module/student-exam-marks/student-exam-marks.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { AppDataSource } from './db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    BranchModule,
    ClassModule,
    SubjectModule,
    LevelModule,
    LevelclassModule,
    AcademicModule,
    ClassSubjectModule,
    SectionModule,
    ClassSectionModule,
    StudentModule,
    ResponsibleModule,
    StudentclassModule,
    MenusModule,
    TabsModule,
    PermissionsModule,
    TabPermissions,
    RolesModule,
    UserTypesModule,
    UserTypePermissions,
    TabPermissionsModule,
    UserRolesModule,
    RolePermissionsModule,
    ExamsModule,
    PaymentsModule,
    StudentExamMarksModule,
    AccountingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
