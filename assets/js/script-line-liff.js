let url = window.location;
let protocol = url.protocol;
let hostname = url.hostname;
let pathname = url.pathname;
// check if in dev environment
const apiUrl = hostname == "localhost" ? "http://localhost:1231/" : "https://simple-diary.herokuapp.com/";
const baseUrl = hostname == "localhost" ? `${protocol}//${hostname}${pathname}` : `${protocol}//${hostname}/`;
let diaryArr = [];
const lineLiff = {
  init: () => {
    liff
      .init({ liffId: "1653656371-KpAnBYaa" })
      .then(() => {
        console.log("berhasil di init");
      })
      .catch(LiffError => {
        console.log(LiffError);
      });
  },
  isLogin: async () => {
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: baseUrl });
    } else {
      if (!liff.isInClient()) {
        let search = window.location.search;
        if (search != "") {
          window.location.replace(baseUrl);
        }
      }
      let profile = await liff.getProfile();
      let userId = profile.userId;
      $("#LineUserId").html(profile.userId);
      $("#LineDisplayName").html(profile.displayName);
      $("#LinePicture").attr("src", profile.pictureUrl);
      console.log(profile)
      await lineLiff.checkUserExist(userId);
    }
  },
  checkUserExist: async userId => {
    await $.ajax({
      url: `${apiUrl}user-line/${userId}`,
      type: "GET",
      success: async function(result) {
        if (result.data == null) {
          console.log("user ini kosong");
          await $.post(
            `${apiUrl}user-line`,
            { line_u_id: userId },
            (result, status) => {
              if (status == "success") {
                console.log("User berhasil ditambahkan");
              } else {
                console.log("Error saat menambahkan user");
                console.log(result.message);
              }
            }
          );
        } else {
          console.log("user sudah ada");
          await diary.refreshDiary();
        }
        $(".preloader-error").fadeOut("fast");
        $(".preloader").fadeOut("slow");
      },
      error: function(res) {
        $(".preloader").fadeOut("fast");
      }
    });
  },
  getProfile: async () => {
    return liff.getProfile();
  }
};
