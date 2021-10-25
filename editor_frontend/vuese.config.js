module.exports = {
  /**
   * @description Output directory of the docute document.
   * {@link https://vuese.org/cli/#outdir}
   */
  //outDir: '/documentation',
  include: [
    './src/**/*.vue',
    './src/**/**/*.js',
  ],
  genType: 'docute',
  title: 'WebXR Editor Code Documentation'
}