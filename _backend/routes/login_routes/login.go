package loginroutes

import (
	logincontroller "hrsys/controller/login_controller"

	"github.com/gin-gonic/gin"
)

func Login(r *gin.Engine) {
	r.GET("/login", logincontroller.GetAkun)
	r.POST("/login", logincontroller.LoginHandler)
}
