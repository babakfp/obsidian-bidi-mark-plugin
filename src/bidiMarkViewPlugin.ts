import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { MARK } from './shared';

const MARK_CODE_TO_NAME = {
	[MARK.RLM]: 'RLM',
	[MARK.LRM]: 'LRM',
};
const MARK_CODE_TO_LABEL = {
	[MARK.RLM]: 'Right-to-Left Mark',
	[MARK.LRM]: 'Left-to-Right Mark',
};

class BidiMarkWidget extends WidgetType {
	constructor(private char: string) {
		super();
	}

	eq(other: BidiMarkWidget) {
		return other.char === this.char;
	}

	toDOM() {
		const name = MARK_CODE_TO_NAME[this.char]!;
		const label = MARK_CODE_TO_LABEL[this.char]!;
		return createSpan({
			cls: `cm-bidi-mark-${name}`,
			attr: {
				'aria-label': label,
			},
			text: ' ',
		});
	}

	ignoreEvent() {
		return false;
	}
}

class BidiMarkPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (
			update.docChanged ||
			update.viewportChanged ||
			update.selectionSet
		) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const chars = Object.values(MARK);

		for (const { from, to } of view.visibleRanges) {
			const text = view.state.doc.sliceString(from, to);
			for (let i = 0; i < text.length; i++) {
				const ch = text[i];
				if (ch && chars.includes(ch)) {
					const pos = from + i;
					builder.add(
						pos,
						pos + 1,
						Decoration.replace({
							widget: new BidiMarkWidget(ch),
						}),
					);
				}
			}
		}

		return builder.finish();
	}

	destroy() {}
}

const pluginSpec: PluginSpec<BidiMarkPlugin> = {
	decorations: (value: BidiMarkPlugin) => value.decorations,
};

export const bidiMarkViewPlugin = ViewPlugin.fromClass(
	BidiMarkPlugin,
	pluginSpec,
);
