import Utils from "../Common/Utils";
import config from "../../../main.config";

// @vuese
// @group Mixins
// Dieses Mixin kann im geschützten Bereich eingesetzt werden um zu überprüfen ob die Userin angemeldet ist und sie ggf. auf die Loginseite weiterzuleiten.
export default {
  name: "AuthMixin",
  methods: { 
    //@vuese
    //Holt den jwt token aus den Cookies und prüft ob der User angemeldet ist
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
    //@vuese
    // Redirect to Login Page
    GoToLogin() {
      this.$router.push({path: "/Login"});
    }
  }
}
