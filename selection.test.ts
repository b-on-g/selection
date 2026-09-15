namespace $ {

	class $bog_selection_test_host extends $mol_list {

		text() {
			return ''
		}

		@ $mol_mem
		Selection() {
			return $bog_selection.make({ $: this.$, text: ()=> this.text() })
		}

		override plugins() {
			return [ this.Selection() ]
		}

	}

	$mol_test({

		'Ctrl+A around the caret copies the owner source text'( $ ) {

			const doc = $.$mol_dom_context.document
			const navigator = $.$mol_dom_context.navigator
			const written = [] as string[]
			const clipboard = Object.getOwnPropertyDescriptor( navigator, 'clipboard' )
			Object.defineProperty( navigator, 'clipboard', {
				value: { writeText: ( text: string )=> { written.push( text ) } },
				configurable: true,
			})

			const row = ()=> [ $mol_view.make({ $, sub: ()=> [ 'row' ] }) ]
			const host = $bog_selection_test_host.make({ $, rows: row, text: ()=> 'source' })
			const empty = $bog_selection_test_host.make({ $, rows: row })
			const outside = doc.createElement( 'p' )
			outside.textContent = 'outside'

			const press = ()=> {
				const event = new $.$mol_dom_context.KeyboardEvent( 'keydown', { code: 'KeyA', ctrlKey: true, bubbles: true, cancelable: true } )
				doc.dispatchEvent( event )
				return event.defaultPrevented
			}

			const copy = ()=> {
				let data = null as string | null
				const event = new $.$mol_dom_context.Event( 'copy', { bubbles: true, cancelable: true } )
				Object.defineProperty( event, 'clipboardData', { value: { setData: ( type: string, text: string )=> { data = text } } } )
				doc.dispatchEvent( event )
				return data
			}

			try {

				doc.body.appendChild( host.dom_tree() )
				doc.body.appendChild( empty.dom_tree() )
				doc.body.appendChild( outside )

				doc.getSelection()!.collapse( outside.firstChild, 0 )
				$mol_assert_equal( press(), false )

				doc.getSelection()!.collapse( host.dom_node().firstChild, 0 )
				$mol_assert_equal( press(), true )
				$mol_assert_equal( written, [ 'source' ] )

				doc.getSelection()!.collapse( empty.dom_node().firstChild, 0 )
				$mol_assert_equal( press(), false )
				$mol_assert_equal( written, [ 'source' ] )

				doc.getSelection()!.selectAllChildren( host.dom_node() )
				$mol_assert_equal( copy(), 'source' )

				doc.getSelection()!.collapse( host.dom_node().firstChild, 0 )
				$mol_assert_equal( copy(), null )

			} finally {

				doc.getSelection()!.removeAllRanges()
				host.dom_node().remove()
				empty.dom_node().remove()
				outside.remove()
				host.destructor()
				empty.destructor()
				if( clipboard ) Object.defineProperty( navigator, 'clipboard', clipboard )
				else delete ( navigator as any ).clipboard

			}
		},

	})

}
