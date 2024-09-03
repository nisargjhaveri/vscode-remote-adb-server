# remote-adb-server · Remote Android Development in VS Code

Use local Android devices for debugging when using [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview).

This makes use of the amazing [remote-adb](https://www.npmjs.com/package/remote-adb) npm package.

## Features
- Connect and share USB connected Android devices directly from the web interface.
- Easily start server and open the web interface to connect devices.
- Connected devices are available for debugging using any tools on the remote machine via `adb`.

## Usage
Once installed, simply search and execute these commands to get started.

- **Remote Android: Open in browser to connect Android devices**
    - Start server and open the web interface.
    - Follow on-screen interface to connect a device.

- **Remote Android: Stop server**
    - Stop the running server


*** The web interface is currently only supported Chromium-based browsers. See [compatibility for WebUSB API](https://developer.mozilla.org/en-US/docs/Web/API/USB).