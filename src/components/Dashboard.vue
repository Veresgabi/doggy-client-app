<template>
    <div class="filter-bar">
        <div class="filter-element ">
            <span class="inputText">Name</span>
            <div><input @keyup="filterForName" @keypress="blockKeypress" v-model="dogNameToFilter" class="inputField"
                    type="text" :disabled="isShowPopup"></div>
        </div>
        <div class="filter-element ">
            <span class="inputText">Life span</span>
            <div><input @keyup="filterForLifeSpan" @keypress="blockKeypress" v-model="dogLifeSpanToFilter"
                    class="inputField" type="text" :disabled="isShowPopup"></div>
        </div>
        <div class="dropdown-check-list">
            <span @click="showCheckBoxes" class="anchor">Breed group</span>
            <div class="checkboxes" v-show="isShowCheckBoxes">
                <div v-for="breedGroup, index in breedGroups" :key="index">
                    <input :disabled="isShowPopup || isLoading" type="checkbox"
                        @change="addBreedGroup(index, $event)" /><span class="checkbox-text">{{ breedGroup }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="small-buttons">
        <div class="small-button">
            <span @click="!isLoading && !isShowPopup && isLoggedIn ? openCreatePage() : null"
                :class="{ 'small-action-element-inactive': isLoading || isShowPopup || !isLoggedIn, 'small-action-element': !isLoading && !isShowPopup && isLoggedIn }"
                style="border-radius: 10px;">Create Dog</span>
        </div>
        <div class="small-button">
            <span @click="!isLoading && !isShowPopup ? syncDogs() : null"
                :class="{ 'small-action-element-inactive': isLoading || isShowPopup, 'small-action-element': !isLoading && !isShowPopup }"
                style="border-radius: 10px;">Sync Dogs</span>
        </div>
        <div></div>
    </div>
    <div class="pagination-root" v-show="dogs.length > 0">
        <span
            :class="{ 'pagination-arrow-element activeElement': currentPage != 1, 'pagination-arrow-element': currentPage == 1 }"
            @click="currentPage != 1 ? changePage(false) : null">
            <img src="../assets/left-arrow-icon.png" class="pagination-arrow-img" />
        </span>
        <span v-for="int in numberOfPages" :key="int">
            <span class="empty-pagination-element"
                v-if="int == 1 && ((currentPage + 2 >= numberOfPages && numberOfPages > 6) || numberOfPages < 6)">
            </span>
            <span
                :class="{ 'pagination-element activeElement': currentPage != int, 'current-pagination-element': currentPage == int }"
                @click="currentPage == int ? null : changePage(int)" v-if="(int > currentPage - currentNextAndPrevPages - 1 && int < currentPage + currentNextAndPrevPages + 1)
                || int == numberOfPages">
                {{ int }}
            </span>
            <span v-if="int == numberOfPages - 1 && currentPage + 3 < numberOfPages && numberOfPages > 6">
                ...
            </span>
            <span class="empty-pagination-element"
                v-if="int == numberOfPages && ((currentPage + 3 >= numberOfPages && numberOfPages > 6) || numberOfPages < 6)">
            </span>
        </span>
        <span
            :class="{ 'pagination-arrow-element activeElement': currentPage != numberOfPages, 'pagination-arrow-element': currentPage == numberOfPages }"
            @click="currentPage != numberOfPages ? changePage(true) : null">
            <img src="../assets/right-arrow-icon.png" class="pagination-arrow-img" />
        </span>
    </div>
    <div v-if="dogs.length === 0 && isInited" style="text-align: center"><span>Nincs megjeleníthető találat</span></div>
    <div class="cards">
        <div class="card" v-for="dog in dogs" :key="dog.id">
            <img class="dog-image" :src="dog.image.url" />
            <div class="dog-details">
                <div class="dog-data-title" v-if="dog.name != null && dog.name != ''">Name:</div>
                <div v-if="dog.name != null && dog.name != ''">{{ dog.name }}</div>

                <div class="dog-data-title" v-if="dog.height.imperial != null && dog.height.imperial != ''">Height
                    imperial: </div>
                <div v-if="dog.height.imperial != null && dog.height.imperial != ''">{{ dog.height.imperial }}</div>

                <div class="dog-data-title" v-if="dog.height.metric != null && dog.height.metric != ''">Height metric:
                </div>
                <div v-if="dog.height.metric != null && dog.height.metric != ''">{{ dog.height.metric }}</div>

                <div class="dog-data-title" v-if="dog.weight.imperial != null && dog.weight.imperial != ''">Weight
                    imperial: </div>
                <div v-if="dog.weight.imperial != null && dog.weight.imperial != ''">{{ dog.weight.imperial }}</div>

                <div class="dog-data-title" v-if="dog.weight.metric != null && dog.weight.metric != ''">Weight metric:
                </div>
                <div v-if="dog.weight.metric != null && dog.weight.metric != ''">{{ dog.weight.metric }}</div>

                <div class="dog-data-title" v-if="dog.life_span != null && dog.life_span != ''">Life span: </div>
                <div v-if="dog.life_span != null && dog.life_span != ''">{{ dog.life_span }}</div>

                <div class="dog-data-title" v-if="dog.bred_for != null && dog.bred_for != ''">Bred for: </div>
                <div v-if="dog.bred_for != null && dog.bred_for != ''">{{ dog.bred_for }}</div>

                <div class="dog-data-title" v-if="dog.breed_group != null && dog.breed_group != ''">Breed group: </div>
                <div v-if="dog.breed_group != null && dog.breed_group != ''">{{ dog.breed_group }}</div>

                <div class="dog-data-title" v-if="dog.temperament != null && dog.temperament != ''">Temperament: </div>
                <div v-if="dog.temperament != null && dog.temperament != ''">{{ dog.temperament }}</div>

                <div class="dog-data-title" v-if="dog.country_code != null && dog.country_code != ''">CountryCode:
                </div>
                <div v-if="dog.country_code != null && dog.country_code != ''">{{ dog.country_code }}</div>

                <div class="dog-data-title" v-if="dog.origin != null && dog.origin != ''">Origin: </div>
                <div v-if="dog.origin != null && dog.origin != ''">{{ dog.origin }}</div>
            </div>
            <div @click="openEditPage(dog.dogId)" v-if="isLoggedIn"
                :class="{ 'icon-container activeImageElement': !isLoading && !isShowPopup, 'icon-container': isLoading || isShowPopup }">
                <span><img class="icon" src="../assets/pencil.png" /></span>
            </div>
        </div>

    </div>
</template>
  
<script>
import httpResource from "../http/httpResource";
import router from "../router/index";
import utility from "../utils/utility";

const showedNextAndPrevPages = 2;
const minimumTextLengthToFilterName = 3;
const minimumTextLengthToFilterLifeSpan = 2;

export default {
    name: 'DashboardView',
    props: {
        isLoading: Boolean,
        isShowPopup: Boolean,
        isLoggedIn: Boolean,
    },
    data: function () {
        return {
            isInited: false,
            dogs: [],
            numberOfPages: 0,
            currentPage: 0,
            currentNextAndPrevPages: 0,
            dogNameToFilter: '',
            dogLifeSpanToFilter: '',
            breedGroups: [],
            selectedBreedGroups: [],
            needToFilterName: false,
            needToFilterLifeSpan: false,
            needToFilterBreedGroups: false,

            isFilteredByName: false,
            isFilteredByLifeSpan: false,
            isFilteredByBreedGroups: false,

            isShowCheckBoxes: false,
            showImageModal: false,
            currentDog: {},

            async checkLoggedIn() {

                if (this.$cookies.get("userId") != "null") {
                    try {
                        if (!this.isLoading) {
                            this.$emit('loading-spinner', true);
                            const response = await httpResource.post(utility.baseUrl + "auth/refresh");

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {
                                this.$emit('isLoggedIn', true)
                                console.log(response);
                                this.$cookies.set("userId", response.data.user.userId);
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következők miatt:", response));
                                this.$emit('isLoggedIn', false)
                                this.$cookies.set("userId", null);
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);

                        if (error.response != null && error.response.status === 401) {
                            this.$cookies.set("userId", null);
                            this.$emit('isLoggedIn', false);
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A validáció sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                        }
                    }
                }
                else {
                    this.$emit('isLoggedIn', false)
                }
            },

            async getDogs(pageNumber) {
                if (this.needToFilterName || this.needToFilterLifeSpan || this.needToFilterBreedGroups) {
                    this.filter(pageNumber);
                }
                else {
                    try {
                        if (!this.isLoading) {
                            this.$emit('loading-spinner', true);
                            const response = await httpResource.get(utility.baseUrl + `dog/get-dog-page?page=${pageNumber}`);

                            this.$emit('loading-spinner', false);

                            if (response.status === 200) {
                                this.dogs = response.data.dogs;
                                this.numberOfPages = response.data.numberOfPages;
                                this.currentPage = response.data.currentPage;
                                this.isFilteredByName = false;
                                this.isFilteredByLifeSpan = false;
                                this.isFilteredByBreedGroups = false;
                                this.getActualNextAndPrevPages();
                                this.isInited = true;
                            }
                            else {
                                this.$emit('popup-text', utility.createPopupContent("A kutyák lekérése sikertelen a következők miatt:", response));
                            }
                        }
                    }
                    catch (error) {
                        this.$emit('loading-spinner', false);
                        this.$emit('popup-text', utility.createPopupContent("A kutyák lekérése sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                    }
                }
            },

            async changePage(nextPageNumber) {
                let pageToNavigate;
                if (nextPageNumber === true) {
                    pageToNavigate = this.currentPage + 1;
                }
                else if (nextPageNumber === false) {
                    pageToNavigate = this.currentPage - 1;
                }
                else {
                    pageToNavigate = nextPageNumber;
                }
                await this.getDogs(pageToNavigate);
            },

            getActualNextAndPrevPages() {
                if (this.numberOfPages !== 6) {
                    let minimumPageNumber = this.currentPage - showedNextAndPrevPages;
                    let maximumPageNumber = this.currentPage + showedNextAndPrevPages;

                    if (minimumPageNumber < 1) minimumPageNumber = 1;
                    if (maximumPageNumber > this.numberOfPages) maximumPageNumber = this.numberOfPages;

                    let pageNumberToAdd = showedNextAndPrevPages * 2 - (maximumPageNumber - minimumPageNumber);
                    this.currentNextAndPrevPages = showedNextAndPrevPages + pageNumberToAdd;
                }
                else {
                    this.currentNextAndPrevPages = 5;
                }
            },

            showCheckBoxes() {
                this.isShowCheckBoxes = !this.isShowCheckBoxes;
            },

            async filterForName() {
                if (this.dogNameToFilter.length >= minimumTextLengthToFilterName) {
                    this.needToFilterName = true;
                    await this.filter(1);
                }
                else {
                    this.needToFilterName = false;
                    if (this.isFilteredByName) {
                        await this.getDogs(1);
                    }
                }
            },

            async filterForLifeSpan() {
                if (this.dogLifeSpanToFilter.length >= minimumTextLengthToFilterLifeSpan) {
                    this.needToFilterLifeSpan = true;
                    await this.filter(1);
                }
                else {
                    this.needToFilterLifeSpan = false;
                    if (this.isFilteredByLifeSpan) {
                        await this.getDogs(1);
                    }
                }
            },

            async filterForBreedGroups() {
                if (this.selectedBreedGroups.length > 0) {
                    this.needToFilterBreedGroups = true;
                    await this.filter(1);
                }
                else {
                    this.needToFilterBreedGroups = false;
                    if (this.isFilteredByBreedGroups) {
                        await this.getDogs(1);
                    }
                }
            },

            async filter(pageNumber) {
                let filterRequest = {};
                filterRequest.dogName = this.dogNameToFilter;
                filterRequest.dogLifeSpan = this.dogLifeSpanToFilter;
                filterRequest.breedGroups = this.selectedBreedGroups;
                filterRequest.page = pageNumber;

                try {
                    if (!this.isLoading && !this.isShowPopup) {
                        this.$emit('loading-spinner', true);
                        const response = await httpResource.post(utility.baseUrl + "dog/filter", filterRequest);

                        this.$emit('loading-spinner', false);

                        if (response.status === 200) {
                            this.dogs = response.data.dogs;
                            this.numberOfPages = response.data.numberOfPages;
                            this.currentPage = response.data.currentPage;
                            this.isFilteredByName = this.needToFilterName;
                            this.isFilteredByLifeSpan = this.needToFilterLifeSpan;
                            this.isFilteredByBreedGroups = this.needToFilterBreedGroups;
                            this.getActualNextAndPrevPages();
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A kutyák lekérése sikertelen a következők miatt:", response));
                        }
                    }
                }
                catch (error) {
                    this.$emit('loading-spinner', false);
                    this.$emit('popup-text', utility.createPopupContent("A kutyák lekérése sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                }
            },

            addBreedGroup(index, event) {
                if (event.target.checked) {
                    this.selectedBreedGroups.push(index);
                }
                else {
                    let i = this.selectedBreedGroups.indexOf(index);
                    if (i !== -1) {
                        this.selectedBreedGroups.splice(i, 1);
                    }
                }
                this.filterForBreedGroups();
            },
            blockKeypress(event) {
                if (this.isLoading) {
                    event.preventDefault();
                }
            },
            openEditPage(dogId) {
                router.replace(`/breed/${dogId}`);
            },
            openCreatePage() {
                router.replace("/breed/create");
            },
            async syncDogs() {
                try {
                    if (!this.isLoading) {
                        this.$emit('loading-spinner', true);
                        const response = await httpResource.get(utility.baseUrl + "dog/sync-dogs");

                        this.$emit('loading-spinner', false);

                        if (response.status === 200) {
                            this.$emit('popup-text', utility.createPopupContent("A kutyák külső API-val való szinkronizálása sikeresen megtörtént"));
                            this.dogs = response.data.dogs;
                            this.numberOfPages = response.data.numberOfPages;
                            this.currentPage = response.data.currentPage;
                            this.isFilteredByName = false;
                            this.isFilteredByLifeSpan = false;
                            this.isFilteredByBreedGroups = false;
                            this.getActualNextAndPrevPages();
                        }
                        else {
                            this.$emit('popup-text', utility.createPopupContent("A kutyák szinkronizálása sikertelen a következők miatt:", response));
                        }
                    }
                }
                catch (error) {
                    this.$emit('loading-spinner', false);
                    this.$emit('popup-text', utility.createPopupContent("A kutyák szinkronizálása sikertelen a következő hiba miatt:", utility.getErrorMessage(error)));
                }
            },

            initBreedGroups() {
                this.breedGroups = utility.getBreedGroups()
            },

            openImageModal(dog) {
                this.currentDog = dog;
                this.showImageModal = true;
            },
            modalClickHandler(result) {
                if (result === "close") {
                    this.showImageModal = false;
                }
                else if (result === "delete") {
                    this.deleteDog();
                }
            },
            async deleteDog() {
                
            }
        }
    },

    async mounted() {
        this.$emit('currentPage', 'dashboard');
        await this.checkLoggedIn();
        await this.getDogs(1);
        this.initBreedGroups();
    },
}

</script>