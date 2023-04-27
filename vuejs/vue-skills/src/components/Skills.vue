<template>
  <div class="holder">
  
      <form @submit.prevent="addSkill">
        <transition enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
        <span  class="alert formElement" v-if="v$.skill.$error"> {{ v$.skill.$errors[0].$message }} </span>
        </transition>
          <input class="formElement" type="text" placeholder="Enter a skill...." v-model="skill" name="skill" />
          <transition enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
          <span class="alert formElement" v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }} </span>
          </transition>
          <input class="formElement"  type="text" placeholder="Enter an email address" v-model="email" name="email" />
          <button type="submit" >Submit</button>
      </form>
    
    <ul>
      <transition-group
        name="list"
        enter-active-class="animated bounceInUp"
        leave-active-class="animated bounceOutDown"
      >
        <li v-for="(item,index) in skills" :key="index">
          {{item.skill}}
          <i class="fa fa-minus-circle" v-on:click="remove(index)"></i>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import useValidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'

export default {
  name: "Skills",
  setup () {
    return { v$: useValidate() }
  },
  data() {
    return {
      skills: [{ skill: "Vue.js" }, { skill: "React" }, { skill: "Redis" }],
      skill: "",
      email: "",
      isValidForm: false

    };
  },
  validations() {
    return {
      email: { required, email },
      skill: {required, minLength: minLength(5)},
    }
  },
  methods: {
    addSkill() {
      this.v$.$validate() // checks all inputs
      if (!this.v$.$error) {
        if (this.skill) {
        this.skills.push({ skill: this.skill });
        this.skill = "";
        this.email = "";
      }
       
      } else {
        return
      }
    },
    remove(id) {
      this.skills.splice(id, 1);
    }
  }
};
</script>

<style scoped>
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

.holder {
  background: #fff;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #e0edf4;
  border-left: 5px solid #3eb3f6;
  margin-bottom: 2px;
  color: #3e5252;
}

button {
  background-color: #3eb3f6;
  width: 100%;
  height: 30px;
  color: white;
}

.disabled {
  color: darkgray;
}

p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}

.formElement{
  width: 100%;
}

.container {
  box-shadow: 0px 0px 40px lightgray;
}

input {
  width: calc(100% - 40px);
  border: 0;
  padding: 20px;
  font-size: 1.3em;
  background-color: #323333;
  color: #687f7f;
  border: 1px solid #3eb3f6;
}

.alert {
  color: red;
  font-weight: bold;
  padding: 5px;
  margin-top: -20px;
  display: inline-block;
}
i {
  float: right;
  cursor: pointer;
}
</style>