import { Editor, Plugin, Menu, MenuItem, App } from 'obsidian';
import { bidiMarkViewPlugin } from './bidiMarkViewPlugin';
import { MARK } from './shared';

type MenuItemWithDom = MenuItem & {
	// Obsidian types does not support this for some reason.
	dom: HTMLElement;
};

type GlobalSearchInstance = { openGlobalSearch(query: string): void };
type AppWithInternals = App & {
	internalPlugins: {
		getPluginById(
			id: string,
		): { instance?: GlobalSearchInstance } | undefined;
	};
};

export const MARK_NAME_TO_LABEL = {
	RLM: 'Right-to-Left Mark',
	LRM: 'Left-to-Right Mark',
} as const;

export default class BidiMarkPlugin extends Plugin {
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

						(item as MenuItemWithDom).dom.addClass('menu-item-RLM');
					});

					menu.addItem((item) => {
						item.setIcon('arrow-right-from-line')
							.setTitle(MARK_NAME_TO_LABEL['LRM'])
							.onClick(() => {
								editor.replaceSelection(MARK.LRM);
							});

						(item as MenuItemWithDom).dom.addClass('menu-item-LRM');
					});
				},
			),
		);
	}

	private registerCommands() {
		this.addCommand({
			id: 'insert-right-to-left-mark',
			name: `Insert ${MARK_NAME_TO_LABEL['RLM']}`,
			icon: 'arrow-left-from-line',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.RLM);
			},
		});

		this.addCommand({
			id: 'insert-left-to-right-mark',
			name: `Insert ${MARK_NAME_TO_LABEL['LRM']}`,
			icon: 'arrow-right-from-line',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.LRM);
			},
		});

		this.addCommand({
			id: 'find-right-to-left-marks',
			name: 'Find Right-to-Left Marks',
			callback: () => {
				const search = (
					this.app as AppWithInternals
				).internalPlugins.getPluginById('global-search')?.instance;
				search?.openGlobalSearch(MARK.RLM);
			},
		});

		this.addCommand({
			id: 'find-left-to-right-marks',
			name: 'Find Left-to-Right Marks',
			callback: () => {
				const search = (
					this.app as AppWithInternals
				).internalPlugins.getPluginById('global-search')?.instance;
				search?.openGlobalSearch(MARK.LRM);
			},
		});
	}
}
