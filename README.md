# $bog_selection

Плагин: Ctrl+A (на маке Cmd+A) внутри хозяина кладёт в буфер его исходный текст, а не выделяет отрисованное.

```tree
<= Article $mol_text
	text <= article \
	plugins /
		<= Article_selection $bog_selection
			text <= article
```

`text` — то, что уйдёт в буфер. Пустой текст — плагин не вмешивается, Ctrl+A работает как обычно.

## Как работает

Один статический `keydown` на документе. По Ctrl+A (или Cmd+A) плагин ищет ближайший `[bog_selection]` вокруг каретки, а без выделения — вокруг фокуса. Внутри `input`, `textarea` и `contenteditable` не вмешивается. Если у найденного хозяина `text()` непустой, событие гасится и текст пишется через `navigator.clipboard.writeText`. Ничего не выделяется и не рендерится, поэтому у виртуализованного `$mol_list` в буфер попадают и строки за пределами окна.

Портировано из PR [hyoo-ru/mam_mol#888](https://github.com/hyoo-ru/mam_mol/pull/888).

## Демо

https://b-on-g.github.io/selection/
