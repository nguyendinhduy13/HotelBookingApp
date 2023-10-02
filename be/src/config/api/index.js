const os = require("os");
const fs = require("fs");
const config = process.env;

async function UpdateAPI_URL() {
  let ipv4 = "";
  // Get the network interfaces
  const interfaces = os.networkInterfaces();

  // Iterate over the network interfaces
  Object.keys(interfaces).forEach(function (interface) {
    // Get the IPv4 address of the interface
    const addresses = interfaces[interface].filter(function (address) {
      return address.family === "IPv4" && !address.internal;
    });

    if (addresses.length > 0) {
      console.log(interface + ": " + addresses[0].address);
      ipv4 = addresses[0].address;
    }
  });

  const UpdateAPI_URL = (path) => {
    fs.readFile(path, "utf8", function (error, data) {
      if (error) {
        console.error(error);
        return;
      }

      const lines = data.split("\n");
      let found = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("export const LOCAL_API_URL =")) {
          lines[i] =
            "export const LOCAL_API_URL ='http://" + ipv4 + `:${config.PORT}'`;
          found = true;
          break;
        }
      }
      if (!found) {
        lines.push(
          "export const LOCAL_API_URL ='http://" + ipv4 + `:${config.PORT}'`
        );
      }

      fs.writeFile(path, lines.join("\n"), function (error) {
        if (error) {
          console.error(error);
          return;
        }
        console.log(`IPv4 at ${path} updated!`);
      });
    });
  };

  if (config.IPV4_ADDRESS !== ipv4) {
    fs.readFile(".env", "utf8", function (error, data) {
      if (error) {
        console.error(error);
        return;
      }

      const lines = data.split("\n");
      let found = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("IPV4_ADDRESS=")) {
          lines[i] = "IPV4_ADDRESS=" + ipv4;
          found = true;
          break;
        }
      }
      if (!found) {
        lines.push("IPV4_ADDRESS=" + ipv4);
      }

      fs.writeFile(".env", lines.join("\n"), function (error) {
        if (error) {
          console.error(error);
          return;
        }
        console.log("IPv4 at .env updated!");
      });
    });

    UpdateAPI_URL("../fe/HotelBooking/api.js");
    UpdateAPI_URL("../fe/admin-web-booking/src/api/index.js");
  }
  return ipv4;
}

module.exports = { UpdateAPI_URL };
