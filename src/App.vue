<template>
  <div id="app">
    <PopupComponent v-show="isShowPopup" :content="popupContent" @popup-result="popupResultHandler"></PopupComponent>
    <LoadingComponent v-show="isLoading"></LoadingComponent>
    <Header @navigate="navigator" @isLoggedIn="setIsLoggedIn" :isLoggedIn="isLoggedIn" :currentPage="currentPage"></Header>
    <router-view @popup-text="showPopup" @loading-spinner="showLoadingSpinner" @isLoggedIn="setIsLoggedIn" :isLoggedIn="isLoggedIn"
      :isLoading="isLoading" :isShowPopup="isShowPopup" @currentPage="setCurrentPage"></router-view>
  </div>
</template>

<script>

import PopupComponent from "./components/PopupComponent.vue";
import LoadingComponent from "./components/LoadingSpinnerComponent.vue"
import Header from "./components/Header.vue"
import router from "./router";

export default {
  name: 'App',
  components: { PopupComponent, LoadingComponent, Header },
  data: function() {
    return {
      popupContent: {},
      isLoading: false,
      isShowPopup: false,
      isLoggedIn: false,
      currentPage: '',
    }
  },
  methods: {
    popupResultHandler(needToShowPopup) {
      this.isShowPopup = needToShowPopup;
    },

    showPopup(content) {
      console.log(content);
      this.popupContent = content;
      this.isShowPopup = true;
    },

    showLoadingSpinner(show) {
      this.isLoading = show
    },

    setIsLoggedIn(data) {
      this.isLoggedIn = data;
    },
    navigator(path) {
      router.replace(path);
    },
    setCurrentPage(currentPage) {
      this.currentPage = currentPage;
    }
  }
}

</script>

<style>
@import 'assets/styles.css';
</style>
