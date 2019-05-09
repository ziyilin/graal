### Installation on Linux Platforms

GraalVM is distributed as a _.tar.gz_ archive for
x86 64-bit Linux operating systems.

#### From Archive (Community and Enterprise Editions)
To install GraalVM Enterprise environment from _.tar.gz_ archive:
* Go to the [Oracle Technology Network](https://www.oracle.com/technetwork/oracle-labs/program-languages/downloads/index.html) and accept the license agreement.
* Select and download **GraalVM based on JDK8, preview for Linux**.
* Enter the directory where you want to extract GraalVM.
* Extract the GraalVM archive:
`$ tar xz archive.tar.gz`
* Configure your environment:
  - Prepend the GraalVM `bin` directory to the `PATH` environment variable:
  `$ export PATH=<path to GraalVM>/bin:$PATH`
  To verify whether you are using GraalVM, run:
  `$ which java`
  - Set the `JAVA_HOME` environment variable to resolve to the GraalVM installation directory:
  `$ export JAVA_HOME=<path to GraalVM>`
* You can also specify GraalVM as the JRE or JDK installation in your Java IDE.
