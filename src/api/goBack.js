var goBack = function() {
  this.$store.dispatch('tagsView/delView', this.$route)
  this.$router.go(-1)
}
export default goBack
