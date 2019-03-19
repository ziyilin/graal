## 1.0-RC9
(2018-11-05)

### GraalVM for Java Developers (GraalVM + compiler)
* Updated based JDK to 8u192. You can find the JDK release notes at the [Oracle Technology Network](https://www.oracle.com/technetwork/java/javase/8u192-relnotes-4479409.html) website.

### Ruby
GraalVM 1.0-rc9 implementation of Ruby features security updates and multiple bug fixes
which can be found in the project [changelog](https://github.com/oracle/truffleruby/blob/master/CHANGELOG.md#10-rc-9-5-november-2018) on GitHub.  Here is a short list of most notable changes:

* LLVM for Oracle Linux 7 can now be installed without building from source.
* The supported version of LLVM for Oracle Linux has been updated from 3.8 to 4.0.
* `mysql2` is now patched to avoid a bug in passing NULL to `rb_scan_args`, and now passes the majority of its test suite.
* The post-install script now automatically detects if recompiling the OpenSSL C extension is needed. The post-install script should always be run in TravisCI as well, see the [documentation](https://github.com/oracle/truffleruby/blob/master/doc/user/standalone-distribution.md).
* Detect when the system `libssl` is incompatible more accurately and add instructions on how to recompile the extension.

### Python
* Added the support `help` in the builtin Python shell.
* Added `readline` to enable history and autocompletion in the Python shell.
* Add support for the `-q`, `-E`, `-s`, and `-S` Python launcher flags.
* Improved support for string and bytes regular expressions using our TRegex engine.
* Started the initial support for the `binascii` module.

A complete project [changelog](https://github.com/graalvm/graalpython/blob/master/CHANGELOG.md#version-100-rc9) is available on GitHub.

### R
* Various improvements in handling of foreign objects in R.
* Added missing R builtins and C API: `eapply builtin` and `rapply builtin`.

More details can be found in the project [changelog](https://github.com/oracle/fastr/blob/master/CHANGELOG.md#10-rc-9) on GitHub.

### JavaScript
A complete [changelog](https://github.com/graalvm/graaljs/blob/master/CHANGELOG.md) is available on GitHub.

### LLVM interpreter (Sulong)
The project [changelog](https://github.com/oracle/graal/blob/master/sulong/CHANGELOG.md) is available on GitHub.

### API changes for GraalVM integrators (SDK + Truffle)
* Added `SourceElement.ROOT` and `StepConfig.suspendAnchors()` to tune debugger stepping.
* Added [Context.Builder.logHandler](http://www.graalvm.org/sdk/javadoc/org/graalvm/polyglot/Context.Builder.html#logHandler-java.io.OutputStream-) and [Engine.Builder.logHandler](http://www.graalvm.org/sdk/javadoc/org/graalvm/polyglot/Engine.Builder.html#logHandler-java.io.OutputStream-) methods to install a logging handler writing into a given `OutputStream`.
* Primitives, host and `Proxy` values can now be shared between multiple context and engine instances. They no longer throw an `IllegalArgumentException` when shared.

The major Truffle and Graal SDK changes between GraalVM versions are summarized in the project changelogs:
- [Graal SDK changelog](https://github.com/oracle/graal/blob/master/sdk/CHANGELOG.md#version-10-rc9)
- [Truffle changelog](https://github.com/oracle/graal/blob/master/truffle/CHANGELOG.md#version-100-rc9)

### Tools
**Graal VisualVM**
* Improved Python heapwalker by fixing class names and adding support for `PString`.
* Fixed handling Page Up/Down in `ProfilerTreeTable`. See [GH-109](https://github.com/oracle/visualvm/issues/109) for details.
