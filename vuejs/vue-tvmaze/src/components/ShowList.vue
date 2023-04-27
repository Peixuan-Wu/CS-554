<template>
  <div>
    <ul>
      <li v-for="(show,index) in shows" :key="index">
        <router-link :to="{name: 'show', params: {id: show.id}}">{{show.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ShowList",
  data() {
    return {
      shows: []
    };
  },
  async created() {
    let {data}= await axios.get("http://api.tvmaze.com/shows")
     this.shows = data;
  }
};
</script>

<style scoped>
ul {
  margin: 0;
  list-style-type: none;
}

ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: black;
  border-left: 5px solid #4ab1a7;
  margin-bottom: 2px;
  color: #4ab1a7;
}



p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}
</style>