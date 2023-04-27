<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="app">
      <div :class="{alert: showAlert}">Test Alert Class</div>
    <div :class="{alert: showAlert, 'another-class': showAnotherClass}">Test Alert and Another Class</div>
    <div :class="{error: showError}">Test Error Class</div>
    <div :class="{error: showError, 'another-class': showAnotherClass}">Test Error and Another Class</div>
    <div :class="alertObject">Test Alert Object Class</div>
		<div :class="errorObject">Test Error Object Class</div>
    <div
      :style="{backgroundColor: bgColor, width: bgWidth, height: bgHeight, border:bgBorder }"
    >Test Alert Object Class</div>
    </div>
  </header>

  <main>
   
  </main>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      showAlert: true,
      showError: true,
      showAnotherClass: true,
      alertObject: {
        alert: true,
        "another-class": true
      },
      errorObject: {
        error: true,
        "another-class": false
      },
      bgColor: "salmon",
      bgWidth: "100%",
      bgHeight: "100px",
      bgBorder: "10px solid red"
    };
  }
};
</script>
<style scoped>
.alert {
  background-color: yellow;
  color: red;
  width: 100%;
  height: 30px;
}
.error {
  background-color: red;
  width: 100%;
  height: 30px;
}

.another-class {
  border: 5px solid blue;
}
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
