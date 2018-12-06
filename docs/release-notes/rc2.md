## 1.0-RC2
(2018-06-05)
### GraalVM for Java developers
* Updated the underlying JDK version to “1.8.0_171” from “1.8.0_161”. You can find the JDK release notes at the [Oracle Technology Network](http://www.oracle.com/technetwork/java/javase/8u171-relnotes-4308888.html) website.
* Improved support for the Java Microbenchmark harness. Since JMH 1.21, GraalVM is a [recognized and supported JVM](http://mail.openjdk.java.net/pipermail/jmh-dev/2018-May/002753.html).
* Fixed a [StackOverflow exception](https://github.com/oracle/graal/issues/341) an improved performance when recursively inlining of invokedynamic instructions.
* Fixed a [compiler error](https://github.com/oracle/graal/issues/423) causing incorrect code generation while building the scalac compiler.

### Native image generation

* Added support for building statically linked native images. Now you can pass `--static`, and if you have static libc and zlib installed, it generates a standalone executable that will not require libc for running.
* Added Classpath exception to the license of [SubstrateVM](https://github.com/oracle/graal/blob/master/substratevm/LICENSE.md) and the [Graal compiler](https://github.com/oracle/graal/blob/master/compiler/LICENSE.md) components to make sure all GraalVM code ending up in a native image is subject to this clause.
* Fixed the handling of implicit exceptions (NullPointerExeption, ArrayIndexOutOfBoundsException, ClassCastException, …): all exceptions now have correct stack traces and can be caught as expected. Previously, implicit exceptions were sometimes not caught by an exception handler within the same method.
* Fixed a number of exceptions during the generation of native images that were reported by early adopters.

### JavaScript

* Updated [Node.js to 8.11.1](https://nodejs.org/en/blog/release/v8.11.1/) (from 8.9.4), it is not a breaking change, but it brings numerous improvements, including CVE-listed security fixes.

### LLVM interpreter for C/C++ & other native languages

* Added a new API for accessing Java types and instantiating foreign objects from LLVM languages.

Now it is possible to easily call Java code from native programs compiled to the LLVM bitcode. The example below shows how you can access Java’s BigInteger long math operations from C.

```
#include <stdio.h>
#include <polyglot.h>
int main() {
    void *bigInteger = polyglot_java_type("java.math.BigInteger");
    void *(*BigInteger_valueOf)(long) = polyglot_get_member(bigInteger, "valueOf");

    void *bi = BigInteger_valueOf(2);
    void *result = polyglot_invoke(bi, "pow", 256);

    char buffer[100];
    polyglot_as_string(polyglot_invoke(result, "toString"),
                       buffer,
                       sizeof(buffer),
                       "ascii");

    printf("%s\n", buffer);
}
```

If we compile it to the LLVM bitcode, we can execute it with GraalVM. You can see that it computes the value of2^256 which isn’t that easy to do in C otherwise.

```
# shelajev at shrimp.local in /tmp
→ clang -c -O1 -emit-llvm -I$GRAALVM_HOME/jre/languages/llvm big-integer-demo.c

# shelajev at shrimp.local in /tmp
→ lli --jvm big-integer-demo.bc
115792089237316195423570985008687907853269984665640564039457584007913129639936
```

A more detailed list of changes to the LLVM interpreter can be found in the [full changelog](https://github.com/oracle/graal/blob/master/sulong/CHANGELOG.md#version-100-rc2).

### Ruby

* We are now compatible with Ruby 2.4.4.
* Java.import name imports Java classes as top-level constants.
* Coercion of foreign numbers to Ruby numbers now works.
* `to_s` works on all foreign objects and calls the Java `toString`.
* `to_str` will try to UNBOX and then re-try `to_str`, in order to provoke the unboxing of foreign strings.

Much more details can be found in the full [changelog](https://github.com/oracle/truffleruby/blob/master/CHANGELOG.md#10-rc-2-6-june-2018).

### R

Among the other changes, we improved the stability of GraalVM’s R implementation.

* Added a `/jre/languages/R/bin/configure_fastr` script that allows FastR’s native build scripts to adopt to the current system, which makes installing R packages much more stable.
* The _fastr_errors.log_ file was renamed to _fastr_errors_pidXYZ.log_ and is stored in either initial working directory, the user home directory, /tmp, or the FastR home directory (picking the first location that is writeable). Please add it to the bug reports if you submit issues.

### Python

* Added support for the Python [unittest](https://docs.python.org/3/library/unittest.html) framework.
* Python now supports breaking on exceptions and unwinding to stack frames in Chrome inspector.

### API changes for GraalVM integrators

Both Graal SDK and Truffle are offering API for developers trying to build things on top of GraalVM, language implementations, embedding GraalVM, and so on.

* Enabled code sharing between guest language Contexts with the same Engine, speeding up the repeated evaluation of the code.

To see the list of changes to the APIs please refer to the project changelogs:

* [Graal SDK changelog](https://github.com/oracle/graal/blob/master/sdk/CHANGELOG.md#version-10-rc2)
* [Truffle changelog](https://github.com/oracle/graal/blob/master/truffle/CHANGELOG.md#version-100-rc2)

### Tools

#### VisualVM
* Fixed the issues with loading polyglot heap dumps
* fixed executing of scripts in R console
* improved recognition of R REPL
* fixed `loop to` nodes
* fixed memory leak in child nodes
* improved appearance on MacOS
* Applicability fixes
* added roots histogram for class

#### Graal Updater `gu`

* The default operation mode changed from “install from local files” to “install from catalog”.
* `-c` option for installing from the catalog, can be omitted (installing from the catalog the default), but specifying `-c` still works.
* Use `-F` to install from local files, i.e. `bin/gu -F /tmp/ruby-installable.jar`.

#### Chrome Inspector

Fixed a number of issues:

* fixed the initial suspend of node scripts with no statement on the first line
* fixed tooltip issues and representation of the functions
* fixed issues with re-connection of Chrome inspector client
