
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
// run: node supabase/seed.js after adding more meals
console.log('Seed via SQL editor - schema.sql includes 3 meals')
