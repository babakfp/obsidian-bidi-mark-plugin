import { Editor, Plugin, Menu } from 'obsidian';
import { bidiMarkViewPlugin } from './bidiMarkViewPlugin';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerCustomContextMenuItems();
		this.registerEditorExtension([bidiMarkViewPlugin]);
	}

	private registerCustomContextMenuItems() {
		this.registerEvent(
			this.app.workspace.on(
				'editor-menu',
				(menu: Menu, editor: Editor) => {
					menu.addItem((item) => {
						item.setIcon('arrow-left-from-line')
							.setTitle('Right-to-Left Mark')
							.onClick(() => {
								editor.replaceSelection('\u200F');
							});
					});
					menu.addItem((item) => {
						item.setIcon('arrow-right-from-line')
							.setTitle('Left-to-Right Mark')
							.onClick(() => {
								editor.replaceSelection('\u200E');
							});
					});
				},
			),
		);
	}
}
