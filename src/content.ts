import { EnterpriseFormFiller } from './core/form-filler';
import { Logger } from './utils/logger';

const enterpriseFormFiller = new EnterpriseFormFiller();
enterpriseFormFiller.init();

Logger.info('Sabi Filler content script loaded successfully');
