namespace $.$$ {

	export class $bog_selection_demo extends $.$bog_selection_demo {

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
