import { Editor, Plugin, Menu } from 'obsidian';
import { bidiMarkViewPlugin } from './bidiMarkViewPlugin';

const RLM = '\u200F';
const LRM = '\u200E';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerCustomContextMenuItems();
		this.registerCommands();
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
								editor.replaceSelection(RLM);
							});
					});
					menu.addItem((item) => {
						item.setIcon('arrow-right-from-line')
							.setTitle('Left-to-Right Mark')
							.onClick(() => {
								editor.replaceSelection(LRM);
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
				editor.replaceSelection(RLM);
			},
		});

		this.addCommand({
			id: 'insert-left-to-right-mark',
			name: 'Insert Left-to-Right Mark at line start',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(LRM);
			},
		});
	}
}
