GraalVM gives you a dedicated **Agent application** that comes with rich
monitoring features to allow developers, integrators, and IT staff to monitor
the performance of user programs and the health status of the virtual machine.

The GraalVM monitoring component is called the Agent and can be easily enabled
by providing the command line option `--agent` to the executables.

__Disclaimer__: The Agent is currently an __experimental__ feature
provided by the __GraalVM Enterprise Edition__ available for download
from the [Oracle Technology Network](http://www.oracle.com/technetwork/oracle-labs/program-languages/downloads/index.html).

### GraalVM Instruments

The Agent uses instruments that implement the
[Truffle Instrumentation API](http://www.graalvm.org/truffle/javadoc/com/oracle/truffle/api/instrumentation/package-summary.html).

In future, additional instrumentation tools can be added either by
the GraalVM development team or third party developers.

### Running an Example for Agent Monitoring
Get familiar with using the GraalVM Agent with this Hello World example.

1. Save the following code snippet as `HelloWorld.js`:

    ```
    var http = require('http');

    var server = http.createServer(function (request, response) {
      let host = request.headers.host;
      let index = host.indexOf(':');
      if (index > 0) {
        host = host.substring(0, index);
      }
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.end("Hello "+host+"!\n");
    });

    server.listen(8000);

    console.log("Server running at http://localhost:8000/");
    ```

2. Launch the Graal Enterprise Monitoring Agent Server `gemasrv` using this command:

    ```
    gemasrv
    Agent http server is running in unsecure mode!
    Use Java VM properties:
        -Dkey.store.file.path to specify the path to the .jsk file.
        -Dkey.store.file.password to specify the password used to unlock the keystore
        -Dkey.store.key.recover.password to specify the password for recovering keys. If is not specified the key.store.file.password is used.
    Agent http server started on port 8080, reachable at:
    http://localhost:8080/info
    ```

    The program starts without SSL, with a warning about unsecure mode,
    and the Monitoring Agent web application is available at `http://localhost:8080/`.

    When you open this page, you can see there are no virtual machines attached yet.

    Note: To run the server on a different port, use the `--port <port_number>` option.


3. Launch GraalVM `node` to monitor `HelloWorld.js` using this command:

    ```
    node --agent HelloWorld.js
    Server running at http://localhost:8000/
    ```

    The GraalVM starts and attaches itself to the Monitoring Agent Server running by default on the localhost:8080 port.
    To attach the GraalVM to a server running on a different host:port, use the `--agent=<[host:]port>` option.

    Now, when you open the Monitoring Agent's page, you can see the virtual machine is running with some
    system information displayed by default.

4. In the Agent window, select `Polyglot Engine - 1` from the second drop-down
box at the top. You should see the sources loaded in the Polyglot Engine
and the available instruments as shown in the following image:

![](/docs/img/AgentOpened.png)

The Agent window shows loaded sources on the left where the `HelloWorld.js` source
can be found under the **FileSystem** node . The area in the middle provides
detailed information about sources or gathered data from instruments. The
right-most column allows you to enable various loaded instruments and
set their properties.

Let's take a look at CPU sampling with our script to see what takes
the most time.

1. Enable **Agent CPU Sampler**.
2. In the settings section, select **Start Sampling**.
3. Reload the application at `http://localhost:8000/` so that the Agent can
gather the data.
4. Return to the Agent window.
5. In the **CPU Sampler** section, select **Stop Sampling**.

The Agent page refreshes and results should display as follows:

![ ](/docs/img/CPUSampler.png  "Agent and CPU Sampler data")

It is also possible to see detailed data in the source code. To do this, open
the `HelloWorld.js` file in the Agent tab and the select **Agent CPU Sampler**
from the drop-down box. Sources should display with data available as follows:

![](/docs/img/CPUSamplerDetail.png)

### JVM Mode Only Instruments

Some monitoring instruments, such as the Specialization Instrument, are
available in `--jvm` mode only for the GraalVM launchers.

In this case, you should launch `HelloWorld.js` as follows:

```
node --jvm --agent HelloWorld.js
```
Then do the following:
1. Open Agent and enable **Agent Specializations** from the list of instruments.
2. **Start Tracing**, using the button below.
3. Reload the `HelloWorld.js` application in your browser.
4. Return to the Agent window and **Stop Tracing**.
5. Open the `HelloWorld.js` and select **Agent Specializations** from the drop-down box next to the filename tab.

Data such as the following displays specializations of various JavaScript
statements:

![ ](/docs/img/SpecializationInstrument.png  "Specialization Instrument")

### Monitoring Agent History for Short Living GraalVMs

The above described usage scenario with the online monitoring of a running GraalVM
cannot be applied in the situations when the GraalVM runs for a short period
of time only (typically, the GraalVM running as part of a FaaS environment).
There is simply not enough time for a user to attach the Monitoring Agent UI,
enable selected instruments, collect and view the monitoring data.

To cover such usecase, the GraalVM can be started with a list of Agent Instruments
that should be enabled automatically at the VM startup and send thier data actively
to the Monitoring Agent Server. The server can persist the history of received data
and provide them later on to its users.

Get familiar with using the GraalVM Agent history with the following example.

1. Start the Graal Enterprise Monitoring Agent Server with the history enabled using
the following command:

    ```
    gemasrv --store
    ```
    The Monitoring Agent Server gets started persisting the received monitoring data to
    the `data.store` file located in the current working directory. To choose different
    storage location, use the `--store <storage_file_URL>` option (e.g. `--store file:///tmp/data.store`).

2. Launch the short living GraalVM with the **Agent CPU Tracer** enabled at the VM startup.

    ```
    js --agent --agent.Instruments=agentCPUTracer run.js
    ```

3. In the Agent window, select the **History** from the navigation list that appears by
clicking the hamburger icon positioned at the top-left corner.
4. Select the GraalVM launched in step 2 on the time line using the executable name and
timestamps for its identification.
5. Open the source that you are interested in form the **FileSystem** tree.
6. Select **Agent CPU Tracer** from the drop-down box next to the filename tab.

Now you can browse the collected data. The Agent History page should display as follows:

![ ](/docs/img/AgentHistory.png  "Monitoring Agent History")
