<template>
  <div id="app" @keyDown style="padding-top: 4rem">
    <nav class="navbar is-fixed-top is-inline-flex-touch" role="navigation">
      <div class="navbar-brand is-hidden-mobile">
        <router-link class="navbar-item" style="display: block; line-height: 1em" to="/">
          <h1 style="margin: 0px">WCA-Regs</h1>
          <span style="font-size: .65em;">Version: {{this.$root.$data.regulations.version}}</span>
        </router-link>
      </div>
      <div class="navbar-item stretch">
        <div class="control stretch">
          <input class="input" v-model="query" @update="updateRoute" @keyup="keyUpSearch" type="text"/>
        </div>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'app',
  data () {
    return {
      query: this.$route.query.q
    }
  },
  methods: {
    keyUpSearch (e) {
      if (e.keyCode === 13) {
        this.updateRoute()
      }
    },

    updateRoute () {
      if (this.query) {
        this.$router.push({ name: 'search', query: { q: this.query } })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>

body {
  font-weight: 300;
}

.tag {
  font-weight: 500;
}

.article {
  margin-top: 20px;
}

.article-title {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul li, ol li {
  line-height: 175%;
}

ul {
  margin-left: 2em;
}

.indent-1 {
  margin-left: 0em;
}

.indent-2 {
  margin-left: 2em;
}

.indent-3 {
  margin-left: 4em;
}

.indent-4 {
  margin-left: 8em;
}

span.anchor{
  display: block;
  height: 52px; /*same height as header*/
  margin-top: -52px; /*same height as header*/
  visibility: hidden;
}

:target {
  background-color: yellow;
}

:target > .tag {
  background-color: yellow;
}
</style>
