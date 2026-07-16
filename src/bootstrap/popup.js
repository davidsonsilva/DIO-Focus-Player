import { ChromeSettingsRepository } from '../infrastructure/chrome/ChromeSettingsRepository.js';
import { PopupController } from '../presentation/popup/PopupController.js';

new PopupController({ settingsRepository: new ChromeSettingsRepository() })
  .start()
  .catch((error) => console.warn('[DIO Focus Player] Popup indisponível.', error));
