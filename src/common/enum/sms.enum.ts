export enum UserPermissions {
    VIEW_ROLE = 'viewRole',
    VIEW_PERMISSION = 'viewPermission',
    CREATE_USER = 'createUser',
    VIEW_USER = 'viewUsers',
    VIEW_FEES = 'userCanViewFees',
    ADD_FEES ='userCanAddFees',
}

export enum FeesPermissions {
    VIEW_USER = 'viewUsers',
    VIEW_FEES = 'userCanViewFees',
    ADD_FEES ='userCanAddFees',
}
export enum Month {
    'jan' = 1,
    'fab' = 2,
    'mar' = 3,
    'apr' = 4,
    'may' = 5,
    'jun' = 6,
    'jul' = 7,
    'aug' = 8,
    'sep' = 9,
    'oct' =10,
    'nov' =11,
    'dec' =12
}

export function createFullName(firstName: string, middleName: string, lastName: string): string {
    firstName = trimString(firstName);
    middleName = trimString(middleName);
    lastName = trimString(lastName);

    let fullName = `${firstName} ${middleName} ${lastName}`.trim();

    if (fullName) {
        fullName = trimString(fullName).toLowerCase();
    }

    return fullName.replace(/[^a-zA-Z0-9\/ ]/g, '');
}

// Helper function to trim strings
function trimString(str: string): string {
    return str ? str.replace(/\s\s+/g, ' ').trim() : '';
}

