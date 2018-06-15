"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendgrid = require("@sendgrid/mail");
const Database_1 = require("./Database");
class MailService {
    constructor(options) {
        if (!options || !options.apiKey) {
            throw new Error("An apiKey is required to interact with SendGrid!");
        }
        sendgrid.setApiKey(options.apiKey);
        this.service = sendgrid;
        this.db = new Database_1.DatabaseService();
        this.options = options;
    }
    send(mailOptions) {
        return this.service.send(mailOptions);
    }
}
exports.MailService = MailService;
//# sourceMappingURL=Mail.js.map