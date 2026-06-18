const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ykbieqyjbuoshxdahqys:Naresh%40%23%24%25%5E%26*%3C%3E@aws-0-ap-south-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => { console.log('SUCCESS'); client.end(); }).catch(e => console.log('ERROR:', e.message));
