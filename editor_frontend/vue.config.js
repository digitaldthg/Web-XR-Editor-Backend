module.exports = {
  publicPath: "/",
  devServer: {
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "./src/scss/variables.scss";
          @import "./src/scss/stylesheet.scss";
          @import "./src/scss/flex.scss";
          @import "./src/scss/card.scss";
          @import "./src/scss/button.scss";
          @import "./src/scss/layout.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config.module.rules.delete("svg");
    config.module.rule('images').use('url-loader').loader('url-loader').tap(options => {
      options.limit = -1
      return options
    });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(gltf)$/,
          use: [
            {
              loader: "gltf-webpack-loader"
            }
          ]
        }, {
          test: /\.(bin|glb|patt|dat)$/,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }, {
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader',]
        }
      ]
    },
    plugins: []
  }
}
