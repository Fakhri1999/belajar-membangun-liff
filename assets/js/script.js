function getCurrentDate() {
  let todat = new Date();
  let dd = String(todat.getDate()).padStart(2, "0");
  let mm = String(todat.getMonth() + 1).padStart(2, "0");
  let yyyy = todat.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
}
function initSummerNote() {
  $(".summernote").summernote({
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
  });
  $(".summernote").summernote("lineHeight", 0.8);
}
$(document).ready(async function() {
  // init datepicker
  $("#tambah-diary-tanggal").datepicker({
    format: "dd/mm/yyyy",
    value: getCurrentDate()
  });
  $("#edit-diary-tanggal").datepicker({
    format: "dd/mm/yyyy"
  });
  initSummerNote();
  lineLiff.init();
  lineLiff.isLogin();
});
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});
// // submit tambah diary
function submitFormTambahDiary() {
  diary.submitTambahDiary();
}
function submitFormEditDiary() {
  diary.submitEditDiary();
}
