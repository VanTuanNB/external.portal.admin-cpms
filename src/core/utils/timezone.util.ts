import dayjs, { Dayjs } from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';
import { FormatDate } from '../constants/common.constant';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

export class TimezoneUtil {
    private static timezone = 'Asia/Ho_Chi_Minh';

    public static getTimezone() {
        return this.timezone;
    }

    public static formatCurrentTimezone(date: string, format?: FormatDate) {
        return dayjs(date).tz(this.timezone).format(format);
    }

    public static setUTCTimezone(date: Dayjs | string) {
        return dayjs(date).utc().format();
    }

    public static parseCurrentTimezone(date: string | Dayjs, format?: FormatDate) {
        return dayjs(date).tz(this.timezone).format(format);
    }

    public static formatDate(date: Dayjs) {
        return dayjs(date).format();
    }
}
