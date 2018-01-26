import { Service } from './service';
import { HTTPMethod } from '../models/httpMethod';
import { HTTPRequestParams } from '../models/httpRequestParams';
import _ from 'underscore';

export class UserService extends Service {
    constructor(client) {
        super(client, 'user');
        this.client = client;
    }
    async create(user) {
        const options = {
            username: this.client.authService.basicAuthCredentials.username,
            password: this.client.authService.basicAuthCredentials.password,
        };
        return this.post(undefined, options, user, false);
    }
    async logIn() {
        const user = {
            username: this.client.authService.userCredentials.username,
            password: this.client.authService.userCredentials.password
        };
        return this.post('logIn', undefined, user, false);
    }
}