import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export interface MyPluginSettings {
	rightToLeftMark: string;
	leftToRightMark: string;
	markType: 'lines' | 'shapes' | 'custom';
}

export const DEFAULT_SETTINGS: Partial<MyPluginSettings> = {
	rightToLeftMark: 'default',
	leftToRightMark: 'default',
	markType: 'lines',
};

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const markType = new Setting(containerEl)
			.setName('Mark type')
			.addDropdown((c) =>
				c
					.addOptions({
						lines: 'Lines',
						shapes: 'Shapes',
						custom: 'Custom',
					})
					.setValue(this.plugin.settings.markType),
			);

		new Setting(containerEl).setName('Right-to-Left Mark').addText((text) =>
			text
				.setPlaceholder('Default: [RLM]')
				.setValue(this.plugin.settings.rightToLeftMark)
				.onChange(async (value) => {
					this.plugin.settings.rightToLeftMark = value.trim();
					await this.plugin.saveSettings();
				})
				.setDisabled(this.plugin.settings.markType !== 'custom'),
		);

		new Setting(containerEl).setName('Left-to-Right Mark').addText((text) =>
			text
				.setPlaceholder('Default: [LRM]')
				.setValue(this.plugin.settings.leftToRightMark)
				.onChange(async (value) => {
					this.plugin.settings.leftToRightMark = value.trim();
					await this.plugin.saveSettings();
				}),
		);
	}
}
