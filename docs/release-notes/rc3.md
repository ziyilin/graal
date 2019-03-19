## 1.0-RC3
(2018-06-29)
### GraalVM for Java developers (GraalVM + compiler)

* Updated the underlying JDK version to “1.8.0_172” from “1.8.0_171”. You can find the JDK release notes at the [Oracle Technology Network](http://www.oracle.com/technetwork/java/javase/8u172-relnotes-4308893.html) website.
* Fixed a rare NullPointerException during JVMCI initialization.

### Native image generation

* Added support for java.lang.reflect.Proxy supporting both automatic detection and manual configuration. Please refer to [the documentation on GitHub](https://github.com/oracle/graal/blob/master/substratevm/DYNAMIC_PROXY.md) for the details.
* Added support for `Classloader.getResource()` and similar methods.
* Added support for loading services through `theServiceLoader`.
* Fixed a `ClassCastException` on generating native images for profile-guided-optimizations (with the `--pgo-instrument` command line option).

### JavaScript

* Enabled code sharing between Contexts with the same Engine.
* Added support for `BigInt` arithmetic expressions.
* Added a flag for the Nashorn compatibility mode `--js.nashorn-compat`, for the details and migration from Nashorn please [refer to the documentation](https://github.com/graalvm/graaljs/blob/master/docs/user/NashornMigrationGuide.md).
* Rename the flag for the V8 compatibility mode to `js.v8-compat`.

More details can be found in the [project changelog on GitHub](https://github.com/graalvm/graaljs/blob/master/CHANGELOG.md#version-100-rc3).

### Ruby

The full [changelog is available](https://github.com/oracle/truffleruby/blob/master/CHANGELOG.md#10-rc-3-2-july-2018) in the GitHub repository, but here are some of the most notable changes.

* Added ability to call `is_a?` on foreign objects.
* Fixed: Qnil/Qtrue/Qfalse/Qundef can now be used as initial value for global variables in C extensions.
* Fixed: SIGPIPE is correctly caught on SubstrateVM, and the corresponding `write()` raises `Errno::EPIPE` when the read end of a pipe or socket is closed.
* Fixed determining the source encoding for `eval()` based on the magic encoding comment.

Additionally, we implemented a number of performance improvements for `stat()` related calls, `eval()`, String substitutions, reading from IO and more.

### Python

GraalVM Python implementation is still in the early stages, but we’re making progress towards the goal of running applications which use SciPy.

* Various C-API improvements allow to run **simple NumPy examples.**
* Implemented buffered I/O and more encodings support, which enables working with files through the standard open function without having to force unbuffered access, and enables working with files that have encodings other than utf-8.
* Most math module functions are now implemented and work correctly.
* The random module substitute was removed and we now run the standard library random module to be fully compatible.
* Improved thread-safety in the embedded scenarios when using Python contexts from multiple threads.

More details are available in [the project’s changelog](https://github.com/graalvm/graalpython/blob/master/CHANGELOG.md#version-100-rc3) on GitHub.

### R

* Added more missing R builtins and C API functions, see [CHANGELOG](https://github.com/oracle/fastr/blob/master/CHANGELOG.md#10-rc-3) for a complete list.
* Simplified installation, the script that configures FastR for the current system  `jre/languages/R/bin/configure_fastr` does not require Autotools anymore.
* Added configuration files to allow users to build a native image of the FastR runtime, which reduces the startup time. Run `jre/languages/R/bin/install_r_native_image` to build the image.
* Fixed an issue with the plotting window not displaying anything after it was closed and reopened.

### LLVM interpreter for C/C++ & other native languages

* New builtins _polyglot_from_typed_ and _polyglot_as_typed_, which can be used to dynamically attach types to polyglot objects.
* Implementers of TruffleObject can now respond to the `GetDynamicType` message to provide a type when an object is accessed from LLVM code.

More details are available in [the project changelog](https://github.com/graalvm/sulong/blob/master/CHANGELOG.md).

### API changes for GraalVM integrators

* Added support for [logging](http://www.graalvm.org/sdk/javadoc/org/graalvm/polyglot/Context.Builder.html#logHandler-java.util.logging.Handler-) in Truffle languages and instruments.
* Removed deprecated ResultVerifier.getDefaultResultVerifier API.

To see the list of changes to the APIs please refer to the project changelogs:

* [Graal SDK changelog](https://github.com/oracle/graal/blob/master/sdk/CHANGELOG.md#version-10-rc3)
* [Truffle changelog](https://github.com/oracle/graal/blob/master/truffle/CHANGELOG.md#version-100-rc3)

### Tools

##### VisualVM

We improved memory footprint and introduced several UI improvements for cleaner more responsive experience of VisualVM. In addition to that, there are the following improvements:

* Added recognition of the LLVM interpreter (Sulong) processes.
* Improved displaying logical values of guest languages’ objects.
* Improved the Object Query Language (OQL) Console for inspecting memory dumps functionality — sorting, filtering, aggregation, unlimited number of results now work.

#### Chrome inspector

* Multiple inspector sessions for multiple polyglot engines can run on the same port now.
