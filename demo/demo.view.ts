namespace $.$$ {

	export class $bog_selection_demo extends $.$bog_selection_demo {

		hotkey() {
			const mac = /Mac|iPhone|iPad/.test( this.$.$mol_dom_context.navigator.platform )
			return mac ? 'Cmd+A' : 'Ctrl+A'
		}

		override hint_text() {
			return `Поставь каретку в текст или в список и нажми ${ this.hotkey() }. Вместо выделения в буфер уйдёт исходник хозяина: markdown у текста, все строки у списка, даже те, что ещё не отрисованы.`
		}

		override article() {
			return [
				'# Заголовок',
				'',
				'Абзац с **жирным** и [ссылкой](https://mol.hyoo.ru).',
				'',
				'- пункт раз',
				'- пункт два',
				'',
				'```ts',
				'const answer = 42',
				'```',
			].join( '\n' )
		}

		row_count() {
			return 1000
		}

		@ $mol_mem
		override rows() {
			return Array.from( { length: this.row_count() }, ( _, i )=> this.Row( i ) )
		}

		override row_title( i: number ) {
			return `Строка ${ i + 1 } из ${ this.row_count() }`
		}

		@ $mol_mem
		override list_text() {
			return Array.from( { length: this.row_count() }, ( _, i )=> this.row_title( i ) ).join( '\n' )
		}

	}

}
