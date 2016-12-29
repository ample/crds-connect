# CRDS Connect Directives

## Only These Keys

This directive is designed to block all but specified keypresses. Useful for special field types like zip code or currency. Fall-back (if no regex provided) is alpha-numeric keys only. To use:

- import `only-these-keys.directive.ts` into your module
- add `OnlyTheseKeysDirective` to your module's declarations
- add the directive `onlyTheseKeys="YOURREGEX"` to your markup 
- replacing "YOURREGEX" with a valid regular expression to validate the key. 

This does not block special keys like control, shift, or tab.

Examples:
- `[0-9]` : Only allow number keys 0 - 9
- `[0-9\.]` : Only allow number keys 0 - 9 and the . symbol
- `[TURD]` : Only allow letters T, U, R, D
