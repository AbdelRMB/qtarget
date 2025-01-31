<script>
export default {
  data() {
    return {
      targetActive: false,
      hasFocus: false,
      targetData: [],
      showTarget: false
    };
  },
  methods: {
    updateEye(state) {
      if (state) {
        this.showTarget = false;
      } else {
        this.showTarget = true;
        this.targetData = [];
      }
    },
    showUi(state) {
      this.targetActive = state;
      if (!state) this.updateEye(false);
    },
    handleMessage(event) {
      const item = event.data;
      switch (item.response) {
        case 'openTarget':
          this.showUi(true);
          break;
        case 'closeTarget':
          this.showUi(false);
          break;
        case 'validTarget':
          this.targetData = item.data;
          this.updateEye(true);
          break;
        case 'clickTarget':
          if (this.targetData.length === 1) {
            this.postData('selectTarget', { id: 1 });
            this.showUi(false);
          }
          break;
        case 'leftTarget':
          this.updateEye(false);
          break;
      }
    },
    async postData(event, data) {
      await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    OpenUrl(url) {
      fetch(`https://${GetParentResourceName()}/OpenUrl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
    },
    CopyToClipboard(text) {
      fetch(`https://${GetParentResourceName()}/CopyToClipboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    }
  },
  mounted() {
    window.addEventListener('message', this.handleMessage);
  },
  beforeUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }
};
</script>

<template>
  <div v-if="targetActive" class="target-wrapper">
    <i v-if="showTarget" class="target-eye fa-regular fa-circle fa-xs"></i>
    <i v-else class="target-hand fa-solid fa-hand fa-fw"></i>
    <div class="target-interaction">{{ targetData.length === 1 ? targetData[0].label : 'Interagir' }}</div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400&display=swap');

.target-wrapper {
  display: none;
}

.target-eye {
  transform: translate(-50%, 0);
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
}

.target-hand {
  transform: translate(-50%, 0);
  color: rgba(242, 22, 62, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
}

.target-interaction {
  list-style: none;
  font-size: 1.3vh;
  font-family: 'Ubuntu';
  color: white;
  text-align: left;
  transform: translate(-50%, 0);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 2.35vh;
}

.target-label-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: 3vh;
  margin-top: -1.35vh;
}

.target-label {
  list-style: none;
  font-size: 1.3vh;
  font-family: 'Ubuntu';
  color: white;
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  line-height: 1.3vh;
  padding-left: 0.2vh;
}

.target-icon {
  color: #f2163e;
}

.target-item {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.6) 66%, rgba(0, 0, 0, 0) 100%);
  border: 0px;
  border-left: 0.2vh solid #f2163e;
  border-radius: 0.2vh;
  margin-bottom: 0.2vh;
  width: 25vh;
  padding-left: 1vh;
  height: 2.16vh;
}

.target-item:hover {
  background: linear-gradient(90deg, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.6) 66%, rgba(10, 10, 10, 0) 100%);
  border-left: 0.2vh solid #f22e52;
}
</style>