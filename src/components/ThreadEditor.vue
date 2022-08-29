<template lang="html">
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit" :name="actionButtonText">{{ actionButtonText }}</button>
    </div>
  </form>
</template>

<script lang="js">

export default {
  name: 'thread-editor',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  mounted () {

  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    actionButtonText () {
      return this.title.length > 0 ? 'Update' : 'Publish'
    }
  },
  methods: {
    save () {
      this.$emit('save', { ...this.form })
    }
  }
}
</script>

<style scoped lang="css"></style>
