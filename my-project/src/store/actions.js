export default {
    actionUserId(context, val) {
        context.commit('setUserId', val)
    },
    actionPassWord(context, val) {
        context.commit('setPassWord', val)
    }
}