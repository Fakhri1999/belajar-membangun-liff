const editDiaryCondig = {
  placeholder: "Tulis isi diary disini",
  toolbar: [
    ["style", ["bold", "italic", "underline", "clear"]],
    ["font", ["strikethrough", "superscript", "subscript"]],
    ["fontsize", ["fontsize"]],
    ["color", ["color"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["height", ["height"]],
    ["table", ["table"]]
  ],
  lineHeights: ["0.5", "0.6", "0.8", "1.0", "1.2", "1.4", "1.5", "2.0", "3.0"]
};
const regex = /(<|\&amp;lt;|\&lt;)\/?script(>|\&amp;gt;|\&gt;)/gi;
const diary = {
  submitTambahDiary: async () => {
    let ajaxData = {
      line_u_id: (await lineLiff.getProfile()).userId,
      judul: $("#tambah-diary-judul").val(),
      tanggal: $("#tambah-diary-tanggal").val(),
      isi: ($("#tambah-diary-isi").val()).replace(regex, "")
    };
    console.log(ajaxData.isi);
    console.log((ajaxData.isi).replace(regex, ""));
    $.ajax({
      url: `${apiUrl}diary-line`,
      type: "POST",
      dataType: "json",
      data: ajaxData,
      beforeSend: () => {
        $(".preloader").fadeIn("fast");
      },
      success: async (res) => {
        console.log("diary berhasil ditambahkan");
        await diary.refreshDiary();
        Toast.fire({
          icon: "success",
          title: "Diary berhasil ditambahkan"
        });
      }
    });
  },
  refreshDiary: async () => {
    $("#list-diary").html("");
    let append = `<thead><tr><th>No</th><th>Judul</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody>`;
    let userId = (await lineLiff.getProfile()).userId;
    $.ajax({
      url: `${apiUrl}diary-line/${userId}`,
      type: "GET",
      success: (res) => {
        console.log(res);
        diaryArr = [];
        for (let i = 0; i < res.data.length; i++) {
          append += `<tr><td>${i + 1}</td><td>${res.data[i].judul}</td><td>${
            res.data[i].tanggal
          }</td><td>
          <a href="javascrip:void(0)" class="badge badge-primary" onclick="diary.readDiary(${i})"><i class="far fa-eye"></i> Lihat</a> 
          <a href="javascrip:void(0)" class="badge badge-warning" onclick="diary.editDiary(${i})"><i class="fas fa-pen"></i> Edit</a> 
          <a href="javascrip:void(0)" class="badge badge-danger" onclick="diary.deleteDiary(${i})"><i class="fas fa-trash"></i> Hapus</a></td></tr>`;
          diaryArr.push(res.data[i]);
        }
        append += `</tbody>`;
        $("#list-diary").append(append);
        $("#list-diary").DataTable({
          destroy: true
        });
      },
      complete: () => {
        $(".preloader").fadeOut("fast");
      }
    });
  },
  readDiary: async index => {
    let diarySelected = diaryArr[index];  
    $("#judul-diary").html(diarySelected.judul);
    $("#isi-diary").html(diarySelected.isi);
    $("#tanggal-diary").html(diarySelected.tanggal);
    $("#modal-lihat-diary").modal("show");
  },
  editDiary: async index => {
    let diarySelected = diaryArr[index];
    $("#edit-diary-judul").val(diarySelected.judul);
    $("#edit-diary-tanggal").val(diarySelected.tanggal);
    $("#edit-diary-id").val(diarySelected.id);
    $("#edit-diary-isi").summernote("destroy");
    $("#edit-diary-isi").val(diarySelected.isi);
    $("#edit-diary-isi").summernote(editDiaryCondig);
    $("#edit-diary-isi").summernote("lineHeight", 0.8);
    $("#modal-edit-diary").modal("show");
  },
  submitEditDiary: async () => {
    let userId = (await lineLiff.getProfile()).userId;
    let ajaxData = {
      diaryId: $("#edit-diary-id").val(),
      line_u_id: userId,
      diaryData: {
        judul: $("#edit-diary-judul").val(),
        tanggal: $("#edit-diary-tanggal").val(),
        isi: $("#edit-diary-isi").val(),
      }
    }
    $.ajax({
      url: `${apiUrl}diary-line`,
      type: "PUT",
      data: ajaxData,
      beforeSend: () => {
        $(".preloader").fadeIn("fast");
        $("#modal-edit-diary").modal("hide");
      },
      success: async (res) => {
        console.log("diary berhasil diedit");
        await diary.refreshDiary();
        Toast.fire({
          icon: "success",
          title: "Diary berhasil diedit"
        });
      }, 
      error: () => {
        $(".preloader-error").fadeIn("fast");
        $(".preloader").fadeOut("fast");
      }
    })
  },
  deleteDiary: async (index) => {
    let diarySelected = diaryArr[index];
    let userId = (await lineLiff.getProfile()).userId;
    let ajaxData = {
      diaryId: diarySelected.id,
      line_u_id: userId
    }
    Swal.fire({
      title: 'Yakin mau menghapus?',
      text: "Diary yang dihapus tidak bisa dikembalikan",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak'
    }).then((result) => {
      if (result.value) {
        $.ajax({
          url: `${apiUrl}diary-line`,
          type: "DELETE",
          data: ajaxData,
          beforeSend: () => {
            $(".preloader").fadeIn("fast");
            $("#modal-edit-diary").modal("hide");
          },
          success: async (res) => {
            console.log("diary berhasil diedit");
            await diary.refreshDiary();
            Toast.fire({
              icon: "success",
              title: "Diary berhasil dihapus"
            });
          }, 
          error: () => {
            $(".preloader-error").fadeIn("fast");
            $(".preloader").fadeOut("fast");
          }
        })
      }
    })
  }
};
