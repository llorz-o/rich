const home = async (ctx, next) => ctx.body = 'test'

module.exports = {
    'GET /': home
}