export enum FormatDate {
    CLIENT_DATE = 'DD/MM/YYYY',
    CLIENT_DATE_TIME = 'DD/MM/YYYY HH:mm:ss',
    SERVER_DATE = 'YYYY-MM-DD',
    SERVER_DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
    UTC_DATE_TIME = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
}

export enum EnumUserRole {
    ROOT_ADMIN = 1,
    USER = 2,
}

export enum EnumUserCourseStatus {
    PENDING = 1,
    PROCESSING = 2,
    COMPLETED = 3,
}
