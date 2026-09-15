namespace $ {

	/** Plugin which makes Ctrl+A select the whole owner and copy its source text instead of the rendered part. */
	export class $bog_selection extends $mol_plugin {

		text() {
			return ''
		}

		static hosts = new WeakMap< Element, $bog_selection >()

		@ $mol_mem
		static listener() {
			const doc = this.$.$mol_dom_context.document
			return [
				new $mol_dom_listener( doc, 'keydown', ( event: KeyboardEvent )=> this.keydown( event ), { passive: false } ),
				new $mol_dom_listener( doc, 'copy', ( event: ClipboardEvent )=> this.copying( event ), { passive: false } ),
			]
		}

		static keydown( event: KeyboardEvent ) {
			if( event.defaultPrevented ) return
			if( event.code !== 'KeyA' ) return
			if( !( event.ctrlKey || event.metaKey ) || event.altKey || event.shiftKey ) return
			const plugin = this.plugin()
			if( !plugin?.text() ) return
			event.preventDefault()
			plugin.select()
			plugin.copy()
		}

		static copying( event: ClipboardEvent ) {
			if( event.defaultPrevented ) return
			const plugin = this.selected()
			if( !plugin?.text() ) return
			event.clipboardData?.setData( 'text/plain', plugin.text() )
			event.preventDefault()
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

		static selected() {
			const selection = this.$.$mol_dom_context.document.getSelection()
			if( !selection?.rangeCount ) return null
			const range = selection.getRangeAt( 0 )
			const common = range.commonAncestorContainer
			const anchor = common.nodeType === 1 ? common as Element : common.parentElement
			const host = anchor?.closest( '[bog_selection]' )
			if( !host ) return null
			if( range.cloneContents().textContent !== host.textContent ) return null
			return this.hosts.get( host )
		}

		override auto() {
			$bog_selection.listener()
			$bog_selection.hosts.set( this.dom_node(), this )
		}

		select() {
			this.$.$mol_dom_context.document.getSelection()?.selectAllChildren( this.dom_node() )
		}

		copy() {
			return this.$.$mol_dom_context.navigator.clipboard.writeText( this.text() )
		}

	}

}
