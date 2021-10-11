import Utils from "../Common/Utils";
import config from "../../../main.config";

const AuthMixin = {
  methods:{
    /**
     * Holt den jwt token aus den Cookies und prüft ob der User angemeldet ist
     */
    CheckForLogin() {
      const jwtCookie = Utils.GetCookie("jwt");
      if (jwtCookie == null && this.$router.currentRoute.name != "Login") {
        this.GoToLogin();
      } else if (jwtCookie != null) {
        this.$store.commit("SetJWT", jwtCookie);

        this.Get(config.CMS_BASE_URL + "/users/me").then((response) => {
          this.$store.commit("SetUser", response.data);
        });
      } else if (this.$router.currentRoute.name != "Login") {
        this.GoToLogin();
      }
    },
    /**
     * Redirect to Login Page
     */
    GoToLogin() {
      this.$router.push({
        path: "/Login",
      });
    }
  }
}
export default AuthMixin;