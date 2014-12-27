rm -rf data/adda.db
rmdir data
rm -rf tests/data/adda.db.backup
rmdir tests/data
echo "-------------->databases removed"
mkdir data
mkdir tests/data 
echo "------------->>>initializing production db"
node scripts/initialize_db.js data/adda.db
echo "-------------->>>initializing test db"
node tests/scripts/initialize_db.js tests/data/adda.db.backup
sqlite3 tests/data/adda.db.backup < tests/scripts/fill_sample_data.sql