package karyawancontroller

import (
	"database/sql"
	"fmt"
	"hrsys/models"
	karywantypes "hrsys/types/karyawan_types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetKaryawanData(c *gin.Context) {
	id := c.Param("id")

	db := models.DB

	rows, err := db.Query(`SELECT 
		nik, nama, jk, alamat, hp, divisi, jabatan, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak
		FROM karyawan WHERE id = ?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal ambil data karyawan: %s", err)})
		return
	}
	defer rows.Close()

	data := []karywantypes.PatchKaryawanDataRes{}
	for rows.Next() {
		var item karywantypes.PatchKaryawanDataRes
		var tglMasuk, tglKeluar sql.NullString
		if err := rows.Scan(&item.Nik, &item.Nama, &item.JK, &item.Alamat, &item.HP, &item.Divisi, &item.Jabatan, &item.CutiTerakhir, &item.CutiSekarang, &item.StatusAktif, &item.StatusKaryawan, &tglMasuk, &tglKeluar, &item.DuraiKontrak); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal baca data karyawan: %s", err)})
			return
		}
		item.TglMasuk = tglMasuk.String
		item.TglKeluar = tglKeluar.String

		data = append(data, item)
	}

	c.JSON(http.StatusOK, data)
}

func PatchKaryawan(c *gin.Context) {
	var req karywantypes.PatchKaryawanReq
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("invalid request body: %s", err)})
		return
	}

	var tglKeluar any = req.TglKeluar

	if req.TglKeluar == "" {
		tglKeluar = nil
	}

	db := models.DB

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal memulai transaksi: %s", err)})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`UPDATE karyawan SET
		nik = ?, nama = ?, jk = ?, alamat = ?, hp = ?, divisi = ?, jabatan = ?, cuti_terakhir = ?, cuti_sekarang = ?, status_aktif = ?, status_karyawan = ?, tgl_masuk = ?, tgl_keluar = ?, durasi_kontrak = ?
		WHERE id = ?`,
		req.Nik, req.Nama, req.JK, req.Alamat, req.HP, req.Divisi, req.Jabatan, req.CutiTerakhir, req.CutiSekarang, req.StatusAktif, req.StatusKaryawan, req.TglMasuk, tglKeluar, req.DuraiKontrak, req.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal update karyawan: %s", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("gagal commit: %s", err)})
		return
	}

	c.JSON(http.StatusOK, "success")
}
