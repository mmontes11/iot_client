import { Credentials } from './models/credentials';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { MeasurementService } from './services/measurementService';
import { ObservationsService } from './services/observationsService';
import { Log } from './util/log';
import defaultOptions from './config/defaultOptions'

export default class IotClient {
    constructor(optionsByParam) {
        const options = Object.assign({}, defaultOptions, optionsByParam);
        const basicAuthCredentials = new Credentials(options.basicAuthUsername, options.basicAuthPassword);
        const userCredentials = new Credentials(options.username, options.password);
        this.host = options.host;
        this.headers = options.headers;
        this.log = new Log(options.debug);
        this.authService = new AuthService(this, basicAuthCredentials, userCredentials);
        this.userService = new UserService(this);
        this.measurementService = new MeasurementService(this);
        this.observationsService = new ObservationsService(this);
    }
}