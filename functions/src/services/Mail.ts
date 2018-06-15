import * as sendgrid from "@sendgrid/mail";

import { DatabaseService } from "./Database";

export class MailService {
  service: any;
  protected options: {
    apiKey: string;
    defaultTemplateId?: string;
  };
  protected db: DatabaseService;

  constructor(options: { apiKey: string; defaultTemplateId?: string }) {
    if (!options || !options.apiKey) {
      throw new Error("An apiKey is required to interact with SendGrid!");
    }
    sendgrid.setApiKey(options.apiKey);
    this.service = sendgrid;
    this.db = new DatabaseService();
    this.options = options;
  }

  send(mailOptions: any) {
    return this.service.send(mailOptions);
  }
}
