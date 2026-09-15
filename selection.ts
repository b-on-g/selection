namespace $ {

	/** Plugin which makes Ctrl+A copy the owner source text instead of selecting the rendered part. */
	export class $bog_selection extends $mol_plugin {

		text() {
			return ''
		}

		static hosts = new WeakMap< Element, $bog_selection >()

		@ $mol_mem
		static listener() {
			const doc = this.$.$mol_dom_context.document
			return new $mol_dom_listener( doc, 'keydown', ( event: KeyboardEvent )=> this.keydown( event ), { passive: false } )
		}

		static keydown( event: KeyboardEvent ) {
			if( event.defaultPrevented ) return
			if( event.code !== 'KeyA' ) return
			if( !( event.ctrlKey || event.metaKey ) || event.altKey || event.shiftKey ) return
			const plugin = this.plugin()
			if( !plugin?.text() ) return
			event.preventDefault()
			plugin.copy()
		}

		static plugin() {
			const doc = this.$.$mol_dom_context.document
			const active = doc.activeElement
			if( active?.matches( 'input, textarea, [contenteditable]' ) ) return null
			const selection = doc.getSelection()
			const node = selection?.rangeCount ? selection.anchorNode : null
			const anchor = ( node?.nodeType === 1 ? node as Element : node?.parentElement ) ?? active
			const host = anchor?.closest( '[bog_selection]' )
			return host && this.hosts.get( host )
		}

		override auto() {
			$bog_selection.listener()
			$bog_selection.hosts.set( this.dom_node(), this )
		}

		copy() {
			return this.$.$mol_dom_context.navigator.clipboard.writeText( this.text() )
		}

	}

}
