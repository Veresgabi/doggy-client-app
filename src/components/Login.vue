<template>
  <div class="login-content-root" v-show="isShowContent">
    <div class="inputText">Felhasználónév:</div>
    <div><input @keyup="activeLoginButton" v-model="username" class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
    <div></div>

    <div class="inputText">Jelszó:</div>
    <div>
      <input @keyup="activeLoginButton" v-model="password" class="inputField" type="password" :disabled="isLoading || isShowPopup">
      <span class="dog-paw-icon-Parent"><img class="dog-paw-img" src="../assets/dog-paw.png"/></span>
    </div>
    <div></div>

    <div></div>
    <div>
      <div v-show="isShowMessageBlock" id="message" style="color:red; margin-top:20px;">{{loginMessage}}</div>
    </div>
    <div></div>

    <div></div>
    <div class="button">
      <span @click="isLoginButtonActive && !isLoading && !isShowPopup ? login() : null" :class="{ 'action-element-inactive': !isLoginButtonActive || isLoading || isShowPopup, 'action-element': isLoginButtonActive && !isLoading && !isShowPopup }" style="border-radius: 10px;">Bejelentkezés</span>
    </div>
    <div></div>
  </div>
</template>
  
<script>
import httpResource from "../http/httpResource";
import router from "../router/index";
import utility from "../utils/utility";

const minimumUsernameLength = 4;
const minimumPasswordLength = 6;

export default {
  name: "LoginView",
  props: {
    isLoading: Boolean,
    isShowPopup: Boolean
  },

  data: function() {
    return {
      username: "",
      password: "",
      loginMessage: "",
      isShowContent: false,
      isShowMessageBlock: false,
      isLoginButtonActive: false,
      popupText: "",

      async redirection() {
        console.log(this.$cookies.get("userId"));
        
        if (this.$cookies.get("userId") != "null") {
          try {
            this.$emit('loading-spinner', true);
            // const response = await httpResource.post("http://localhost:8082/auth/refresh");
            const response = await httpResource.post("https://doggy-spring-app.herokuapp.com/auth/refresh");

            this.$emit('loading-spinner', false);

            if (response.status === 200) {
              this.$emit('isLoggedIn', true);
              router.replace("/");
            }
            else {
              this.$emit('popup-text', utility.createPopupContent("A validáció kapcsán a server-től a következő válasz érkezett:", response));
              this.isShowContent = true;
              this.$cookies.set("userId", null);
              this.$emit('isLoggedIn', false);
            }
          }
          catch (error) {
            this.$emit('loading-spinner', false);

            if (error.response != null && error.response.status === 401) {
              this.isShowContent = true;
              this.$cookies.set("userId", null);
              this.$emit('isLoggedIn', false);
            }
            else {
              this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
            }
          }
        }
        else {
          this.isShowContent = true;
        }
      },

      async login() {

        this.isShowMessageBlock = false;
        this.loginMessage = "";

        const loginRequest = {
          username: this.username,
          password: this.password
        };
        try {
          this.$emit('loading-spinner', true);
          // const response = await httpResource.post("http://localhost:8082/auth/login", loginRequest);
          const response = await httpResource.post("https://doggy-spring-app.herokuapp.com/auth/login", loginRequest);

          this.$emit('loading-spinner', false);

          if (response.status === 200) {

            this.$emit('isLoggedIn', true);
            this.$cookies.set("userId", response.data.user.userId);
            router.replace("/");
          }
          else {
            this.$emit('popup-text', utility.createPopupContent("A validáció kapcsán a server-től a következő válasz érkezett:", response));
            this.$cookies.set("userId", null);
            this.$emit('isLoggedIn', false);
          }
        }
        catch (error) {

          this.$cookies.set("userId", null);
          this.$emit('loading-spinner', false);

          if (error.response != null && error.response.status === 401) {
            this.isShowMessageBlock = true;
            this.loginMessage = "Helytelen felhasználónév vagy jelszó!";
            this.$emit('isLoggedIn', false);
          }
          else {
            this.$emit('popup-text', utility.createPopupContent("A bejelentkezés sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
            this.$emit('isLoggedIn', false);
          }
        }
      },

    }
  },
  async mounted() {
    this.$emit('currentPage', 'login');
    await this.redirection();
  },
  methods: {

    activeLoginButton() {
      if (this.username.length >= minimumUsernameLength && this.password.length >= minimumPasswordLength) {
        this.isLoginButtonActive = true;   
      } else { 
        this.isLoginButtonActive = false;
      }
    }
  }

}

</script>