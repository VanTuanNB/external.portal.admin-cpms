/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class SchoolService extends BaseCoreService {
    constructor() {
        super();
    }

    public getList(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.school.getById, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public update(option: IParamsRequestApi): void {
        console.log('option', option);
        this.requestApiWithAuth(API_DOCUMENT.school.update, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
