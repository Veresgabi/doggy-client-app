<template>
    <div class="popup" id="popup">
        <div style="margin: 20px;">{{content.text}} {{content.responseObj}}</div>
        <div class="popup-button-parent">
            <div id="popupYesButton" class="popup-button" @click="closePopup">Rendben</div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'PopupView',
    props: {
        content: Object
    },
    data: function() {
        return {
            closePopup() {
                this.$emit('popup-result', false);
            }
        }
    }
}

</script>

