<template>
    <div class="editpage-image-root">
        <div></div>
        <div><img v-show="dog != null" class="editpage-dog-image" :src="dog.image.url"/></div>
        <div></div>
    </div>
    <div class="edit-dog-field">
        <div></div>
        <div class="edit-field-text">Name:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.name" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Image URL:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.image.url" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Height imperial:</div>
        <div><input @keyup="activateSaveButton" v-model="heightImperial" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Height metric:</div>
        <div><input @keyup="activateSaveButton" v-model="heightMetric" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Weight imperial:</div>
        <div><input @keyup="activateSaveButton" v-model="weightImperial" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Weight metric:</div>
        <div><input @keyup="activateSaveButton" v-model="weightMetric" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Life span:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.life_span" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Bred for:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.bred_for" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Breed group:</div>
        <div class="dropdown-check-list-edit">
            <div @click="showCheckBoxes" class="anchor-edit">{{dog.breed_group != null ? dog.breed_group : 'None'}}</div>
            <div class="checkboxes" v-show="isShowCheckBoxes">
                <div v-for="breedGroup, index in breedGroups" :key="index">
                    <input :disabled="isShowPopup || isLoading" type="checkbox" :id="index" 
                        :checked="dog.breed_group === breedGroup" @change="selectBreedGroup(index, $event)" />
                    <span class="checkbox-text">{{ breedGroup }}</span>
                </div>
            </div>
        </div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Temperament:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.temperament" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">CountryCode:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.country_code" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Origin:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.origin" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Description:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.description" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">History:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.history" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div style="padding-left: 50%; padding-top: 25px">
            <img src="../assets/x_icon.png" class="icon" @click="!isLoading && !isShowPopup ? deleteDog() : null" 
                  :class="{ 'simple-active-element': !isLoading && !isShowPopup }" />
        </div>
        <div class="button">
            <span @click="activeSaveButton && !isLoading && !isShowPopup ? saveDog() : null" 
                  :class="{ 'action-element-inactive': !activeSaveButton || isLoading || isShowPopup, 
                            'action-element': activeSaveButton && !isLoading && !isShowPopup }" 
                   style="border-radius: 10px;">Mentés</span>
        </div>
        <div></div>
        
    </div>
</template>
  
<script>
import httpResource from "../http/httpResource";
import router from "../router/index";
import utility from "../utils/utility";

export default {
    name: 'EditDog',
    props: {
        isLoading: Boolean,
        isShowPopup: Boolean
    },
    data: function () {
        return {
            dog: {
                image: {
                    url: ''
                }
            },
            dogId: this.$route.params.breedId,
            heightImperial: '',
            heightMetric: '',
            weightImperial: '',
            weightMetric: '',
            breedGroups: [],
            selectedBreedGroup: '',

            isShowCheckBoxes: false,
            activeSaveButton : false,

            async checkLoggedIn() {

                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading && !this.isShowPopup) {
                            this.$emit('loading-spinner', true);
                            // const response = await httpResource.post("http://localhost:8082/auth/refresh");
                            const response = await httpResource.post("https://doggy-spring-app.herokuapp.com/auth/refresh");

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {
                                this.$cookies.set("userId", response.data.user.userId);
                                this.$emit('isLoggedIn', true);
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következők miatt", response));
                                this.$cookies.set("userId", null);
                                this.$emit('isLoggedIn', false);
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);

                        if (error.response != null && error.response.status === 401) {
                            this.$cookies.set("userId", null);
                            this.$emit('isLoggedIn', false);

                            router.replace("/login");
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                        }
                    }
                }
                else {
                    router.replace("/login");
                }
            },

            async getDog() {
                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading && !this.isShowPopup) {
                            this.$emit('loading-spinner', true);
                            // const response = await httpResource.get(`http://localhost:8082/dog/get-dog?id=${this.dogId}`);
                            const response = await httpResource.get(`https://doggy-spring-app.herokuapp.com/dog/get-dog?id=${this.dogId}`);

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {
                                this.dog = response.data.dog;
                                this.heightImperial = this.dog != null && this.dog.height != null ? this.dog.height.imperial : '';
                                this.heightMetric = this.dog != null && this.dog.height != null ? this.dog.height.metric : '';
                                this.weightImperial = this.dog != null && this.dog.weight != null ? this.dog.weight.imperial : '';
                                this.weightMetric = this.dog != null && this.dog.weight != null ? this.dog.weight.metric : '';
                                console.log(this.dog.name);
                                this.isInited = true;
                                this.$emit('isLoggedIn', true);
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A kutya lekérése sikertelen a következők miatt:", response));
                                this.$cookies.set("userId", null);
                                this.$emit('isLoggedIn', false);
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);

                        if (error.response != null && error.response.status === 401) {
                            this.$cookies.set("userId", null);
                            this.$emit('isLoggedIn', false);
                            router.replace("/login");
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A kutya lekérése sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                        }
                    }
                }
                else {
                    router.replace("/login");
                }
            },

            async saveDog() {
                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading && !this.isShowPopup) {

                            if (this.dog.height === null) this.dog.height = {};
                            this.dog.height.imperial = this.heightImperial;
                            this.dog.height.metric = this.heightMetric;
                            
                            if (this.dog.weight === null) this.dog.weight = {};
                            this.dog.weight.imperial = this.weightImperial;
                            this.dog.weight.metric = this.weightMetric;
                            
                            if (this.selectedBreedGroup !== '') {
                                this.dog.breed_group = this.selectedBreedGroup;
                            }
                            else {
                                this.dog.breed_group = null;
                            }

                            this.$emit('loading-spinner', true);
                            // const response = await httpResource.post("http://localhost:8082/dog/save-dog", this.dog);
                            const response = await httpResource.post("https://doggy-spring-app.herokuapp.com/dog/save-dog", this.dog);

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {

                                this.$emit('popup-text', utility.createPopupContent("A kutya mentése sikeresen megtörtént"));
                                this.$emit('isLoggedIn', true);
                                router.replace("/");
                                
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A kutya mentése sikertelen a következők miatt:", response));
                                this.$cookies.set("userId", null);
                                this.$emit('isLoggedIn', false);
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);

                        if (error.response != null && error.response.status === 401) {
                            this.$cookies.set("userId", null);
                            this.$emit('isLoggedIn', false);
                            router.replace("/login");
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A kutya mentése sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                        }
                    }
                }
                else {
                    router.replace("/login");
                }
            },

            async deleteDog() {
                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading && !this.isShowPopup) {
                            
                            console.log(this.dog);
                            this.$emit('loading-spinner', true);
                            // const response = await httpResource.delete(`http://localhost:8082/dog/delete-dog?id=${this.dogId}`, this.dog.dogId);
                            const response = await httpResource.delete(`https://doggy-spring-app.herokuapp.com/dog/delete-dog?id=${this.dogId}`, this.dog.dogId);

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {

                                this.$emit('popup-text', utility.createPopupContent("A kutya törlése sikeresen megtörtént!"));
                                this.$emit('isLoggedIn', true);
                                router.replace("/");
                                
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A kutya törlése sikertelen a következők miatt:", response));
                                this.$cookies.set("userId", null);
                                this.$emit('isLoggedIn', false);
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);

                        if (error.response != null && error.response.status === 401) {
                            this.$cookies.set("userId", null);
                            this.$emit('isLoggedIn', false);
                            router.replace("/login");
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A kutya törlése sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                        }
                    }
                }
                else {
                    router.replace("/login");
                }
            },

            initBreedGroups() {
                this.breedGroups = utility.getBreedGroups()
            },

            showCheckBoxes() {
                this.isShowCheckBoxes = !this.isShowCheckBoxes;
            },

            selectBreedGroup(index, event) {
                this.activateSaveButton();
                for (let i = 0; i < this.breedGroups.length; i++) {
                    if (i != index) {
                        let checkboxElement = document.getElementById(i);
                        checkboxElement.checked = false;
                    }
                }

                if (event.target.checked) {
                    this.selectedBreedGroup = index;
                    this.dog.breed_group = this.breedGroups[index];
                }
                else {
                    this.selectedBreedGroup = '';
                    this.dog.breed_group = 'None';
                }
            },

            activateSaveButton() {
                if (!this.activeSaveButton) {
                    this.activeSaveButton = true;
                }
            },
        }
    },
    async mounted() {
        this.$emit('currentPage', 'editDog');
        await this.checkLoggedIn();
        await this.getDog();
        this.initBreedGroups();
    },
}

</script>