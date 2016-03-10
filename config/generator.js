/**
 *
 * @param {String} content        the contents of the target file
 * @param {Object} options        contains information about the currently processed file
 * @param {String} options.src    the base name of the current file (like `page.js`)
 * @param {String} options.dest   the base name of the target file (like `myPage.js`)
 * @param {String} options.name   the name of the target (like `myPage`)
 * @param {String} options.dir    the relative path of the target dir (like `ui/pages/home/`)
 * @param {String} options.file   the absolute path of the target file (like `/a-project/ui/pages/home/myPage.js`)
 * @param {String} options.target the target argument as provided on the cli (like `home/myPage`)
 * @param {Object} options.host   the complete contents of the rc file in the cwd
 *
 * @return {String}
 * */
module.exports = function(content, options) {
  return content
}
