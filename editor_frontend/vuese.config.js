module.exports = {
  /**
   * @description Output directory of the docute document.
   * {@link https://vuese.org/cli/#outdir}
   */
  //outDir: '/documentation',
  include: [
    './src/**/*.vue',
    './src/**/**/*.js',
    './src/Controller/*.js',
    './src/Controller/AuthMixin.js'
  ],
  genType: 'docute',
  title: 'WebXR Editor Code Documentation'
}