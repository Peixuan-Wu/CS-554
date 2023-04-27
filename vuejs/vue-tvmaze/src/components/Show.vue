<template>
  <div v-if="this.errorMessage">
  <h3>SHOW NOT FOUND!</h3>
  </div>
  <div v-else>
    <h1>{{this.show.name}}</h1>
    <br />
    <img v-if="this.show.image.medium" :src="this.show.image.medium" />
    <br />
    <span v-html="this.show.summary"></span>
    <br />
    <h4>Genres:</h4>
    <ul>
      <li v-for="genre in this.show.genres" :key="genre">{{genre}}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Show",
  data() {
    return {
      id: this.$route.params.id,
      show: { name: null, image: { medium: null }, summary: null },
      name: null,
      errorMessage:undefined
    };
  },
  methods: {
    async getShow(id) {
      try{
        let {data} = await axios.get ("http://api.tvmaze.com/shows/" + id)
        this.show = data
      }catch (e){
        if (e.response.status==404){
          this.errorMessage = "404! Show Not Found!"
        }
      }
    }
  },
  async created() {
    await this.getShow(this.$route.params.id);
  }
};
</script>

<style scoped>
h1, h4, li,span{
  color: #4ab1a7;
}
h3 {
  margin: 40px 0 0;
  font-weight: bold;
}
h4 {
  
  font-weight: bold;
}

span {
  text-align: center;
  max-width: 50%;
}
div {
  max-width: 50%;
  margin: 0 auto;
}
</style>