rm -rf data/adda.db
rmdir data
echo "-------------->databases removed"
mkdir data
echo "------------->>>initializing production db"
node scripts/initialize_db.js data/adda.db