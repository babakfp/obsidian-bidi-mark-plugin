import { Editor, Plugin, Menu } from 'obsidian';
import { bidiMarkViewPlugin } from './bidiMarkViewPlugin';
import { MARK } from './shared';

export const MARK_NAME_TO_LABEL = {
	RLM: 'Right-to-Left Mark',
	LRM: 'Left-to-Right Mark',
} as const;

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerContextMenuItems();
		this.registerCommands();
		this.registerEditorExtension([bidiMarkViewPlugin]);
	}

	private registerContextMenuItems() {
		this.registerEvent(
			this.app.workspace.on(
				'editor-menu',
				(menu: Menu, editor: Editor) => {
					menu.addItem((item) => {
						item.setIcon('arrow-left-from-line')
							.setTitle(MARK_NAME_TO_LABEL['RLM'])
							.onClick(() => {
								editor.replaceSelection(MARK.RLM);
							});
					});
					menu.addItem((item) => {
						item.setIcon('arrow-right-from-line')
							.setTitle(MARK_NAME_TO_LABEL['LRM'])
							.onClick(() => {
								editor.replaceSelection(MARK.LRM);
							});
					});
				},
			),
		);
	}

	private registerCommands() {
		this.addCommand({
			id: 'insert-right-to-left-mark',
			name: 'Insert Right-to-Left Mark at line start',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.RLM);
			},
		});

		this.addCommand({
			id: 'insert-left-to-right-mark',
			name: 'Insert Left-to-Right Mark at line start',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.LRM);
			},
		});
	}
}
