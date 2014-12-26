echo "------------->>>removing old databases"
rm -rf data/adda.db
rm -rf tests/data/adda.db
rm -rf tests/data/adda.db.backup
echo "------------->>>initializing production db"
node scripts/initialize_db.js data/adda.db
echo "-------------->>>initializing test db"
node tests/scripts/initialize_db.js tests/data/adda.db.backup
sqlite3 tests/data/adda.db.backup < tests/scripts/fill_sample_data.sql