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

const MARKS = {
	RLM: '\u200F',
	LRM: '\u200E',
};

const MARK_ARIA_LABELS: Record<string, string> = {
	'\u200F': 'Right-to-Left Mark',
	'\u200E': 'Left-to-Right Mark',
};

const MARKS_BY_CODE: Record<string, string> = {
	'\u200F': 'RLM',
	'\u200E': 'LRM',
};

const MARK_SHAPES: Record<string, string> = {
	// '\u200F': '⇥',
	// '\u200E': '⇤',
	'\u200F': '↤',
	'\u200E': '↦',
};

const MARK_LABELS: Record<string, string> = {
	'\u200F': 'RLM',
	'\u200E': 'LRM',
};

class BidiMarkWidget extends WidgetType {
	markType: 'lines' | 'shape' | 'label' | 'unicode' | 'custom' = 'lines';

	constructor(private char: string) {
		super();
	}

	eq(other: BidiMarkWidget) {
		return other.char === this.char;
	}

	toDOM() {
		const span = document.createElement('span');
		span.classList.add(
			'bidi-mark-widget',
			`bidi-mark-widget--${MARKS_BY_CODE[this.char]}`,
		);
		if (this.markType === 'lines') {
			span.classList.add('bidi-mark-widget--lines');
			span.textContent = ' ';
		}
		if (this.markType === 'shape') {
			span.classList.add('bidi-mark-widget--shape');
			span.textContent = MARK_SHAPES[this.char]!;
		}
		if (this.markType === 'label') {
			span.textContent = `[${MARK_LABELS[this.char]!}]`;
		}
		if (this.markType === 'unicode') {
			span.textContent = `[${
				MARK_LABELS[this.char] ??
				'U+' + this.char.codePointAt(0)!.toString(16).toUpperCase()
			}]`;
		}

		span.setAttribute('aria-label', MARK_ARIA_LABELS[this.char]!);
		return span;
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
		const chars = Object.values(MARKS);

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
