 Ideal Graph Visualizer or IGV is a developer tool, currently maintained as part of the Graal compiler, recommended for performance issues investigation.
 The tool is essential for any language implementers on top of GraalVM and is available as a part of **GraalVM Enterprise Edition** on [Oracle Technology Network](https://www.oracle.com/technetwork/oracle-labs/program-languages/downloads/index.html) download.

 Ideal Graph Visualizer is developed to view and inspect interim graph representations from Graal and Truffle compilations.

1.Having set your PATH environment variable to `GraalVM/bin` folder, launch IGV:

```shell
$ idealgraphvsiualizer
```

2.Save the following code snippet as  `Test.rb`:

```
require 'json'

obj = {
  time: Time.now,
  msg: 'Hello World',
  payload: (1..10).to_a
}

encoded = JSON.dump(obj)

js_obj = Polyglot.eval('js', 'JSON.parse').call(encoded)

puts js_obj[:time]
puts js_obj[:msg]
puts js_obj[:payload].join(' ')
```

3.From another console window, make sure `ruby` component is installed in GraalVM,
connect `Test.rb` script to the running IGV and dump the diagnostic information:

```shell
$ gu list
$ ruby --jvm --jvm.Dgraal.Dump=:1 test.rb
```

After the connection, you are able to locate the compilation graphs in the Outline window.
Find e.g. `java.lang.String.char(int)` folder and open its _After parsing_ graph by double-clicking.
If the node has `sourceNodePosition` property, then the Processing Window will attempt to display its location and the entire stacktrace.

### Graphs Manipulation
Once the diagnostic information is opened, you can search for nodes by name, ID, or by `property=value` data, and all matching results will be offered within a graph.
Another cool feature of this tool is the ability to navigate to the original guest language source code!
Select a node in graph and press 'go to source' button in the Stack View window.

![](/docs/img/IGV_navigate_to_source.png)

Graphs navigation is available also from the context menu, enabled by focusing
and right-clicking a specific graph node. Extract nodes option will re-render
a graph and display just selected nodes and their neighbours.

![](/docs/img/IGV_context_menu.png)

If the graph is larger than the screen, manipulate with the 'satellite' view button
in the main toolbar to move the viewport rectangle.

![](/docs/img/IGV_satellite_view.png)

For user preference, the graph color scheme is adjustable by editing
the Coloring filter, enabled by default in the left sidebar.

### Adding Projects Source

Projects source can be added in manual and assisted modes. Once you select a node in the graph view, Processing View will open. If IGV knows where the source for the current frame is,
the green 'go to source' arrow is enabled. If IGV does not know where the source is,
the line is grayed out and a 'looking glass' button appears.

![](/docs/img/IGV_add_source.png)

Press it and select "Locate in Java project" to locate the correct project in the dialog.
IGV hides projects which do not contain the required source file.
The "Source Collections" serves to display the stand alone roots added by "Add root of sources" general action. If the source is located using the preferred method (from java project), its project can be later managed on Project tab. That one is initially hidden, but a user can display the list of opened projects using Window - Projects.

### Dumping Information

To dump the diagnostic information, you need to add options to Graal based processes.
Depending on the language/VM used, you may need to e.g. to prefix the options by `--jvm`.
To dump the diagnostic information of embedded Java application to IGV, use
 `-XX:+UnlockExperimentalVMOptions -Dgraal.Dump=:1`. See the particular language's
 documentation for the details.

 In the case some older GraalVM is used, you may need to specifically enable Graal to dump the `nodeSourcePosition` property, again using JVM options as `-XX:+UnlockDiagnosticVMOptions -XX:+DebugNonSafepoints`.
Graal will connect to the running tool, IGV will receive the dump and display it in its UI.
If IGV is not running, Graal dumps will be stored in a subdirectory in binary format, or at the place specified by `-Dgraal.DumpPath` JVM property. Note that the dumps from Truffle compilations will not be written to the disk, Truffle only connects to the IGV.
