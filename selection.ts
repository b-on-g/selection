namespace $ {

	/** Plugin which makes Ctrl+A select the nearest view with source text around the caret and copy that text instead of the rendered part. */
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
			const target = this.target( this.anchor() )
			if( !target ) return
			event.preventDefault()
			this.$.$mol_dom_context.document.getSelection()?.selectAllChildren( target.node )
			this.$.$mol_dom_context.navigator.clipboard.writeText( target.text )
		}

		static copying( event: ClipboardEvent ) {
			if( event.defaultPrevented ) return
			const selection = this.$.$mol_dom_context.document.getSelection()
			if( !selection?.rangeCount ) return
			const range = selection.getRangeAt( 0 )
			const common = range.commonAncestorContainer
			const target = this.target( common.nodeType === 1 ? common as Element : common.parentElement )
			if( !target ) return
			if( range.cloneContents().textContent !== target.node.textContent ) return
			event.clipboardData?.setData( 'text/plain', target.text )
			event.preventDefault()
		}

		static anchor() {
			const doc = this.$.$mol_dom_context.document
			const active = doc.activeElement
			if( active?.matches( 'input, textarea, [contenteditable]' ) ) return null
			const selection = doc.getSelection()
			const node = selection?.rangeCount ? selection.anchorNode : null
			return ( node?.nodeType === 1 ? node as Element : node?.parentElement ) ?? active
		}

		static target( anchor: Element | null | undefined ) {
			const host = anchor?.closest( '[bog_selection]' )
			const plugin = host && this.hosts.get( host )
			return plugin?.target( anchor ) ?? null
		}

		static found( view: $mol_view, anchor: Element ): { node: Element, text: string } | null {
			const node = $mol_wire_probe( ()=> view.dom_node() )
			if( !node?.contains( anchor ) ) return null
			const text = ( view as { text?: ()=> unknown } ).text?.()
			if( typeof text === 'string' && text ) return { node, text }
			for( const sub of $mol_wire_probe( ()=> view.sub() ) ?? [] ) {
				if( !( sub instanceof $mol_view ) ) continue
				const found = this.found( sub, anchor )
				if( found ) return found
			}
			return null
		}

		target( anchor: Element ) {
			const text = this.text()
			if( text ) return { node: this.dom_node(), text }
			return $bog_selection.found( this.owner(), anchor )
		}

		owner() {
			return $mol_owning_get< typeof this, $mol_wire_fiber< $mol_view, any, any > >( this )!.host!
		}

		override auto() {
			$bog_selection.listener()
			$bog_selection.hosts.set( this.dom_node(), this )
		}

	}

}
