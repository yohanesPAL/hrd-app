package main

import (
	"fmt"
	"hrsys/models"
	divisiroutes "hrsys/routes/divisi_routes"
	karyawanroutes "hrsys/routes/karyawan_routes"
	loginroutes "hrsys/routes/login_routes"
	profileroutes "hrsys/routes/profile_routes"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	models.ConnectDB()
	defer models.CloseDB()

	route := gin.New()

	loc, _ := time.LoadLocation("Asia/Jakarta")

	route.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {

		t := param.TimeStamp.In(loc)

		return fmt.Sprintf("[GIN] %s | %3d | %13v | %15s | %-7s %s\n",
			t.Format("2006/01/02 - 15:04:05"),
			param.StatusCode,
			param.Latency,
			param.ClientIP,
			param.Method,
			param.Path,
		)
	}))
	route.Use(gin.Recovery())

	err := route.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		log.Fatalf("failed to set trusted proxies: %v", err)
	}

	loginroutes.Login(route)
	profileroutes.Profile(route)
	karyawanroutes.Karyawan(route)
	divisiroutes.Divisi(route)

	go func() {
		if err := route.Run("127.0.0.1:8080"); err != nil {
			log.Fatalf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
}
