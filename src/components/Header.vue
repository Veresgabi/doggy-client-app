<template>
  <div class="header">
    <div>
      <img src="../assets/dog-icon.png" class="dog-img" />
    </div>

    <div style="text-align: center">
      <span v-show="currentPage !== 'dashboard'" class="simple-active-element" @click="navigateToDasboard">Főoldal</span>
    </div>

    <div style="text-align: center"><span class="simple-active-element" @click="loginLogout">{{ currentPage != 'login' ? 
      (isLoggedIn ? 'Kijelentkezés' : 'Bejelentkezés') : '' }}</span></div>
  </div>
</template>
  
<script>
import httpResource from "../http/httpResource";
import utility from "../utils/utility";

export default {
  name: 'HeaderView',
  props: {
    isLoggedIn: Boolean,
    currentPage: String,
  },
  data: function () {
    return {
      navigateToDasboard() {
        this.$emit('navigate', '/');
      },
      async loginLogout() {
        if (this.isLoggedIn) {
          try {
            if (!this.isLoading && !this.isShowPopup) {
              this.$emit('loading-spinner', true);
              // const response = await httpResource.post("http://localhost:8082/auth/logout-user");
              const response = await httpResource.post("https://doggy-spring-app.herokuapp.com/auth/logout-user");

              this.$emit('loading-spinner', false);

              if (response.status === 200) {
                this.$cookies.set("userId", null);
                this.$emit('isLoggedIn', false);

                if (this.currentPage !== 'dashboard') {
                  this.$emit('navigate', '/login');
                }
              }
              else {
                this.$emit('popup-text', utility.createPopupContent("A kijelentkezés sikertelen a következők miatt:", response));
              }
            }
          } catch (error) {

            this.$emit('loading-spinner', false);
            this.$emit('popup-text', utility.createPopupContent("A kijelentkezés sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
          }
        }
        else {
          this.$emit('navigate', '/login');
        }
      }
    }
  }
}

</script>