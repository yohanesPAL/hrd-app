package karyawancontroller

import (
	"fmt"
	"hrsys/models"
	karywantypes "hrsys/types/karyawan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PostKaryawan(c *gin.Context) {
	var req karywantypes.PostKaryawanReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO karyawan
		(nik, nama, jk, alamat, hp, divisi, jabatan, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, durasi_kontrak, kode_absensi) VALUES
		(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		req.Nik,
		req.Nama,
		req.JK,
		req.Alamat,
		req.HP,
		req.Divisi,
		req.Jabatan,
		req.CutiTerakhir,
		req.CutiSekarang,
		req.StatusAktif,
		req.StatusKaryawan,
		req.TglMasuk,
		req.DurasiKontrak,
		req.KodeAbsensi,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal menambah karyawan: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
