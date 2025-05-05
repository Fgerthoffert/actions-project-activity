I wanted to keep simple standalone HTML files without having to complexify the
frameworks being used.

Tried with a
[rollup plugin](https://github.com/ExposedCat/rollup-plugin-string-import), but
the content of the HTML file was actually causing some issues once bundled in
dist/index.js

Ended up taking a more barebone approach, a script is present in the
/templates/, in generates a compiled version of the templates.
