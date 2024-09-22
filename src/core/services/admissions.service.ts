/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class AdmissionsService extends BaseCoreService {
    constructor() {
        super();
    }

    public getList(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.admissions.getList, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public upgradeToStudent(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.admissions.upgradeToStudent, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public delete(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.admissions.delete, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
