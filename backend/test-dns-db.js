import dns from 'dns';
import net from 'net';

const targets = [
  { host: 'db.aywunvkunpxfofzqqlqc.supabase.co', port: 5432, label: 'Direct Connection (IPv6)' },
  { host: 'aws-1-ap-northeast-1.pooler.supabase.com', port: 5432, label: 'Pooler Session Mode' },
  { host: 'aws-1-ap-northeast-1.pooler.supabase.com', port: 6543, label: 'Pooler Transaction Mode' }
];

console.log('=== STARTING DATABASE CONNECTIVITY DIAGNOSTICS ===\n');

async function testTarget(target) {
  return new Promise((resolve) => {
    console.log(`Testing [${target.label}] to ${target.host}:${target.port}...`);
    
    dns.lookup(target.host, { all: true }, (dnsErr, addresses) => {
      if (dnsErr) {
        console.log(`❌ DNS Lookup failed for ${target.host}: ${dnsErr.message}\n`);
        resolve({ success: false, target });
        return;
      }
      
      console.log(`   Resolved IPs: ${addresses.map(a => `${a.address} (IPv${a.family})`).join(', ')}`);
      
      // We will try connecting to the first resolved address
      const addr = addresses[0].address;
      const socket = new net.Socket();
      socket.setTimeout(4000);
      
      socket.on('connect', () => {
        console.log(`   ✅ TCP connection successful to ${addr}:${target.port}!\n`);
        socket.destroy();
        resolve({ success: true, target });
      });
      
      socket.on('timeout', () => {
        console.log(`   ❌ TCP connection timed out after 4 seconds.\n`);
        socket.destroy();
        resolve({ success: false, target });
      });
      
      socket.on('error', (err) => {
        console.log(`   ❌ TCP connection failed: ${err.message}\n`);
        resolve({ success: false, target });
      });
      
      socket.connect(target.port, addr);
    });
  });
}

async function runAll() {
  for (const target of targets) {
    await testTarget(target);
  }
  console.log('=== DIAGNOSTICS COMPLETE ===');
}

runAll();
