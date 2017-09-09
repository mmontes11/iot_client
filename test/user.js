import chai from '../lib/chai';
import server from '../iot_backend/index';
import serverConfig from '../iot_backend/config/index';
import { UserModel } from '../iot_backend/src/models/db/user';
import IotClient from '../index';
import constants from './constants';
import httpStatus from 'http-status';

const assert = chai.assert;
const should = chai.should();
const host = `http://localhost:${serverConfig.nodePort}`;
const basicAuthUser = Object.keys(serverConfig.basicAuthUsers)[0];
const basicAuthPassword = serverConfig.basicAuthUsers[basicAuthUser];
const client = new IotClient({
    host,
    basicAuthUser,
    basicAuthPassword
});
const clientWithInvalidCredentials = new IotClient({
    host,
    basicAuthUser: 'foo',
    basicAuthPassword: 'bar'
});

describe('User', () => {

    beforeEach((done) => {
        UserModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            done();
        });
    });

    describe('POST /user 401', () => {
        it('tries to create a user with invalid credentials', (done) => {
            const promise = clientWithInvalidCredentials.userService.createUser(constants.validUser);
            promise.should.eventually.have.property('statusCode', httpStatus.UNAUTHORIZED)
                .and.should.be.rejected.notify(done);
        })
    });

    describe('POST /user', () => {
        it('creates an user', (done) => {
            client.userService.createUser(constants.validUser).should.be.fulfilled.notify(done);
        });
    });

    after((done) => {
        server.close((err) => {
            done(err);
        });
    });
});