package karyawancontroller

import (
	"fmt"
	"hrsys/models"
	karywantypes "hrsys/types/karyawan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PatchKaryawan(c *gin.Context) {
	var req karywantypes.PatchKaryawanReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	tx.Rollback()

	if _, err := tx.Exec(`UPDATE karyawan SET
		nik = ?, nama = ?, jk = ?, alamat = ?, hp = ?, divisi = ?, jabatan = ?, sp = ?, cuti_terakhir = ?, cuti_sekarang = ?, status_aktif = ?, status_karyawan = ?, tgl_masuk = ?, tgl_keluar = ?, durasi_kontrak = ?, kode_absensi = ?
		WHERE id = ?`,
		req.Nik, req.Nama, req.JK, req.Alamat, req.HP, req.Divisi, req.Jabatan, req.SP, req.CutiTerakhir, req.CutiSekarang, req.StatusAktif, req.StatusKaryawan, req.TglMasuk, req.TglKeluar, req.DuraiKontrak, req.KodeAbsensi, req.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal update karyawan: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
