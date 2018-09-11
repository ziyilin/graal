
## 1.0-RC6

**KNOWN ISSUES**

* The GraalVM CE image for MacOS currently depends on some libraries that are not installed by default on current MacOS versions.
This might cause issues with UI-related functionality:
```
Library not loaded: /usr/X11/lib/libfreetype.6.dylib
```
The necessary components can be added, e.g., by installing [https://www.xquartz.org](https://www.xquartz.org). We will remove this dependency in upcoming versions of GraalVM CE for MacOS.

* Note that due do the issue with the underlying platform Java Mission Control (`jmc`) freezes at startup on MacOS. For more information and workarounds please see the [JMC known issues page](https://www.oracle.com/technetwork/java/javase/jmc55-release-notes-2412446.html#known-iss).

### GraalVM for Java developers (GraalVM + compiler)

* New optimization to remove unnecessary allocation in some calls to `Enum.values()`.  See [calls to Enum.values() don't optimise away as expected](https://github.com/oracle/graal/issues/574) for the details.

### Native image generation

* Delay class initialization to runtime: By default, all classes that are seen as reachable for a native image are initialized during image building, i.e., the class initialization method is executed during image building and is not seen as a reachable method at runtime. But for some classes, it is necessary to execute the class initialization method at runtime. This is now possible using the new option `--delay-class-initialization-to-runtime=<comma separate list of class names>` or using the new API class [RuntimeClassInitialization](http://www.graalvm.org/sdk/javadoc/org/graalvm/nativeimage/RuntimeClassInitialization.html).
* Direct byte buffer are no longer allowed in the image heap: We added a new verification during image generation to ensure that no direct or mapped byte buffers (`MappedByteBuffer` instances) are in the image heap. Such buffers have either a pointer to C memory or reference a file descriptor, i.e., native resources that are available during image generation but no longer at image runtime. Using such a buffer would lead to a segfault at runtime. We discovered this issue because Netty has a few direct buffers that are created in class initializers. It is necessary to delay the initialization of such classes to runtime.
* Better automatic discovery of classes, methods, and fields accessed via reflection. When String parameters of `Class.forName`, `Class.getMethod`, `Class.getField`, and other similar classes can be constant folded during image generation, then these classes, methods, and fields are automatically registered for reflection usage and do not need to be registered manually on the command line. Constant String parameters are a common pattern to support, e.g., different JDK versions or different library versions where a class, method, or field is not present in all cases and therefore cannot be used directly.

### LLVM interpreter (Sulong)

The full [changelog](https://github.com/graalvm/sulong/blob/master/CHANGELOG.md)
is available on GitHub.

* Support for LLVM IR-level debugging, i.e., debugging at the level of `*.ll` instead of `*.c` files.
* New polyglot cast functions for primitive array types, which allows object from other languages to be used like primitive arrays.
* Support for function pointer members in `polyglot_as_typed`, which allows objects from other languages to be used in expressions like `obj->func(args)`.

### Ruby
The complete [changelog](https://github.com/oracle/truffleruby/blob/master/CHANGELOG.md) is available on GitHub. Here is a short list of most notable changes.

* TruffleRuby is now usable as a JSR 223 (`javax.script`) language;
* A [migration guide from JRuby](https://github.com/oracle/truffleruby/blob/master/doc/user/jruby-migration.mdd) is now included.
* The embedded configuration `-Xembedded` can now be set set on the launcher command line.
* `Polyglot.export` can now be used with primitives and converts strings to Java, when `Polyglot.import` converts them from Java.
* Foreign objects optimisations such as unboxing foreign strings on `to_s`, `to_str`, and `inspect`.
* Optimized performance and keyword rest arguments `(def foo(**kwrest))`.
* Multiple bug fixes from user reports.

### Python

The full [changelog](https://github.com/graalvm/graalpython/blob/master/CHANGELOG.md) is available on GitHub.

* Improved compatibility with regular expressions by including CPython's sre module as a fallback engine (in addition to Truffle's regular expression engine).
* C extension modules can now be compiled with LLVM 5+, which was prevented by internal incompatibilities before.
* Introduced lazy string concatenation to significantly speed up code patterns that repeatedly concatenated strings.
* Numerous C-API improvements to extend support for scikit-learn.
* Extensions and fixes in various areas: behavior of function and code objects, collections, exception handling during import, type ids, documentation and generators.
* Update standard library to CPython 3.6.5.
* Enable reuse of ASTs in multiple Contexts (requires the contexts to be created in the same polyglot Engine).

### R

The full [changelog](https://github.com/oracle/fastr/blob/master/CHANGELOG.md)
is available on GitHub.

* Support for reading/writing graphical parameters via `par`.
* Added numerous builtins to the C API, enabling support for packages like RCurl, rjson, compare, naivebayes, etc.
* Added support for formulas that include `...`.
* Various bug fixes: attributes of `NULL` objects, of `CR/LF` handling in readLine, `La_chol` with pivot, warnings/errors in vector coercion.

### API changes for GraalVM integrators (SDK + Truffle)

To see the list of changes to the APIs please refer to the project changelogs:

* [Graal SDK changelog](https://github.com/oracle/graal/blob/master/sdk/CHANGELOG.md)
* [Truffle changelog](https://github.com/oracle/graal/blob/master/truffle/CHANGELOG.md)
