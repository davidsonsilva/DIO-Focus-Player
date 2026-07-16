import { decideLayout } from '../domain/LayoutPolicy.js';
import { createStatus } from '../domain/Status.js';

export class EvaluateFocusMode {
  constructor({ pageLayout, settingsRepository, statusPresenter }) {
    this.pageLayout = pageLayout;
    this.settingsRepository = settingsRepository;
    this.statusPresenter = statusPresenter;
  }

  async execute() {
    const [settings, compatibility] = await Promise.all([
      this.settingsRepository.load(),
      this.pageLayout.inspect(),
    ]);
    const availableWidth = this.pageLayout.getAvailableWidth();
    const decision = decideLayout({
      settings,
      compatibility,
      availableWidth,
      isApplied: this.pageLayout.isFocusLayoutApplied(),
    });

    if (decision === 'enable' || (decision === 'no-change' && this.pageLayout.isFocusLayoutApplied())) {
      this.pageLayout.applyFocusLayout(settings);
    }
    if (decision === 'disable') this.pageLayout.restoreOriginalLayout();

    const status = createStatus({
      compatibility,
      applied: this.pageLayout.isFocusLayoutApplied(),
      availableWidth,
    });
    await this.statusPresenter.show(status);
    return { decision, status };
  }
}
