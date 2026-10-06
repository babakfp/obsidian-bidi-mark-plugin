import i18next from 'i18next'
import { App, Editor, Menu, MenuItem, Plugin } from 'obsidian'
import { bidiMarkViewPlugin } from './bidiMarkViewPlugin'
import { loadI18n } from './i18n'
import { MARK } from './shared'

type MenuItemWithDom = MenuItem & {
	// Obsidian types does not support this for some reason.
	dom: HTMLElement
}

type GlobalSearchInstance = { openGlobalSearch(query: string): void }
type AppWithInternals = App & {
	internalPlugins: {
		getPluginById(
			id: string,
		): { instance?: GlobalSearchInstance } | undefined
	}
}

export default class BidiMarkPlugin extends Plugin {
	async onload() {
		await loadI18n()
		this.registerContextMenuItems()
		this.registerCommands()
		this.registerEditorExtension([bidiMarkViewPlugin])
	}

	private registerContextMenuItems() {
		this.registerEvent(
			this.app.workspace.on(
				'editor-menu',
				(menu: Menu, editor: Editor) => {
					menu.addItem((item) => {
						item.setIcon('arrow-left-from-line')
							.setTitle(i18next.t('Right-to-Left Mark'))
							.onClick(() => {
								editor.replaceSelection(MARK.RLM)
							})

						;(item as MenuItemWithDom).dom.addClass('menu-item-RLM')
					})

					menu.addItem((item) => {
						item.setIcon('arrow-right-from-line')
							.setTitle(i18next.t('Left-to-Right Mark'))
							.onClick(() => {
								editor.replaceSelection(MARK.LRM)
							})

						;(item as MenuItemWithDom).dom.addClass('menu-item-LRM')
					})
				},
			),
		)
	}

	private registerCommands() {
		this.addCommand({
			id: 'insert-right-to-left-mark',
			name: i18next.t('Insert Right-to-Left Mark'),
			icon: 'arrow-left-from-line',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.RLM)
			},
		})

		this.addCommand({
			id: 'insert-left-to-right-mark',
			name: i18next.t('Insert Left-to-Right Mark'),
			icon: 'arrow-right-from-line',
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(MARK.LRM)
			},
		})

		this.addCommand({
			id: 'find-right-to-left-marks',
			name: i18next.t('Find Right-to-Left Marks'),
			callback: () => {
				const search = (
					this.app as AppWithInternals
				).internalPlugins.getPluginById('global-search')?.instance
				search?.openGlobalSearch(MARK.RLM)
			},
		})

		this.addCommand({
			id: 'find-left-to-right-marks',
			name: i18next.t('Find Left-to-Right Marks'),
			callback: () => {
				const search = (
					this.app as AppWithInternals
				).internalPlugins.getPluginById('global-search')?.instance
				search?.openGlobalSearch(MARK.LRM)
			},
		})
	}
}
