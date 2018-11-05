## 1.0-RC7
(2018-10-03)
### GraalVM for Java developers (GraalVM + compiler)

* Added the virtualization of `Unsafe` compare and swap calls, for more details see [GH-636](https://github.com/oracle/graal/pull/636).

### Native image generation

* Support for the Java security framework, see [JCA-SECURITY-SERVICES.md](https://github.com/oracle/graal/blob/master/substratevm/JCA-SECURITY-SERVICES.md) for the details.
* Support for `https` URL connections, see [URL-PROTOCOLS.md](https://github.com/oracle/graal/blob/master/substratevm/URL-PROTOCOLS.md) for more details.

### JavaScript

* Improved support for sharing of shapes between Contexts with the same Engine, which allows to reuse ASTs and objects across different manually created contexts.
* Support for `BigInteger` typed TypedArrays.

More details can be found in the [project changelog on GitHub](https://github.com/graalvm/graaljs/blob/master/CHANGELOG.md ).

### LLVM interpreter (Sulong)
The full [changelog](https://github.com/oracle/graal/blob/master/sulong/CHANGELOG.md) is available on GitHub.

* New polyglot builtin `polyglot_has_member`.
* Removed support for implicit polyglot types for local variables as the availability of type information is not guaranteed. Explicit polyglot casts are now strictly required (`polyglot_as_typed`). See [docs/INTEROP.md](https://ol-bitbucket.us.oracle.com/projects/G/repos/graal/browse/sulong/docs/INTEROP.md) and [polyglot.h](https://ol-bitbucket.us.oracle.com/projects/G/repos/graal/browse/sulong/projects/com.oracle.truffle.llvm.libraries.bitcode/include/polyglot.h) for more details.
* Support for IR-level (textual representation of bitcode files) tracing, i.e., creating an execution log of all bitcodes that were executed, for debugging purposes.
* Preliminary support for LLVM 7.

### Ruby
The complete [changelog](https://github.com/oracle/truffleruby/blob/master/CHANGELOG.md) is available on GitHub. Here is a short list of most notable changes.

* Useful `inspect` strings have been added for more foreign objects.
* Added the `rbconfig/sizeof` native extension for better MRI compatibility.
* Support for `pg` 1.1. The extension now compiles successfully, but may still have issues with some datatypes.
* `readline` can now be interrupted by the interrupt signal (`Ctrl+C`). This fixes `Ctrl+C` to work in IRB.
* Fixed version check preventing TruffleRuby from working with Bundler 2.0 and later.
* Removed obsoleted patches for Bundler compatibility now that Bundler 1.16.5 has built-in support for TruffleRuby.
* Fixed problem with `Kernel.public_send` not tracking its caller properly
`rb_thread_call_without_gvl()` no longer holds the C-extensions lock.
* Fixed `caller_locations` when called inside `method_added`.
* Fixed `mon_initialize` when called inside `initialize_copy`.

### Python

* Added support for the `re.split` builtin.
* Enhanced the `java` interop builtin module with introspection utility methods.
* Changes in C extension interface to reduce overhead.

The [changelog](https://github.com/graalvm/graalpython/blob/master/CHANGELOG.md)
is available on GitHub.

### R

* AWT based graphics devices (jpg, png, X11, ...) is supported when running FastR as a native image.
* `eval.polyglot`: the parameter `source` was renamed to `code`.
* New builtin `as.data.frame.polyglot.value` creates R data frames from Polyglot objects (KEYS are used as column names, the values must be homogenous arrays, e.g. respond to HAS_SIZE).
* Paths in `eval.polyglot` are resolved relative to the current working directory.
* Various fixes necessary to pass _dplyr_ tests (GitHub version of _dplyr_).

More details can be found in the project [changelog](https://github.com/oracle/fastr/blob/master/CHANGELOG.md) on GitHub.

### Tools
**Ideal Graph Visualizer**
* User can navigate to Javascript (guest language) source from the graph nodes.
* Ideal Graph Visualizer prompts to download plugins to support Javascript editing.
* Simple scripts (written in Javascript) can be applied on graph data.

### API changes for GraalVM integrators (SDK + Truffle)

* Truffle and GraalSDK license changes from GPL2 with Class Path Exception to the Universal Permissive License (UPL). Please refer to the license files for more information: [Truffle license](https://github.com/oracle/graal/blob/master/truffle/LICENSE.md), [Graal-SDK license](https://github.com/oracle/graal/blob/master/sdk/LICENSE.md).

To see the list of changes to the APIs, please refer to the project changelogs:
- [Graal SDK changelog](https://github.com/oracle/graal/blob/master/sdk/CHANGELOG.md)
- [Truffle changelog](https://github.com/oracle/graal/blob/master/truffle/CHANGELOG.md)
