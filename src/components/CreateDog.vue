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
        <div><input @keyup="activateSaveButton" v-model="dog.height.imperial" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Height metric:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.height.metric" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Weight imperial:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.weight.imperial" style="width: 250px"
            class="inputField" type="text" :disabled="isLoading || isShowPopup"></div>
        <div></div>

        <div></div>
        <div class="edit-field-text">Weight metric:</div>
        <div><input @keyup="activateSaveButton" v-model="dog.weight.metric" style="width: 250px"
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
            <div @click="showCheckBoxes" class="anchor-edit">{{dog.breed_group}} </div>
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
        <div></div>
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
    name: 'CreateDog',
    props: {
        isLoading: Boolean,
        isShowPopup: Boolean
    },
    data: function () {
        return {
            dog: {
                image: {
                    url: ''
                },
                height: {
                    imperial: '',
                    metric: ''
                },
                weight: {
                    imperial: '',
                    metric: ''
                },
                breed_group: 'None'
            },
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
                            const response = await httpResource.post(utility.baseUrl + "auth/refresh");

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {
                                this.$cookies.set("userId", response.data.user.userId);
                                this.$emit('isLoggedIn', true);
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következők miatt:", response));
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

            async saveDog() {
                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading && !this.isShowPopup) {

                            if (this.selectedBreedGroup !== '') {
                                this.dog.breed_group = this.selectedBreedGroup;
                            }
                            else {
                                this.dog.breed_group = null;
                            }

                            this.$emit('loading-spinner', true);
                            const response = await httpResource.post(utility.baseUrl + "dog/save-dog", this.dog);

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
        this.$emit('currentPage', 'createDog');
        await this.checkLoggedIn();
        this.initBreedGroups();
    },
}

</script>