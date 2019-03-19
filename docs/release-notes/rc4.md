
## 1.0-RC4

### General Remarks

While we provide updated components for all languages for this rc4 release, only the JavaScript component received fixes from its upstream repository. All other languages are unchanged in terms of functionality

The next release, rc5, is planned for the beginning of August and will provide updates for all components.

### JavaScript

The GraalVM JavaScript component has been updated to provide better compatibility with the Nashorn engine. There now is a `--nashorn-compat` flag to enable backwards compatibility functionality. This flag is highly discouraged for new applications, but can simplify the migration from Nashorn to GraalVM for existing code.

* Access getters and setters like fields
* Provide Java.extend, Java.super, JavaImporter, JSAdapter
* Allow to construct Interfaces or AbstractClasses
* Provide top-level package globals `java`, `javafx`, `javax`, `com`, `org`, `edu`

* Provide Java.isScriptFunction, Java.isScriptObject, Java.isJavaMethod and Java.isJavaFunction

Some global functions and objects have been added for the scripting mode and can be enabled with the -`-scripting` flag:

* Provide `$EXEC`, `$ENV`, `$ARG`, `$OPTIONS`
