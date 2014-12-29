rm -rf tests/data/adda.db.backup
rmdir tests/data
echo "-------------->databases removed"
mkdir tests/data 
echo "-------------->>>initializing test db"
node tests/scripts/initialize_db.js tests/data/adda.db.backup
sqlite3 tests/data/adda.db.backup < tests/scripts/fill_sample_data.sql