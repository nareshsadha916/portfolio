const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-south-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'ap-southeast-1', 'ap-southeast-2',
  'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'eu-north-1', 'eu-south-1', 'sa-east-1'
];

async function testRegion(region) {
  const url = `postgresql://postgres.ykbieqyjbuoshxdahqys:Naresh%40%23%24%25%5E%26*%3C%3E@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`[${region}] SUCCESS`);
    await client.end();
  } catch (err) {
    console.log(`[${region}] ERROR: ${err.message}`);
  }
}

async function run() {
  console.log("Starting region search...");
  for (const region of regions) {
    await testRegion(region);
  }
}

run();
