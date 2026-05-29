const { spawn } = require('child_process');
const os = require('os');
const net = require('net');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        // Usually, home Wi-Fi starts with 192.168. or 10. or 172.
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.') || iface.address.startsWith('172.')) {
          return iface.address;
        }
      }
    }
  }
  // Fallback to first non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function findFreePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, '0.0.0.0', () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

async function start() {
  const ip = getLocalIp();
  const defaultPort = parseInt(process.env.PORT || '3000', 10);
  const port = await findFreePort(defaultPort);
  const url = `http://${ip}:${port}`;

  console.log('\n\x1b[35m==================================================\x1b[39m');
  console.log('\x1b[35m📱 ONEPLUS PAD 3 - LOCALHOST PREVIEW SETUP\x1b[39m');
  console.log('\x1b[35m==================================================\x1b[39m');
  console.log(`\n\x1b[1m1. Network check:\x1b[22m`);
  console.log(`   Make sure your PC and \x1b[32mOnePlus Pad 3\x1b[39m are connected to the`);
  console.log(`   \x1b[1mSAME Wi-Fi router/hotspot\x1b[22m.`);
  console.log(`\n\x1b[1m2. Open this URL on your Pad's Chrome/browser:\x1b[22m`);
  console.log(`   \x1b[36m\x1b[1m${url}\x1b[22m\x1b[39m`);
  console.log('\x1b[35m==================================================\x1b[39m\n');

  try {
    const qrcode = require('qrcode-terminal');
    console.log('\x1b[1mScan this QR Code with your OnePlus Pad 3 camera:\x1b[22m\n');
    qrcode.generate(url, { small: true });
    console.log('');
  } catch (e) {
    console.log('💡 \x1b[33mTip:\x1b[39m We can generate a terminal QR code! Run: \x1b[34mnpm i -D qrcode-terminal\x1b[39m');
    console.log(`   Or scan this QR: https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}\n`);
  }

  console.log(`\x1b[90mStarting Next.js dev server on 0.0.0.0:${port}...\x1b[39m\n`);

  // Start Next.js dev server bound to all interfaces
  const nextDev = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true
  });

  nextDev.on('close', (code) => {
    process.exit(code);
  });
}

start();
