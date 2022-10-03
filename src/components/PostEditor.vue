<template lang="html">
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="postCopy.text"
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">{{ buttonText }}</button>
      </div>
    </form>
  </div>
</template>

<script lang="js">

export default {
  name: 'post-editor',
  props: {
    post: {
      type: Object,
      default: () => ({ text: '' })
    }
  },
  data () {
    return {
      postCopy: { ...this.post }
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
    }
  },
  computed: {
    buttonText () {
      return this.post.id === '' ? 'Submit post' : 'Update post'
    }
  }
}
</script>

<style scoped lang="css">
.post-editor {
}
</style>
