import rest from 'restler';
import _ from 'underscore';
import { URLBuilder } from '../helpers/urlBuilder';
import { HTTPMethod } from '../models/httpMethod';
import { HTTPRequest } from '../models/httpRequest';
import { HTTPRequestParams } from '../models/httpRequestParams';

export class Service {
    constructor(client, resource) {
        this.client = client;
        this.urlBuilder = new URLBuilder(this.client.host, resource);
    }
    async request(requestParams, shouldSetAccessToken) {
        let token = undefined;
        if (shouldSetAccessToken) {
            try {
                token = await this.client.authService.getToken();
            } catch (err) {
                throw err;
            }
        }
        const httpRequest = this._setupRequest(requestParams, token);
        return await httpRequest.start();
    }
    async get(path, options, shouldSetAccessToken = true) {
        const requestParams = new HTTPRequestParams(HTTPMethod.GET, path, options);
        return this.request(requestParams, shouldSetAccessToken);
    }
    async post(path, options, data, setAccessToken = true) {
        const requestParams = new HTTPRequestParams(HTTPMethod.POST, path, options, data);
        return this.request(requestParams, setAccessToken);
    }
    async del(path, options, data, setAccessToken = true) {
        const requestParams = new HTTPRequestParams(HTTPMethod.DELETE, path, options, data);
        return this.request(requestParams, setAccessToken);
    }
    _setupRequest(requestParams, accessToken) {
        let url;
        if (_.isUndefined(requestParams.path)) {
            url = this.urlBuilder.resourceUrl
        } else {
            url = this.urlBuilder.build(requestParams.path)
        }
        const serviceOptions = {
            headers: this.client.headers,
            accessToken
        };
        const options = Object.assign({}, serviceOptions, requestParams.options);
        return new HTTPRequest(requestParams.method, url, options, requestParams.data, this.client.log);
    }
}