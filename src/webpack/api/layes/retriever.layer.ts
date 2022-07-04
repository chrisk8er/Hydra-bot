import { ListenerLayer } from './listener.layes';
import { Page, Browser } from 'puppeteer';
import { CreateOptions } from '../../model/interface';

export class RetrieverLayer extends ListenerLayer {
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: any
  ) {
    super(page, browser, options, ev);
  }

  /**
   * returns a list of contacts
   * @returns contacts
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => API.getAllContacts());
  }
}