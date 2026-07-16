import { EvaluateFocusMode } from '../application/EvaluateFocusMode.js';
import { ChromeSettingsRepository } from '../infrastructure/chrome/ChromeSettingsRepository.js';
import { ChromeStatusPresenter } from '../infrastructure/chrome/ChromeStatusPresenter.js';
import { DioElementLocator } from '../infrastructure/dio/DioElementLocator.js';
import { DioPageLayoutAdapter } from '../infrastructure/dio/DioPageLayoutAdapter.js';
import { DioPageObserver } from '../infrastructure/dio/DioPageObserver.js';
import { ContentController } from '../presentation/content/ContentController.js';

const settingsRepository = new ChromeSettingsRepository();
const pageLayout = new DioPageLayoutAdapter({ locator: new DioElementLocator() });
const evaluateFocusMode = new EvaluateFocusMode({
  pageLayout,
  settingsRepository,
  statusPresenter: new ChromeStatusPresenter(),
});

new ContentController({
  evaluateFocusMode,
  observer: new DioPageObserver({}),
  settingsRepository,
  pageLayout,
}).start();
