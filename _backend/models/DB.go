package models

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	dsn := "root:@tcp(127.0.0.1:3306)/hrsys?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Gagal terhubung dengan database: %v", err)
	}

	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(20)
	db.SetConnMaxIdleTime(60 * time.Second)
	db.SetConnMaxLifetime(80 * time.Second)

	if err := db.Ping(); err != nil {
		log.Fatalf("Gagal ping ke database: %v", err)
	}

	log.Println("Database connection opened.")
	DB = db
}

func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Database connection closed.")
	}
}
